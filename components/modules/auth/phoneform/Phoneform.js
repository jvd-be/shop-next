'use client'

import React from 'react'
import { FiPhone, FiMail } from 'react-icons/fi'

import RateLimitMessage from '../RateLimitmessage/RateLimitmessage'

export default function PhoneForm ({
  phone,
  setPhone,
  email,
  setEmail,
  loading,
  rateLimitTimer,
  sendDisabled,
  formatTime,
  onSubmit
}) {
  return (
    <form
      onSubmit={onSubmit}
      className='flex flex-col gap-6 items-center justify-center px-2 md:px-6 lg:px-8 pt-6 md:pt-8 pb-8'
    >
      <div className='flex items-center w-11/12 justify-between gap-3 rounded-lg border border-gray-300 bg-gray-900 px-4 py-2 focus-within:border-blue-500'>
        <input
          type='tel'
          inputMode='tel'
          autoComplete='tel'
          placeholder='شماره تماس'
          dir='ltr'
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className='flex-1 outline-none bg-transparent p-2 text-right placeholder:text-gray-400 text-neutral-200'
        />

        <FiPhone className='text-gray-500' />
      </div>

      <div className='flex items-center w-11/12 justify-between gap-3 rounded-lg border border-gray-300 bg-gray-900 px-4 py-2 focus-within:border-blue-500'>
        <input
          type='email'
          inputMode='email'
          autoComplete='email'
          placeholder='ایمیل (اختیاری برای اعضای جدید)'
          dir='ltr'
          value={email}
          onChange={e => setEmail(e.target.value)}
          className='flex-1 outline-none bg-transparent p-2 text-right placeholder:text-gray-400 text-neutral-200'
        />

        <FiMail className='text-gray-500' />
      </div>

      <RateLimitMessage seconds={rateLimitTimer} formatTime={formatTime} />

      <button
        type='submit'
        disabled={sendDisabled}
        className='flex items-center justify-center w-11/12 text-center rounded-lg bg-blue-600 px-4 py-4 text-neutral-200 disabled:opacity-60 disabled:cursor-not-allowed font-semibold cursor-pointer'
      >
        {loading ? 'در حال ارسال...' : 'ارسال کد یکبار مصرف'}
      </button>
    </form>
  )
}
