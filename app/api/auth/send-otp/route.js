import Otp from '@/model/Otpmodel'
import { NextResponse } from 'next/server'
import ConnectToDB from '@/app/lib/mongodb'
import Usermodel from '@/model/Usermodel'
import crypto from 'crypto'

function validatePhone (phone) {
  return /^09\d{9}$/.test(phone)
}

export async function POST (req) {
  try {
    await ConnectToDB()
    const body = await req.json()
    const { phone } = body

    if (!validatePhone(phone)) {
      return NextResponse.json(
        { message: 'شماره موبایل معتبر نیست' },
        { status: 400 }
      )
    }

    // گرفتن آخرین کد ارسالی بر اساس زمان انقضا یا تاریخ ایجاد
    const lastOtp = await Otp.findOne({ phone }).sort({ _id: -1 })

    if (lastOtp) {
      const timeDifference =
        Date.now() -
        new Date(
          lastOtp.createdAt || lastOtp.createdAtServer || Date.now() - 200000
        ).getTime()
      if (timeDifference < 60000) {
        return NextResponse.json(
          { message: 'لطفا یک دقیقه بعد دوباره تلاش کنید' },
          { status: 429 }
        )
      }
    }

    const user = await Usermodel.findOne({ phone })
    const mode = user ? 'LOGIN' : 'SIGNUP'

    const now = Date.now()
    const expTime = new Date(now + 180000)
    const code = crypto.randomInt(100000, 1000000).toString()
    console.log(
      'OTP CODE =>',
      code,
      'TYPE =>',
      typeof code,
      'LENGTH =>',
      code.length
    )

    // ارسال پیامک
    const smsRes = await fetch('https://api.sms.ir/v1/send/likeToLike', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/plain',
        'X-API-KEY': process.env.SMS_API_KEY
      },
      body: JSON.stringify({
        lineNumber: 30002108008850,
        messageTexts: [`کد تایید شما: ${code}`],
        mobiles: [phone],
        senddatetime: null
      })
    })

    const data = await smsRes.json()

    if (!smsRes.ok || data.status !== 1) {
      console.log('SMS ERROR =>', data)
      return NextResponse.json(
        { message: 'خطا در ارسال پیامک', data },
        { status: 500 }
      )
    }
    await Otp.deleteMany({ phone })

    await Otp.create({
      phone,
      code,
      expTime,
      createdAtServer: new Date()
    })

    return NextResponse.json({ message: 'OTP sent', mode }, { status: 201 })
  } catch (error) {
    console.log('ERROR SEND SMS', error)
    return NextResponse.json({ err: error.message }, { status: 500 })
  }
}
