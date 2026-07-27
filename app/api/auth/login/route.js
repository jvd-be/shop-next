import Usermodel from '@/model/Usermodel'
import ConnectToDB from '@/app/lib/mongodb'
import { NextResponse } from 'next/server'
import { generateToken, verifyPassword } from '@/components/utils/authServer'
export async function POST (req) {
  try {
    await ConnectToDB()
    const body = await req.json()
    const { phone, password } = body

    if (!phone || !password) {
      return NextResponse.json(
        { message: 'لطفاً همه فیلدها را پر کنید' },
        { status: 400 }
      )
    }
    const user = await Usermodel.findOne({ phone: phone }).select('+password')
    if (!user) {
      return NextResponse.json(
        { message: 'کاربری با این شماره یافت نشد' },
        { status: 404 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { message: 'حساب شما غیرفعال است' },
        { status: 403 }
      )
    }

    const isPasswordValid = await verifyPassword(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'رمز عبور یا شماره اشتباه هست' },
        { status: 401 }
      )
    }
const userPayload = {
    userId: user._id.toString(),
    role: user.role,
    name: user.name || "",
    phone: user.phone
};

    const accessToken = await generateToken(
     userPayload,
      'access'
    )
    const refreshToken = await generateToken(userPayload, 'refresh')

     const response = NextResponse.json(
      { message: 'ورود با موفقیت انجام شد' },
      { status: 201 }
    )

    // تنظیمات مشترک برای کوکی‌ها
    const cookieOptions = {
      httpOnly: true,
      // در محیط توسعه (localhost) مقدار secure باید false باشد تا کوکی ست شود
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax',
      path: '/',
    };

    response.cookies.set('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 60 * 1, // 1 hour
    })

    response.cookies.set('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response;


  } catch (error) {
    console.log(error)

    return NextResponse.json(
      { message: error.message || 'خطای سرور' },
      { status: 500 }
    )
  }
}
