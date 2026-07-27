import { NextResponse } from 'next/server'
import ConnectToDB from '@/app/lib/mongodb'
import PopupModel from '@/model/Popupmodel'
import { getAuthFromCookies } from '@/components/utils/authServer'
import mongoose from 'mongoose'
import { unlink } from 'fs/promises'
import path from 'path'

async function removeFile(fileUrl) {
  if (!fileUrl || typeof fileUrl !== 'string' || !fileUrl.startsWith('/')) return

  const filePath = path.join(process.cwd(), 'public', fileUrl)

  try {
    await unlink(filePath)
  } catch (error) {
    // اگر فایل قبلاً حذف شده بود، حذف رکورد نباید fail شود
    console.error('POPUP FILE CLEANUP ERROR:', error)
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

    const contentType = req.headers.get('content-type') || ''
    let id = ''

    if (contentType.includes('application/json')) {
      const body = await req.json().catch(() => ({}))
      id = body?.id?.toString().trim() || ''
    } else if (
      contentType.includes('multipart/form-data') ||
      contentType.includes('application/x-www-form-urlencoded')
    ) {
      const formData = await req.formData().catch(() => null)
      id = formData?.get('id')?.toString().trim() || ''
    }

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه پاپ‌آپ الزامی است' },
        { status: 400 }
      )
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'شناسه پاپ‌آپ نامعتبر است' },
        { status: 400 }
      )
    }

    await ConnectToDB()

    const popup = await PopupModel.findById(id)

    if (!popup) {
      return NextResponse.json(
        { success: false, message: 'پاپ‌آپ پیدا نشد' },
        { status: 404 }
      )
    }

    const imageToDelete = popup.image || ''

    await PopupModel.findByIdAndDelete(id)

    await removeFile(imageToDelete)

    return NextResponse.json(
      {
        success: true,
        message: 'پاپ‌آپ با موفقیت حذف شد'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('DELETE POPUP ERROR:', error)

    return NextResponse.json(
      { success: false, message: 'خطای داخلی سرور' },
      { status: 500 }
    )
  }
}
