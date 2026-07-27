import ConnectToDB from '@/app/lib/mongodb'
import { generateToken, hashPassword } from '@/components/utils/authServer'
import Usermodel from '@/model/Usermodel'
import { NextResponse } from 'next/server'

export async function POST (req) {
  try {
    await ConnectToDB()
    const body = await req.json()
    const password = body.password
    const phone = body.phone?.trim()

    if (!phone || !password) {
      return NextResponse.json(
        { message: 'لطفاً همه فیلدها را پر کنید' },
        { status: 400 }
      )
    }

    const existUser = await Usermodel.findOne({ phone })
    if (existUser) {
      return NextResponse.json(
        { message: 'قبلا بای این شماره ثبت نام انجام شده است لطفا وارد شوید' },
        { status: 409 }
      )
    }
    const hashP =await hashPassword(password)
        const newUser = await Usermodel.create({ password: hashP, phone });


      const accessToken = await generateToken(
     {
    userId: newUser._id.toString(),
    role: newUser.role,
    name: newUser.name || "",
    phone: newUser.phone
  },
      'access'
    )
    const refreshToken = await generateToken({ userId: newUser._id }, 'refresh')

    const response= NextResponse.json(
      { message: 'ثبت‌نام با موفقیت انجام شد' },
      { status: 201 }
    )


    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60
    })

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })

return response
  } catch (error) {
    console.log(error);
    
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
