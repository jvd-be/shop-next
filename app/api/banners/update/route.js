import { NextResponse } from 'next/server'
import ConnectToDB from '@/app/lib/mongodb'
import Bannermodel from '@/model/Bannermodel'
import { getAuthFromCookies } from '@/components/utils/authServer'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

const IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'banner', 'image')
const MOBILE_DIR = path.join(process.cwd(), 'public', 'images', 'banner', 'mobileImage')
const MAX_FILE_SIZE = 5 * 1024 * 1024

function toBool(value) {
  return value === 'true'
}

function toNullableDate(value) {
  if (!value || value === 'null') return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function sanitizeFileName(fileName) {
  return (fileName || 'banner-image').replace(/[^a-zA-Z0-9._-]/g, '-')
}

async function saveFile(file, dir, prefix) {
  await mkdir(dir, { recursive: true })

  const safeName = sanitizeFileName(file.name)
  const fileName = `${Date.now()}-${randomUUID()}-${safeName}`
  const filePath = path.join(dir, fileName)

  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(filePath, buffer)

  return `${prefix}/${fileName}`
}

async function removeFile(fileUrl) {
  if (!fileUrl || typeof fileUrl !== 'string' || !fileUrl.startsWith('/')) return

  const filePath = path.join(process.cwd(), 'public', fileUrl)

  try {
    await unlink(filePath)
  } catch (error) {
    console.error('BANNER FILE CLEANUP ERROR:', error)
  }
}

function validateFile(file) {
  if (!file.type?.startsWith('image/')) {
    return 'فایل انتخاب شده باید تصویر باشد'
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'حجم تصویر بیشتر از حد مجاز است (حداکثر ۵ مگابایت)'
  }
  return null
}

export async function PUT(req) {
  let newImagePath = ''
  let newMobileImagePath = ''
  let oldImagePath = ''
  let oldMobileImagePath = ''

  try {
    // ── Auth ──
    const auth = await getAuthFromCookies()

    if (!auth?.isLoggedIn) {
      return NextResponse.json(
        { message: 'ابتدا وارد حساب شوید' },
        { status: 401 }
      )
    }


    if (auth.user?.role !== 'ADMIN' &&  auth.user?.role !== 'SUPER_ADMIN' ) {
      return NextResponse.json(
        { message: 'دسترسی غیر مجاز' },
        { status: 403 }
      )
    }

    // ── Parse form ──
    const formData = await req.formData()
    const id = formData.get('_id')?.toString().trim()

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه بنر ارسال نشده است' },
        { status: 400 }
      )
    }

    const key = formData.get('key')?.toString().trim() || ''
    const title = formData.get('title')?.toString().trim() || ''
    const subtitle = formData.get('subtitle')?.toString().trim() || ''
    const description = formData.get('description')?.toString().trim() || ''
    const buttonText = formData.get('buttonText')?.toString().trim() || ''
    const buttonLink = formData.get('buttonLink')?.toString().trim() || ''
    const variant = formData.get('variant')?.toString().trim() || ''
    const height = formData.get('height')?.toString().trim() || ''
    const backgroundType = formData.get('backgroundType')?.toString().trim() || ''
    const bgColor = formData.get('bgColor')?.toString().trim() || ''
    const gradientFrom = formData.get('gradientFrom')?.toString().trim() || ''
    const gradientTo = formData.get('gradientTo')?.toString().trim() || ''
    const textColor = formData.get('textColor')?.toString().trim() || ''
    const overlayColor = formData.get('overlayColor')?.toString().trim() || ''

    const overlay = toBool(formData.get('overlay'))
    const isActive = toBool(formData.get('isActive'))
    const startDate = toNullableDate(formData.get('startDate'))
    const endDate = toNullableDate(formData.get('endDate'))

    const imageFile = formData.get('image')
    const mobileImageFile = formData.get('mobileImage')

    // ── Validate ──
    if (!key.trim()) {
      return NextResponse.json(
        { success: false, message: 'فیلد key الزامی است' },
        { status: 400 }
      )
    }

    if (!title.trim()) {
      return NextResponse.json(
        { success: false, message: 'عنوان الزامی است' },
        { status: 400 }
      )
    }

    if (startDate && endDate && startDate > endDate) {
      return NextResponse.json(
        { success: false, message: 'تاریخ شروع نباید بعد از تاریخ پایان باشد' },
        { status: 400 }
      )
    }

    // ── DB ──
    await ConnectToDB()

    const banner = await Bannermodel.findById(id)
    if (!banner) {
      return NextResponse.json(
        { success: false, message: 'بنر پیدا نشد' },
        { status: 404 }
      )
    }

    const duplicateKey = await Bannermodel.findOne({
      key,
      _id: { $ne: id }
    })

    if (duplicateKey) {
      return NextResponse.json(
        { success: false, message: 'این key قبلا ثبت شده است' },
        { status: 409 }
      )
    }

    // ── Process image ──
    if (imageFile && typeof imageFile === 'object' && imageFile.size > 0) {
      const fileError = validateFile(imageFile)
      if (fileError) {
        return NextResponse.json(
          { success: false, message: fileError },
          { status: 400 }
        )
      }

      newImagePath = await saveFile(imageFile, IMAGE_DIR, '/images/banner/image')
      oldImagePath = banner.image || ''
    }

    if (mobileImageFile && typeof mobileImageFile === 'object' && mobileImageFile.size > 0) {
      const fileError = validateFile(mobileImageFile)
      if (fileError) {
        if (newImagePath) await removeFile(newImagePath)
        return NextResponse.json(
          { success: false, message: fileError },
          { status: 400 }
        )
      }

      newMobileImagePath = await saveFile(
        mobileImageFile,
        MOBILE_DIR,
        '/images/banner/mobileImage'
      )
      oldMobileImagePath = banner.mobileImage || ''
    }

    // ── Update ──
    banner.key = key
    banner.title = title
    banner.subtitle = subtitle
    banner.description = description
    banner.buttonText = buttonText
    banner.buttonLink = buttonLink
    banner.height = height
    banner.variant = variant
    banner.backgroundType = backgroundType
    banner.bgColor = bgColor
    banner.gradientFrom = gradientFrom
    banner.gradientTo = gradientTo
    banner.textColor = textColor
    banner.overlay = overlay
    banner.overlayColor = overlayColor
    banner.isActive = isActive
    banner.startDate = startDate
    banner.endDate = endDate

    if (newImagePath) banner.image = newImagePath
    if (newMobileImagePath) banner.mobileImage = newMobileImagePath

    await banner.save()

    // ── Cleanup old files ──
    if (oldImagePath && newImagePath) {
      await removeFile(oldImagePath)
    }

    if (oldMobileImagePath && newMobileImagePath) {
      await removeFile(oldMobileImagePath)
    }

    return NextResponse.json(
      {
        success: true,
        message: 'بنر با موفقیت بروزرسانی شد',
        banner
      },
      { status: 200 }
    )
  } catch (error) {
    // اگر فایل جدید آپلود شده ولی save خطا داد، فایل‌های جدید را پاک کن
    if (newImagePath) {
      await removeFile(newImagePath)
    }

    if (newMobileImagePath) {
      await removeFile(newMobileImagePath)
    }

    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'این key قبلا ثبت شده است' },
        { status: 409 }
      )
    }

    console.error('UPDATE BANNER ERROR:', error)

    return NextResponse.json(
      { success: false, message: 'خطای داخلی سرور' },
      { status: 500 }
    )
  }
}
