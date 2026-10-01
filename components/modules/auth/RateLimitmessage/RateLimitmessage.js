'use client'

import React from 'react'

export default function RateLimitMessage ({
  seconds,
  formatTime,
  type = 'default'
}) {
  if (seconds <= 0) {
    return null
  }

  if (type === 'otp') {
    return (
      <div className='w-11/12 rounded-lg bg-red-900/40 border border-red-700 px-4 py-3 text-center text-sm text-red-300'>
        تعداد تلاش‌های شما بیش از حد مجاز است.

        <div className='mt-2 font-bold text-base'>
          {formatTime(seconds)}
        </div>
      </div>
    )
  }

  return (
    <div className='w-11/12 rounded-lg bg-red-900/40 border border-red-700 px-4 py-3 text-center text-sm text-red-300'>
      به دلیل تعداد زیاد تلاش ناموفق، شماره شما موقتاً مسدود شده است.

      <div className='mt-1 font-bold'>
        {formatTime(seconds)}
      </div>
    </div>
  )
}