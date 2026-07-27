import Otp from '@/model/Otpmodel'
import Usermodel from '@/model/Usermodel'
import ConnectToDB from '@/app/lib/mongodb'
import { NextResponse } from 'next/server'
import { generateToken } from '@/components/utils/authServer'

export async function POST (req) {
  try {
    await ConnectToDB()
    const { phone, code } = await req.json()
console.log( phone, code);

    if (!phone || !code) {
      return NextResponse.json(
        { message: 'شماره تلفن و کد تایید الزامی است' },
        { status: 400 }
      )
    }

    // یافتن کد ذخیره شده در دیتابیس
    const otpRecord = await Otp.findOne({ phone })

    if (!otpRecord) {
      return NextResponse.json(
        { message: 'کد تایید منقضی شده یا وجود ندارد. دوباره ارسال کنید' },
        { status: 404 }
      )
    }

    // بررسی انقضای زمانی به عنوان لایه محافظتی اضافه
    if (new Date() > new Date(otpRecord.expTime)) {
      await Otp.deleteMany({ phone }) // پاکسازی کدهای منقضی شده
      return NextResponse.json(
        { message: 'کد تایید منقضی شده است' },
        { status: 400 }
      )
    }

    // بررسی همخوانی کد وارد شده با دیتابیس
    if (otpRecord.code !== code) {
      return NextResponse.json(
        { message: 'کد وارد شده اشتباه است' },
        { status: 400 }
      )
    }

    // پیدا کردن یا ثبت نام کاربر جدید
    let user = await Usermodel.findOne({ phone })

    if (!user) {
      user = await Usermodel.create({
        phone,
        role: 'USER'
      })
    }

    const userPayload = {
      userId: user._id.toString(),
      role: user.role,
      name: user.name || "",
      phone: user.phone
    }

    // تولید توکن‌ها
    const accessToken = await generateToken(userPayload, 'access')
    const refreshToken = await generateToken(userPayload, 'refresh')

    // ایجاد پاسخ با وضعیت 200 (یا 201 برای ثبت نام جدید)
    const response = NextResponse.json(
      { 
        message: 'ورود با موفقیت انجام شد',
        user: {
          id: user._id,
          phone: user.phone,
          role: user.role
        }
      },
      { status: 200 }
    )

    // تنظیمات مشترک برای کوکی‌ها
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax',
      path: '/',
    }

    // تنظیم کوکی Access Token (زمان انقضا: ۱ ساعت)
    response.cookies.set('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60, // 1 hour (3600 seconds)
    })

    // تنظیم کوکی Refresh Token (زمان انقضا: ۷ روز)
    response.cookies.set('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // حذف کد OTP از دیتابیس قبل از فرستادن پاسخ نهایی
    await Otp.deleteOne({ _id: otpRecord._id })

    return response

  } catch (error) {
    console.error('VERIFY OTP ERROR =>', error)
    return NextResponse.json({ err: error.message }, { status: 500 })
  }
}
