import { NextResponse } from 'next/server'
import ConnectToDB from '@/app/lib/mongodb'
import Usermodel from '@/model/Usermodel'
import {
  generateToken,
  getAuthFromCookies
} from '@/components/utils/authServer'

export async function PUT (req) {
  try {
    await ConnectToDB()
    const auth = await getAuthFromCookies()

    if (!auth.isLoggedIn)
      return NextResponse.json({ message: 'عدم دسترسی' }, { status: 401 })

    const userId = auth.user.userId
    const body = await req.json()

    const { name, email } = body

    // ۱. اعتبارسنجی و بررسی تکراری نبودن ایمیل
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { message: 'فرمت ایمیل وارد شده معتبر نیست.' },
          { status: 400 }
        )
      }

      // اطمینان از عدم وجود ایمیل تکراری در کل دیتابیس برای کاربران دیگر
      const existingEmailUser = await Usermodel.findOne({
        email,
        _id: { $ne: userId }
      })
      if (existingEmailUser) {
        return NextResponse.json(
          { message: 'این ایمیل قبلاً توسط شخص دیگری ثبت شده است.' },
          { status: 400 }
        )
      }
    }

    const updateData = {}
    if (name !== null) updateData.name = name
    if (email !== null) updateData.email = email // اضافه شدن به دیتای آپدیت دیتابیس

    const updatedUser = await Usermodel.findByIdAndUpdate(
      userId,
      {
        $set: updateData
      },
      { new: true }
    )
      .select('-password')
      .lean()

    const response = NextResponse.json(
      {
        message: 'پروفایل با موفقیت آپدیت شد',
        user: updatedUser
      },
      { status: 200 }
    )

    // ساخت توکن جدید شامل نام، شماره تماس و ایمیل جدید کاربر
    const userPayload = {
      userId: updatedUser._id.toString(),
      role: updatedUser.role,
      name: updatedUser.name || '',
      phone: updatedUser.phone,
      email: updatedUser.email || '' // قرار دادن ایمیل در توکن جدید
    }

    const accessToken = await generateToken(userPayload, 'access')
    const refreshToken = await generateToken(userPayload, 'refresh')
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    }

    response.cookies.set('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 // 1 hour
    })

    response.cookies.set('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'خطای سرور' }, { status: 500 })
  }
}
