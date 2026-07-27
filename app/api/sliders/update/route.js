import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'
import SliderModel from '@/model/Slidermodel'
import ConnectToDB from '@/app/lib/mongodb'
import { getAuthFromCookies } from '@/components/utils/authServer'
import { randomUUID } from 'crypto'

const UPLOAD_FOLDER = 'images/sliders'

async function removeFile(fileUrl) {
  if (!fileUrl || typeof fileUrl !== 'string' || !fileUrl.startsWith('/')) return
  const filePath = path.join(process.cwd(), 'public', fileUrl)
  try {
    await fs.unlink(filePath)
  } catch (e) {
    console.error('File cleanup error:', e)
  }
}

async function saveFile(file) {
  const uploadDir = path.join(process.cwd(), 'public', UPLOAD_FOLDER)
  await fs.mkdir(uploadDir, { recursive: true })
  const fileName = `${Date.now()}-${randomUUID()}-${file.name.replace(/\s+/g, '-')}`
  const filePath = path.join(uploadDir, fileName)
  await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()))
  return `/${UPLOAD_FOLDER}/${fileName}`
}

export async function PUT(req) {
  const savedFiles = []
  
  try {
    const auth = await getAuthFromCookies()
    if (!auth?.isLoggedIn || auth.user?.role !== 'ADMIN') {
      return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 })
    }

    await ConnectToDB()
    const formData = await req.formData()
    const rawData = formData.get('data')
    if (!rawData) return NextResponse.json({ message: 'داده ناقص است' }, { status: 400 })

    const sliderData = JSON.parse(rawData)
    const existingSlider = await SliderModel.findById(sliderData._id)
    if (!existingSlider) return NextResponse.json({ message: 'پیدا نشد' }, { status: 404 })

    const processedSlides = []
    
    // شناسایی فایل‌هایی که باید در نهایت پاک شوند (فقط اگر آپلود جدید انجام شد)
    const filesToDelete = []

    for (let i = 0; i < sliderData.slides.length; i++) {
      const slide = sliderData.slides[i]
      const oldSlide = existingSlider.slides[i] || {}

      let imageDesktop = slide.imageDesktop
      let imageMobile = slide.imageMobile

      const desktopFile = formData.get(`desktop_${i}`)
      const mobileFile = formData.get(`mobile_${i}`)

      // جایگزینی دسکتاپ
      if (desktopFile && desktopFile.name) {
        if (oldSlide.imageDesktop) filesToDelete.push(oldSlide.imageDesktop)
        imageDesktop = await saveFile(desktopFile)
        savedFiles.push(imageDesktop)
      }

      // جایگزینی موبایل
      if (mobileFile && mobileFile.name) {
        if (oldSlide.imageMobile) filesToDelete.push(oldSlide.imageMobile)
        imageMobile = await saveFile(mobileFile)
        savedFiles.push(imageMobile)
      }

      processedSlides.push({
        ...slide,
        imageDesktop,
        imageMobile
      })
    }

    // آپدیت دیتابیس
    const updatedSlider = await SliderModel.findByIdAndUpdate(
      sliderData._id,
      { ...sliderData, slides: processedSlides },
      { new: true }
    )

    // پاکسازی فایل‌های قدیمی بعد از آپدیت موفق
    await Promise.all(filesToDelete.map(removeFile))

    return NextResponse.json({ success: true, data: updatedSlider })

  } catch (error) {
    // اگر خطا رخ داد، فایل‌های جدیدی که همین الان آپلود شدند را پاک کن تا فضا اشغال نشود
    await Promise.all(savedFiles.map(removeFile))
    console.error('Update Slider Error:', error)
    return NextResponse.json({ success: false, message: 'خطا در ویرایش' }, { status: 500 })
  }
}
