import { NextResponse } from 'next/server'
import ConnectToDB from '@/app/lib/mongodb'
import SliderModel from '@/model/Slidermodel'
import { getAuthFromCookies } from '@/components/utils/authServer'
import { unlink } from 'fs/promises'
import path from 'path'
import mongoose from 'mongoose'

async function removeFile(fileUrl) {
  if (!fileUrl || typeof fileUrl !== 'string' || !fileUrl.startsWith('/')) return

  const filePath = path.join(process.cwd(), 'public', fileUrl)

  try {
    await unlink(filePath)
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      console.error('SLIDER FILE CLEANUP ERROR:', error)
    }
  }
}

export async function DELETE(req) {
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

    const body = await req.json().catch(() => null)
    const id = body?.id

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { success: false, message: 'شناسه اسلایدر ارسال نشده است' },
        { status: 400 }
      )
    }

    const trimmedId = id.trim()

    if (!mongoose.Types.ObjectId.isValid(trimmedId)) {
      return NextResponse.json(
        { success: false, message: 'شناسه اسلایدر نامعتبر است' },
        { status: 400 }
      )
    }

    await ConnectToDB()

    const deletedSlider = await SliderModel.findByIdAndDelete(trimmedId)

    if (!deletedSlider) {
      return NextResponse.json(
        { success: false, message: 'اسلایدر پیدا نشد' },
        { status: 404 }
      )
    }

    const filesToDelete = (deletedSlider.slides || []).flatMap(slide => [
      slide?.imageDesktop,
      slide?.imageMobile
    ]).filter(Boolean)

    await Promise.all(filesToDelete.map(removeFile))

    return NextResponse.json(
      {
        success: true,
        message: 'اسلایدر با موفقیت حذف شد',
        data: { _id: deletedSlider._id.toString() }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('DELETE SLIDER ERROR:', error)

    return NextResponse.json(
      { success: false, message: 'خطای داخلی سرور' },
      { status: 500 }
    )
  }
}
