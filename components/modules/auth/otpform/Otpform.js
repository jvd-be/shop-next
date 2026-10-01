'use client'

import React from 'react'
import { FiArrowRight } from 'react-icons/fi'
import RateLimitMessage from '../RateLimitmessage/RateLimitmessage'

export default function OtpForm ({
  otp,
  timer,
  rateLimitTimer,
  otpInvalid,
  loading,
  inputsRef,
  verifyDisabled,
  formatTime,
  onChange,
  onKeyDown,
  onPaste,
  onEditPhone,
  onResend,
  onVerify
}) {
  return (
    <div className='flex flex-col gap-6 items-center justify-center px-2 md:px-6 lg:px-8 pt-6 md:pt-8 pb-8'>
      <div
        className='flex items-center justify-center gap-2 w-11/12'
        dir='ltr'
        onPaste={onPaste}
      >
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => {
              inputsRef.current[index] = el
            }}
            type='text'
            inputMode='numeric'
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            value={digit}
            disabled={loading || rateLimitTimer > 0}
            onChange={e => onChange(index, e.target.value)}
            onKeyDown={e => onKeyDown(index, e)}
            className='w-12 h-12 md:w-14 md:h-14 text-center text-lg md:text-xl font-bold rounded-lg border border-gray-500 bg-gray-900 text-white outline-none focus:border-blue-500 disabled:opacity-50'
          />
        ))}
      </div>

      {/* Rate Limit */}

      <RateLimitMessage
        seconds={rateLimitTimer}
        formatTime={formatTime}
        type='otp'
      />


      {otpInvalid && rateLimitTimer <= 0 && (
        <div className='w-11/12 rounded-lg bg-yellow-900/30 border border-yellow-700 px-4 py-3 text-center text-sm text-yellow-300'>
          کد قبلی دیگر معتبر نیست. لطفاً کد جدید دریافت کنید.
        </div>
      )}

      <div className='w-11/12 flex items-center justify-between text-sm text-neutral-300'>
        <button
          type='button'
          onClick={onEditPhone}
          disabled={loading}
          className='flex items-center gap-2 text-blue-400 disabled:opacity-50 cursor-pointer'
        >
          <FiArrowRight />
          ویرایش شماره
        </button>

        {rateLimitTimer > 0 ? (
          <span className='text-red-400'>{formatTime(rateLimitTimer)}</span>
        ) : timer > 0 ? (
          <span>{formatTime(timer)}</span>
        ) : (
          <button
            type='button'
            onClick={onResend}
            disabled={loading}
            className='text-blue-400 disabled:opacity-60 cursor-pointer font-medium'
          >
            ارسال مجدد کد
          </button>
        )}
      </div>


      <button
        type='button'
        onClick={onVerify}
        disabled={verifyDisabled}
        className='flex items-center justify-center w-11/12 text-center rounded-lg bg-blue-600 px-4 py-4 text-neutral-200 disabled:opacity-60 disabled:cursor-not-allowed font-semibold cursor-pointer'
      >
        {loading ? 'در حال بررسی...' : 'تایید و ورود'}
      </button>
    </div>
  )
}
