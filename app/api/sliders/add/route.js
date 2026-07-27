import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import SliderModel from '@/model/Slidermodel'
import ConnectToDB from '@/app/lib/mongodb'
import { getAuthFromCookies } from '@/components/utils/authServer'

const UPLOAD_FOLDER = 'images/sliders'
const VALID_TEXT_POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'center-left',
  'center',
  'center-right',
  'bottom-left',
  'bottom-center',
  'bottom-right'
]
const VALID_ANIMATIONS = ['slide', 'fade']

function sanitizeFileName(fileName) {
  const ext = path.extname(fileName || '')
  const base = path.basename(fileName || '', ext)

  const safeBase = base
    .replace(/[^\w-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)

  const safeExt = ext.replace(/[^\w.]/g, '').slice(0, 10)

  return `${safeBase || 'file'}${safeExt}`
}

async function saveFile(file, folder = UPLOAD_FOLDER) {
  if (!file || typeof file.arrayBuffer !== 'function' || !file.name) {
    return ''
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadDir = path.join(process.cwd(), 'public', folder)
  await fs.mkdir(uploadDir, { recursive: true })

  const safeName = sanitizeFileName(file.name)
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${safeName}`
  const filePath = path.join(uploadDir, fileName)

  await fs.writeFile(filePath, buffer)

  return `/${folder}/${fileName}`
}

async function removeFile(fileUrl) {
  if (!fileUrl || typeof fileUrl !== 'string') return

  const normalizedUrl = fileUrl.replace(/^\/+/, '')
  const filePath = path.join(process.cwd(), 'public', normalizedUrl)

  try {
    await fs.unlink(filePath)
  } catch {
    // Ignore missing files during cleanup.
  }
}

function parseDate(value) {
  if (!value) return undefined

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return date
}

function normalizeBoolean(value, fallback) {
  return typeof value === 'boolean' ? value : fallback
}

function normalizeNumber(value, fallback) {
  return typeof value === 'number' && !Number.isNaN(value) ? value : fallback
}

function validateMainData(data) {
  const errors = []

  if (!data.key || typeof data.key !== 'string') {
    errors.push('key is required')
  }

  if (!data.title || typeof data.title !== 'string') {
    errors.push('title is required')
  }

  if (!Array.isArray(data.slides) || data.slides.length === 0) {
    errors.push('Slider must contain at least one slide')
  }

  if (
    data.autoplayDelay !== undefined &&
    (!Number.isFinite(data.autoplayDelay) || data.autoplayDelay < 0)
  ) {
    errors.push('autoplayDelay must be a non-negative number')
  }

  if (
    data.animation !== undefined &&
    !VALID_ANIMATIONS.includes(data.animation)
  ) {
    errors.push(`animation must be one of: ${VALID_ANIMATIONS.join(', ')}`)
  }

  return errors
}

function validateSlideInput(slide, index, hasDesktopImage) {
  const errors = []

  if (!hasDesktopImage) {
    errors.push(`slides[${index}].imageDesktop is required`)
  }

  if (
    slide.overlayOpacity !== undefined &&
    (!Number.isFinite(slide.overlayOpacity) ||
      slide.overlayOpacity < 0 ||
      slide.overlayOpacity > 100)
  ) {
    errors.push(`slides[${index}].overlayOpacity must be between 0 and 100`)
  }

  if (
    slide.textPosition !== undefined &&
    !VALID_TEXT_POSITIONS.includes(slide.textPosition)
  ) {
    errors.push(`slides[${index}].textPosition is invalid`)
  }

  const startDate = parseDate(slide.startDate)
  const endDate = parseDate(slide.endDate)

  if (slide.startDate && startDate === null) {
    errors.push(`slides[${index}].startDate is invalid`)
  }

  if (slide.endDate && endDate === null) {
    errors.push(`slides[${index}].endDate is invalid`)
  }

  if (startDate && endDate && startDate > endDate) {
    errors.push(`slides[${index}].startDate must be before endDate`)
  }

  return errors
}

// POST /api/sliders/add
export async function POST(req) {
  const savedFiles = []

  try {
    const auth = await getAuthFromCookies()

    if (!auth?.isLoggedIn) {
      return NextResponse.json(
        { success: false, message: 'ابتدا وارد شوید' },
        { status: 401 }
      )
    }

    if (auth.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'دسترسی غیرمجاز' },
        { status: 403 }
      )
    }

    const formData = await req.formData()
    const rawData = formData.get('data')

    if (!rawData || typeof rawData !== 'string') {
      return NextResponse.json(
        { success: false, message: 'data field is required' },
        { status: 400 }
      )
    }

    let parsedData

    try {
      parsedData = JSON.parse(rawData)
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON in data field' },
        { status: 400 }
      )
    }

    const {
      key,
      title,
      slides = [],
      autoplay = true,
      autoplayDelay = 5000,
      loop = true,
      showNavigation = true,
      showPagination = true,
      draggable = true,
      pauseOnHover = true,
      animation = 'slide',
      mobileAspectRatio = '12/11',
      desktopAspectRatio = '999/260',
      isActive = true
    } = parsedData

    const mainErrors = validateMainData({
      key,
      title,
      slides,
      autoplayDelay,
      animation
    })

    if (mainErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: mainErrors
        },
        { status: 400 }
      )
    }

    const normalizedSlides = []
    const slideErrors = []

    for (let index = 0; index < slides.length; index++) {
      const slide = slides[index] || {}

      const desktopFile = formData.get(`desktop_${index}`)
      const mobileFile = formData.get(`mobile_${index}`)

      const existingDesktop =
        typeof slide.imageDesktop === 'string' ? slide.imageDesktop.trim() : ''
      const existingMobile =
        typeof slide.imageMobile === 'string' ? slide.imageMobile.trim() : ''

      const hasDesktopUpload =
        desktopFile &&
        typeof desktopFile === 'object' &&
        typeof desktopFile.arrayBuffer === 'function' &&
        desktopFile.name

      const hasMobileUpload =
        mobileFile &&
        typeof mobileFile === 'object' &&
        typeof mobileFile.arrayBuffer === 'function' &&
        mobileFile.name

      slideErrors.push(
        ...validateSlideInput(slide, index, Boolean(existingDesktop || hasDesktopUpload))
      )

      normalizedSlides.push({
        title: typeof slide.title === 'string' ? slide.title : '',
        subtitle: typeof slide.subtitle === 'string' ? slide.subtitle : '',
        description: typeof slide.description === 'string' ? slide.description : '',
        imageDesktop: existingDesktop,
        imageMobile: existingMobile,
        hasDesktopUpload: Boolean(hasDesktopUpload),
        hasMobileUpload: Boolean(hasMobileUpload),
        desktopFile: hasDesktopUpload ? desktopFile : null,
        mobileFile: hasMobileUpload ? mobileFile : null,
        overlay: normalizeBoolean(slide.overlay, false),
        overlayOpacity: normalizeNumber(slide.overlayOpacity, 20),
        textPosition: slide.textPosition || 'center-left',
        textColor: slide.textColor || '#ffffff',
        buttonText: typeof slide.buttonText === 'string' ? slide.buttonText : '',
        buttonLink: typeof slide.buttonLink === 'string' ? slide.buttonLink : '',
        openInNewTab: normalizeBoolean(slide.openInNewTab, false),
        priority: normalizeNumber(slide.priority, 0),
        isActive: normalizeBoolean(slide.isActive, true),
        startDate: parseDate(slide.startDate),
        endDate: parseDate(slide.endDate)
      })
    }

    if (slideErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: slideErrors
        },
        { status: 400 }
      )
    }

    await ConnectToDB()

    const existingSlider = await SliderModel.findOne({ key })
    if (existingSlider) {
      return NextResponse.json(
        {
          success: false,
          message: 'A slider with this key already exists'
        },
        { status: 409 }
      )
    }

    const processedSlides = []

    for (const slide of normalizedSlides) {
      let imageDesktop = slide.imageDesktop
      let imageMobile = slide.imageMobile

      if (slide.desktopFile) {
        imageDesktop = await saveFile(slide.desktopFile)
        savedFiles.push(imageDesktop)
      }

      if (slide.mobileFile) {
        imageMobile = await saveFile(slide.mobileFile)
        savedFiles.push(imageMobile)
      }

      processedSlides.push({
        title: slide.title,
        subtitle: slide.subtitle,
        description: slide.description,
        imageDesktop,
        imageMobile,
        overlay: slide.overlay,
        overlayOpacity: slide.overlayOpacity,
        textPosition: slide.textPosition,
        textColor: slide.textColor,
        buttonText: slide.buttonText,
        buttonLink: slide.buttonLink,
        openInNewTab: slide.openInNewTab,
        priority: slide.priority,
        isActive: slide.isActive,
        startDate: slide.startDate,
        endDate: slide.endDate
      })
    }

    const createdSlider = await SliderModel.create({
      key: key.trim(),
      title: title.trim(),
      slides: processedSlides,
      autoplay: normalizeBoolean(autoplay, true),
      autoplayDelay: normalizeNumber(autoplayDelay, 5000),
      loop: normalizeBoolean(loop, true),
      showNavigation: normalizeBoolean(showNavigation, true),
      showPagination: normalizeBoolean(showPagination, true),
      draggable: normalizeBoolean(draggable, true),
      pauseOnHover: normalizeBoolean(pauseOnHover, true),
      animation,
      mobileAspectRatio,
      desktopAspectRatio,
      isActive: normalizeBoolean(isActive, true)
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Slider created successfully',
        data: createdSlider
      },
      { status: 201 }
    )
  } catch (error) {
    await Promise.all(savedFiles.map(removeFile))

    console.error('ADD SLIDER ERROR:', error)

    if (error?.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message)

      return NextResponse.json(
        {
          success: false,
          message: 'Mongoose validation failed',
          errors
        },
        { status: 400 }
      )
    }

    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: 'Duplicate key error. Slider key must be unique.'
        },
        { status: 409 }
      )
    }

return NextResponse.json(
  {
    success: true,
    message: 'Slider created successfully',
    data: createdSlider
  },
  { status: 201 }
)
  }
}
