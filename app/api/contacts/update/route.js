import { NextResponse } from 'next/server'
import ConnectToDB from '@/app/lib/mongodb'
import Contactmodel from '@/model/Contactmodel'
import { getAuthFromCookies } from '@/components/utils/authServer'

export async function PUT(req) {
  try {
    await ConnectToDB()

    const auth = await getAuthFromCookies()

    // ✅ بررسی لاگین
    if (!auth?.isLoggedIn) {
      return NextResponse.json(
        { success: false, message: 'ابتدا وارد شوید' },
        { status: 401 }
      )
    }

    // ✅ بررسی نقش
    if (auth.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'دسترسی غیرمجاز' },
        { status: 403 }
      )
    }

    const body = await req.json()

console.log("BODY RECEIVED:", body)

    const mobilePhone = body?.mobilePhone?.trim()
    const storePhone = body?.storePhone?.trim()
    const email = body?.email?.trim().toLowerCase()

    // ✅ بررسی خالی نبودن
    if (!mobilePhone || !storePhone || !email) {
      return NextResponse.json(
        { success: false, message: 'همه فیلدها الزامی هستند' },
        { status: 400 }
      )
    }

    // ✅ ولیدیشن شماره همراه ایران
    const mobileRegex = /^(09\d{9}|\+989\d{9})$/
    if (!mobileRegex.test(mobilePhone)) {
      return NextResponse.json(
        { success: false, message: 'فرمت شماره همراه معتبر نیست' },
        { status: 400 }
      )
    }

    // ✅ ولیدیشن شماره ثابت ایران (مثال: 02112345678 یا +982112345678)
    const storeRegex = /^(0\d{2}\d{8}|\+98\d{2}\d{8})$/
    if (!storeRegex.test(storePhone)) {
      return NextResponse.json(
        { success: false, message: 'فرمت شماره فروشگاه معتبر نیست' },
        { status: 400 }
      )
    }

    // ✅ ولیدیشن ایمیل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'فرمت ایمیل معتبر نیست' },
        { status: 400 }
      )
    }

    const updatedContact = await Contactmodel.findOneAndUpdate(
      {},
      {
        mobilePhone,
        storePhone,
        email
      },
      {
        new: true,
        upsert: true, // ✅ اگر نبود بسازد
        runValidators: true
      }
    )

    return NextResponse.json(
      {
        success: true,
        message: 'اطلاعات تماس با موفقیت ذخیره شد',
        data: updatedContact
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('PUT /api/contacts/update error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'خطا در بروزرسانی اطلاعات تماس'
      },
      { status: 500 }
    )
  }
}
