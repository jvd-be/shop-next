import Otp from '@/model/Otpmodel'
import OtpRateLimit from '@/model/OtpRateLimit'
import Usermodel from '@/model/Usermodel'
import ConnectToDB from '@/app/lib/mongodb'
import { NextResponse } from 'next/server'
import { generateToken } from '@/components/utils/authServer'

const MAX_ATTEMPTS = 10
const MAX_OTP_ATTEMPTS = 5

const WINDOW_TIME = 15 * 60 * 1000
const LOCK_TIME = 15 * 60 * 1000

function validatePhone(phone) {
  return /^09\d{9}$/.test(phone)
}

function validateCode(code) {
  return /^\d{6}$/.test(code)
}


async function registerFailedAttempt(phone) {
  const now = new Date()
  const windowStartLimit = new Date(
    now.getTime() - WINDOW_TIME
  )

  const result = await OtpRateLimit.findOneAndUpdate(
    { phone },
    [
      {
        $set: {
          attempts: {
            $cond: [
              {
                $or: [
                  { $eq: ['$windowStart', null] },
                  {
                    $lte: [
                      '$windowStart',
                      windowStartLimit
                    ]
                  }
                ]
              },
              1,
              {
                $add: [
                  { $ifNull: ['$attempts', 0] },
                  1
                ]
              }
            ]
          },

          windowStart: {
            $cond: [
              {
                $or: [
                  { $eq: ['$windowStart', null] },
                  {
                    $lte: [
                      '$windowStart',
                      windowStartLimit
                    ]
                  }
                ]
              },
              now,
              '$windowStart'
            ]
          },

          lockedUntil: {
            $cond: [
              {
                $or: [
                  { $eq: ['$windowStart', null] },
                  {
                    $lte: [
                      '$windowStart',
                      windowStartLimit
                    ]
                  }
                ]
              },
              null,
              '$lockedUntil'
            ]
          }
        }
      },

      {
        $set: {
          lockedUntil: {
            $cond: [
              {
                $gte: [
                  '$attempts',
                  MAX_ATTEMPTS
                ]
              },
              new Date(
                now.getTime() + LOCK_TIME
              ),
              '$lockedUntil'
            ]
          }
        }
      }
    ],
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  )

  return result
}

async function getActiveRateLimit(phone) {
  const attempt = await OtpRateLimit.findOne({
    phone
  }).lean()

  if (!attempt) {
    return null
  }

  const now = Date.now()

  if (
    attempt.lockedUntil &&
    new Date(attempt.lockedUntil).getTime() > now
  ) {
    return attempt
  }

  return null
}

