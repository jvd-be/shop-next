'use client'

import React from 'react'

export default function Authheader ({
  step,
  phone
}) {
  return (
    <div className='flex flex-col justify-center items-center w-full pt-4'>
      <h1 className='text-2xl md:text-3xl font-semibold text-white'>
        {step === 'form'
          ? 'ورود یا ثبت‌نام'
          : 'تایید شماره موبایل'}
      </h1>

      <h3 className='text-base text-neutral-300 py-4 text-center px-4'>
        {step === 'form'
          ? 'شماره موبایل خود را وارد کنید'
          : `کد ارسال شده به ${phone} را وارد کنید`}
      </h3>
    </div>
  )
}