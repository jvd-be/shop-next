import { NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import ConnectToDB from '@/app/lib/mongodb'
import GeneralModel from '@/model/GeneralModel'
import { getAuthFromCookies } from '@/components/utils/authServer'

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

async function saveFile(file, folder = '') {
  if (!file || typeof file === 'string' || typeof file.arrayBuffer !== 'function') {
    return ''
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const fileName = `${randomUUID()}-${sanitizeFileName(file.name)}`
  const uploadDir = path.join(
    process.cwd(),
    'public',
    'images',
    'general-seo',
    folder
  )

  await mkdir(uploadDir, { recursive: true })

  const filePath = path.join(uploadDir, fileName)
  await writeFile(filePath, buffer)

  return `/images/general-seo/${folder}/${fileName}`
}

async function removeFile(fileUrl) {
  if (!fileUrl || typeof fileUrl !== 'string') return

  const normalized = fileUrl.replace(/^\/+/, '')
  const filePath = path.join(process.cwd(), 'public', normalized)

  try {
    await unlink(filePath)
  } catch {
    // ignore missing files
  }
}

export async function PUT(req) {
  const savedFiles = []

  try {
    const auth = await getAuthFromCookies()

    if (!auth?.isLoggedIn) {
      return NextResponse.json(
        { ok: false, message: 'ابتدا وارد شوید' },
        { status: 401 }
      )
    }

    if (auth.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { ok: false, message: 'دسترسی غیرمجاز' },
        { status: 403 }
      )
    }

    await ConnectToDB()

    const formData = await req.formData()

    const siteName = String(formData.get('siteName') || '').trim()
    const siteDescription = String(formData.get('siteDescription') || '').trim()
    const siteUrl = String(formData.get('siteUrl') || '').trim()
    const maintenanceMode = formData.get('maintenanceMode') === 'true'

    if (!siteName) {
      return NextResponse.json(
        { ok: false, message: 'siteName is required' },
        { status: 400 }
      )
    }

    const siteLogo = formData.get('siteLogo')
    const favicon = formData.get('favicon')
    const defaultOgImage = formData.get('defaultOgImage')

    const general = await GeneralModel.findOne()

    const updateData = {
      siteName,
      siteDescription,
      siteUrl,
      maintenanceMode
    }

    const oldFiles = []

    if (siteLogo && typeof siteLogo !== 'string') {
      updateData.siteLogo = await saveFile(siteLogo, 'logo')
      savedFiles.push(updateData.siteLogo)
      if (general?.siteLogo) oldFiles.push(general.siteLogo)
    }

    if (favicon && typeof favicon !== 'string') {
      updateData.favicon = await saveFile(favicon, 'favicon')
      savedFiles.push(updateData.favicon)
      if (general?.favicon) oldFiles.push(general.favicon)
    }

    if (defaultOgImage && typeof defaultOgImage !== 'string') {
      updateData.defaultOgImage = await saveFile(defaultOgImage, 'og')
      savedFiles.push(updateData.defaultOgImage)
      if (general?.defaultOgImage) oldFiles.push(general.defaultOgImage)
    }

    let result

    if (!general) {
      result = await GeneralModel.create(updateData)
    } else {
      result = await GeneralModel.findByIdAndUpdate(general._id, updateData, {
        new: true
      })
    }

    await Promise.all(oldFiles.map(removeFile))

    return NextResponse.json({
      ok: true,
      data: result
    })
  } catch (error) {
    await Promise.all(savedFiles.map(removeFile))
    console.error('UPDATE GENERAL ERROR:', error)

    return NextResponse.json(
      { ok: false, message: 'server error' },
      { status: 500 }
    )
  }
}