export async function POST(req) {
  try {
    await ConnectToDB()

    const body = await req.json()

    const phone =
      typeof body?.phone === 'string'
        ? body.phone.trim()
        : ''

    const code =
      typeof body?.code === 'string'
        ? body.code.trim()
        : ''

    if (!phone || !code) {
      return NextResponse.json(
        {
          message:
            'شماره تلفن و کد تایید الزامی است'
        },
        {
          status: 400
        }
      )
    }

    if (!validatePhone(phone)) {
      return NextResponse.json(
        {
          message:
            'شماره موبایل معتبر نیست'
        },
        {
          status: 400
        }
      )
    }

    if (!validateCode(code)) {
      return NextResponse.json(
        {
          message:
            'کد تایید باید ۶ رقمی باشد'
        },
        {
          status: 400
        }
      )
    }

    const activeRateLimit =
      await getActiveRateLimit(phone)

    if (activeRateLimit) {
      const now = Date.now()

      const lockedUntil = new Date(
        activeRateLimit.lockedUntil
      ).getTime()

      const remainingSeconds = Math.ceil(
        (lockedUntil - now) / 1000
      )

      return NextResponse.json(
        {
          message:
            `تعداد تلاش‌ها بیش از حد مجاز است. لطفاً ${remainingSeconds} ثانیه دیگر دوباره تلاش کنید`
        },
        {
          status: 429
        }
      )
    }

    const otpRecord = await Otp.findOne({
      phone
    }).lean()

    if (!otpRecord) {
      return NextResponse.json(
        {
          message:
            'کد تایید منقضی شده یا وجود ندارد. دوباره کد دریافت کنید'
        },
        {
          status: 404
        }
      )
    }


    if (
      new Date(otpRecord.expTime).getTime() <=
      Date.now()
    ) {
      await Otp.deleteOne({
        _id: otpRecord._id
      })

      return NextResponse.json(
        {
          message:
            'کد تایید منقضی شده است'
        },
        {
          status: 400
        }
      )
    }

    if (otpRecord.code !== code) {
  
      const updatedOtp =
        await Otp.findOneAndUpdate(
          {
            _id: otpRecord._id,
            times: {
              $lt: MAX_OTP_ATTEMPTS
            }
          },
          {
            $inc: {
              times: 1
            }
          },
          {
            new: true
          }
        )

  
      if (!updatedOtp) {
        await Otp.deleteOne({
          _id: otpRecord._id
        })

        return NextResponse.json(
          {
            message:
              'این کد بیش از حد اشتباه وارد شده است. لطفاً کد جدید دریافت کنید'
          },
          {
            status: 429
          }
        )
      }

      const rateLimit =
        await registerFailedAttempt(phone)

 
      if (
        rateLimit.attempts >=
        MAX_ATTEMPTS
      ) {
        await Otp.deleteOne({
          _id: otpRecord._id
        })

        return NextResponse.json(
          {
            message:
              'تعداد تلاش‌های شما بیش از حد مجاز است. لطفاً ۱۵ دقیقه بعد دوباره تلاش کنید'
          },
          {
            status: 429
          }
        )
      }

   
      if (
        updatedOtp.times >=
        MAX_OTP_ATTEMPTS
      ) {
        await Otp.deleteOne({
          _id: updatedOtp._id
        })

        const remainingGlobalAttempts =
          Math.max(
            0,
            MAX_ATTEMPTS -
              rateLimit.attempts
          )

        return NextResponse.json(
          {
            message:
              `این کد بیش از حد اشتباه وارد شده است. لطفاً کد جدید دریافت کنید. ${remainingGlobalAttempts} تلاش کلی باقی مانده`
          },
          {
            status: 429
          }
        )
      }

      const remainingOtpAttempts =
        Math.max(
          0,
          MAX_OTP_ATTEMPTS -
            updatedOtp.times
        )

      const remainingGlobalAttempts =
        Math.max(
          0,
          MAX_ATTEMPTS -
            rateLimit.attempts
        )

      return NextResponse.json(
        {
          message:
            `کد وارد شده اشتباه است. ${remainingOtpAttempts} تلاش برای این کد و ${remainingGlobalAttempts} تلاش کلی باقی مانده`
        },
        {
          status: 400
        }
      )
    }


    const consumedOtp =
      await Otp.findOneAndDelete({
        _id: otpRecord._id,
        phone,
        code,
        expTime: {
          $gt: new Date()
        }
      })

    if (!consumedOtp) {
      return NextResponse.json(
        {
          message:
            'کد تایید منقضی شده یا قبلاً استفاده شده است. دوباره کد دریافت کنید'
        },
        {
          status: 400
        }
      )
    }

    let user = await Usermodel.findOne({
      phone
    })

   
    if (user?.isBanned) {
      await OtpRateLimit.deleteOne({
        phone
      })

      return NextResponse.json(
        {
          message:
            'شما توسط مدیر بن شدید. لطفا برای رسیدگی به شماره ۰۹۰۱۰۰۲۰۲۹ در ارتباط باشید'
        },
        {
          status: 403
        }
      )
    }

  
    if (!user) {
      user = await Usermodel.create({
        phone,
        role: 'USER',
        isActive: true,
        isBanned: false
      })
    }

    const userPayload = {
      userId: user._id.toString(),
      role: user.role,
      name: user.name || '',
      phone: user.phone
    }

    const accessToken =
      await generateToken(
        userPayload,
        'access'
      )

    const refreshToken =
      await generateToken(
        userPayload,
        'refresh'
      )

    const response =
      NextResponse.json(
        {
          message:
            'ورود با موفقیت انجام شد',

          user: {
            id: user._id,
            phone: user.phone,
            role: user.role
          }
        },
        {
          status: 200
        }
      )

    const cookieOptions = {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        'production',
      sameSite: 'lax',
      path: '/'
    }

    response.cookies.set(
      'accessToken',
      accessToken,
      {
        ...cookieOptions,
        maxAge: 60 * 60
      }
    )

    response.cookies.set(
      'refreshToken',
      refreshToken,
      {
        ...cookieOptions,
        maxAge:
          60 * 60 * 24 * 7
      }
    )

   
    await OtpRateLimit.deleteOne({
      phone
    })

    return response
  } catch (error) {
    console.error(
      'VERIFY OTP ERROR =>',
      error
    )

    return NextResponse.json(
      {
        message:
          'خطا در تایید کد'
      },
      {
        status: 500
      }
    )
  }
}