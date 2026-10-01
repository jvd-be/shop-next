import Otp from '@/model/Otpmodel'
import { NextResponse } from 'next/server'
import ConnectToDB from '@/app/lib/mongodb'
import Usermodel from '@/model/Usermodel'
import crypto from 'crypto'

function validatePhone(phone) {
  return typeof phone === 'string' && /^09\d{9}$/.test(phone)
}

export async function POST(req) {
  try {
    await ConnectToDB()

    const body = await req.json()
    const phone = body?.phone?.trim()


    if (!validatePhone(phone)) {
      return NextResponse.json(
        {
          message: 'شماره موبایل معتبر نیست'
        },
        { status: 400 }
      )
    }


    const user = await Usermodel.findOne({ phone })


    if (user?.isBanned) {
      return NextResponse.json(
        {
          message:
            'شما توسط مدیر بن شدید. لطفا برای رسیدگی به شماره ۰۹۰۱۰۰۲۰۲۹ در ارتباط باشید'
        },
        { status: 403 }
      )
    }


    const lastOtp = await Otp.findOne({ phone })

    if (lastOtp) {
      const elapsed =
        Date.now() -
        new Date(lastOtp.createdAt).getTime()

      // هر 60 ثانیه یک بار
      if (elapsed < 60 * 1000) {
        const remaining = Math.ceil(
          (60 * 1000 - elapsed) / 1000
        )

        return NextResponse.json(
          {
            message: `لطفاً ${remaining} ثانیه دیگر دوباره تلاش کنید`
          },
          { status: 429 }
        )
      }
    }

 
    const mode = user ? 'LOGIN' : 'SIGNUP'


    const code = crypto
      .randomInt(100000, 1000000)
      .toString()

    const expTime = new Date(
      Date.now() + 3 * 60 * 1000
    )


    const smsRes = await fetch(
      'https://api.sms.ir/v1/send/likeToLike',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-API-KEY': process.env.SMS_API_KEY
        },

        body: JSON.stringify({
          lineNumber: 30002108008850,
          messageTexts: [
            `کد تایید شما: ${code}`
          ],
          mobiles: [phone],
          senddatetime: null
        })
      }
    )

    const smsText = await smsRes.text()

    let data

    try {
      data = JSON.parse(smsText)
    } catch {
      data = null
    }

    if (!smsRes.ok || data?.status !== 1) {
      console.error('SMS ERROR =>', {
        status: smsRes.status,
        response: smsText
      })

      return NextResponse.json(
        {
          message: 'خطا در ارسال پیامک'
        },
        { status: 500 }
      )
    }


    await Otp.deleteOne({
      phone
    })


    await Otp.create({
      phone,
      code,
      expTime,
      times: 0
    })

    if (process.env.NODE_ENV !== 'production') {
      console.log(
        'OTP CODE =>',
        code
      )
    }

    return NextResponse.json(
      {
        message: 'کد برای شما ارسال شد',
        mode
      },
      { status: 201 }
    )

  } catch (error) {
    console.error(
      'ERROR SEND OTP =>',
      error
    )

    return NextResponse.json(
      {
        message: 'خطا در ارسال کد تایید'
      },
      { status: 500 }
    )
  }
}