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

function validateInput(data) {
  if (!data.key?.trim()) return 'فیلد key الزامی است'
  if (!data.title?.trim()) return 'عنوان الزامی است'

  if (data.startDate && data.endDate && data.startDate > data.endDate) {
    return 'تاریخ شروع نباید بعد از تاریخ پایان باشد'
  }

  return null
}

export async function POST(req) {
  let savedImagePath = ''
  let savedMobileImagePath = ''

  try {
    const auth = await getAuthFromCookies()
    console.log(auth.user);
    
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

    const formData = await req.formData()

    const key = formData.get('key')?.toString().trim() || ''
    const title = formData.get('title')?.toString().trim() || ''
    const subtitle = formData.get('subtitle')?.toString().trim() || ''
    const description = formData.get('description')?.toString().trim() || ''
    const buttonText = formData.get('buttonText')?.toString().trim() || ''
    const buttonLink = formData.get('buttonLink')?.toString().trim() || ''
    const variant = formData.get('variant')?.toString().trim() || ''
    const bgColor = formData.get('bgColor')?.toString().trim() || ''
    const gradientFrom = formData.get('gradientFrom')?.toString().trim() || ''
    const gradientTo = formData.get('gradientTo')?.toString().trim() || ''
    const textColor = formData.get('textColor')?.toString().trim() || ''
    const height = formData.get('height')?.toString().trim() || ''
    const overlayColor = formData.get('overlayColor')?.toString().trim() || ''
    const backgroundType = formData.get('backgroundType')?.toString().trim() || ''

    const overlay = toBool(formData.get('overlay'))
    const isActive = toBool(formData.get('isActive'))
    const startDate = toNullableDate(formData.get('startDate'))
    const endDate = toNullableDate(formData.get('endDate'))

    const image = formData.get('image')
    const mobileImage = formData.get('mobileImage')

    const inputData = {
      key,
      title,
      subtitle,
      description,
      buttonText,
      buttonLink,
      variant,
      bgColor,
      gradientFrom,
      gradientTo,
      textColor,
      height,
      overlay,
      overlayColor,
      isActive,
      startDate,
      endDate,
      backgroundType
    }

    const validationError = validateInput(inputData)
    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      )
    }

    await ConnectToDB()

    const exists = await Bannermodel.findOne({ key })
    if (exists) {
      return NextResponse.json(
        { success: false, message: 'Banner key already exists' },
        { status: 409 }
      )
    }

    if (image && typeof image === 'object' && image.size > 0) {
      if (!image.type?.startsWith('image/')) {
        return NextResponse.json(
          { success: false, message: 'فایل تصویر دسکتاپ نامعتبر است' },
          { status: 400 }
        )
      }

      if (image.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, message: 'حجم تصویر دسکتاپ بیشتر از حد مجاز است' },
          { status: 400 }
        )
      }

      savedImagePath = await saveFile(
        image,
        IMAGE_DIR,
        '/images/banner/image'
      )
    }

    if (mobileImage && typeof mobileImage === 'object' && mobileImage.size > 0) {
      if (!mobileImage.type?.startsWith('image/')) {
        return NextResponse.json(
          { success: false, message: 'فایل تصویر موبایل نامعتبر است' },
          { status: 400 }
        )
      }

      if (mobileImage.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, message: 'حجم تصویر موبایل بیشتر از حد مجاز است' },
          { status: 400 }
        )
      }

      savedMobileImagePath = await saveFile(
        mobileImage,
        MOBILE_DIR,
        '/images/banner/mobileImage'
      )
    }

    const newBanner = await Bannermodel.create({
      ...inputData,
      image: savedImagePath || null,
      mobileImage: savedMobileImagePath || null
    })

    return NextResponse.json(
      { success: true, banner: newBanner },
      { status: 201 }
    )
  } catch (error) {
    if (savedImagePath) {
      await removeFile(savedImagePath)
    }

    if (savedMobileImagePath) {
      await removeFile(savedMobileImagePath)
    }

    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Banner key already exists' },
        { status: 409 }
      )
    }

    console.error('CREATE BANNER ERROR:', error)

    return NextResponse.json(
      { success: false, message: 'Failed to create banner' },
      { status: 500 }
    )
  }
}
