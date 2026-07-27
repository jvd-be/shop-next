import { NextResponse } from 'next/server'
import ConnectToDB from '@/app/lib/mongodb'
import Bannermodel from '@/model/Bannermodel'
import { getAuthFromCookies } from '@/components/utils/authServer'
import { unlink } from 'fs/promises'
import path from 'path'

// تابع کمکی برای حذف فایل از روی دیسک سرور
async function removeFile(fileUrl) {
  if (!fileUrl || typeof fileUrl !== 'string' || !fileUrl.startsWith('/')) return

  const filePath = path.join(process.cwd(), 'public', fileUrl)

  try {
    await unlink(filePath)
  } catch (error) {
    // خطا در حذف فایل نباید کل فرآیند API را متوقف کند، فقط لاگ می‌شود.
    console.error(`FAILED TO DELETE FILE [${filePath}]:`, error.message)
  }
}

export async function DELETE(req) {
  try {
    // ۱. بررسی احراز هویت و مجوزها (قبل از اتصال به دیتابیس)
    const auth = await getAuthFromCookies()
    
    if (!auth?.isLoggedIn) {
      return NextResponse.json(
        { success: false, message: 'ابتدا وارد حساب شوید' },
        { status: 401 }
      )
    }

    if (auth.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'دسترسی غیر مجاز' },
        { status: 403 }
      )
    }

    // ۲. بررسی شناسه ورودی
    const body = await req.json().catch(() => ({}))
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'شناسه بنر الزامی است' },
        { status: 400 }
      )
    }

    // ۳. اتصال به دیتابیس
    await ConnectToDB()

    // ۴. پیدا کردن بنر برای استخراج آدرس فایل‌های تصویر
    const banner = await Bannermodel.findById(id)

    if (!banner) {
      return NextResponse.json(
        { success: false, message: 'بنر مورد نظر یافت نشد' },
        { status: 404 }
      )
    }

    // نگهداری آدرس فایل‌ها قبل از حذف سند دیتابیس
    const imageToDelete = banner.image
    const mobileImageToDelete = banner.mobileImage

    // ۵. حذف سند از دیتابیس
    await Bannermodel.findByIdAndDelete(id)

    // ۶. حذف فایل‌های فیزیکی از سرور (عملیات غیرهمزمان بدون مسدود کردن پاسخ به کلاینت)
    if (imageToDelete) {
      await removeFile(imageToDelete)
    }
    if (mobileImageToDelete) {
      await removeFile(mobileImageToDelete)
    }

    return NextResponse.json(
      { success: true, message: 'بنر و فایل‌های مرتبط با موفقیت حذف شدند' },
      { status: 200 }
    )

  } catch (error) {
    console.error('DELETE BANNER ERROR:', error)
    return NextResponse.json(
      { success: false, message: 'خطای داخلی سرور در حذف بنر' },
      { status: 500 }
    )
  }
}
