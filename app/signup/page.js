'use client'

import React, { useRef, useState } from 'react'
import { FiPhone, FiMail, FiArrowRight } from 'react-icons/fi'
import { UseNotification } from '@/components/hooks/UseNotification'
import { useRouter } from 'next/navigation'
import Cardnotification from '@/components/modules/cardnotification/Cardnotification'
import { FaCheck } from 'react-icons/fa'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

function AuthPage () {
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('form')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(180)
  const inputsRef = useRef([])
  const router = useRouter()
  const { notification, showNotification } = UseNotification()
  const toEnglishDigits = str => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
    let newStr = String(str)

    for (let i = 0; i < 10; i++) {
      newStr = newStr.replace(new RegExp(persianDigits[i], 'g'), String(i))
      newStr = newStr.replace(new RegExp(arabicDigits[i], 'g'), String(i))
    }

    return newStr
  }

  const normalizePhone = value => {
    let normalized = toEnglishDigits(value).trim()
    normalized = normalized.replace(/\s|-/g, '')

    if (normalized.startsWith('+98')) {
      normalized = '0' + normalized.slice(3)
    } else if (normalized.startsWith('98')) {
      normalized = '0' + normalized.slice(2)
    }

    return normalized
  }

  const formatTime = seconds => {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${min}:${sec < 10 ? '0' : ''}${sec}`
  }

  React.useEffect(() => {
    if (step !== 'otp' || timer <= 0) return

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [step, timer])

  const sendOtpHandler = async () => {
    const normalizedPhone = normalizePhone(phone)

    if (!/^09\d{9}$/.test(normalizedPhone)) {
      showNotification('error', 'شماره موبایل معتبر نیست')
      return
    }

    try {
      setLoading(true)

      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: normalizedPhone,
          email
        })
      })

      const data = await res.json()

      if (!res.ok) {
        showNotification(
          'error',
          data.message || data.err || 'ارتباط با سرور برقرار نشد'
        )
        return
      }

      setPhone(normalizedPhone)
      setStep('otp')
      setOtp(['', '', '', '', '', ''])
      setTimer(180)

      setTimeout(() => {
        inputsRef.current[0]?.focus()
      }, 50)

      showNotification('success', 'کد یکبار مصرف برای شما پیامک شد')
    } catch (error) {
      showNotification('error', 'ارتباط با سرور برقرار نشد')
    } finally {
      setLoading(false)
    }
  }

  const verifyOtpHandler = async () => {
    const code = otp.join('')

    if (code.length !== 6) {
      showNotification('error', 'کد تایید باید ۶ رقمی باشد')
      return
    }

    try {
      setLoading(true)

      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          code
        })
      })

      const data = await res.json()

      if (!res.ok) {
        showNotification(
          'error',
          data.message || data.err || 'کد وارد شده معتبر نیست'
        )
        return
      }

      showNotification('success', 'ورود با موفقیت انجام شد')

      router.push('/')
      router.refresh()
    } catch (error) {
      showNotification('error', 'ارتباط با سرور برقرار نشد')
    } finally {
      setLoading(false)
    }
  }

  const resendOtpHandler = async () => {
    if (timer > 0) return
    await sendOtpHandler()
  }

  const handleOtpChange = (index, value) => {
    const englishValue = toEnglishDigits(value).replace(/[^0-9]/g, '')
    const digit = englishValue.slice(-1)

    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)

    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = e => {
    e.preventDefault()
    const pasted = toEnglishDigits(e.clipboardData.getData('text')).replace(
      /[^0-9]/g,
      ''
    )

    if (!pasted) return

    const digits = pasted.slice(0, 6).split('')
    const newOtp = ['', '', '', '', '', '']

    for (let i = 0; i < digits.length; i++) {
      newOtp[i] = digits[i]
    }

    setOtp(newOtp)

    const focusIndex = Math.min(digits.length, 5)
    inputsRef.current[focusIndex]?.focus()
  }

  return (
    <div className='bg-gray-900 flex justify-center items-center min-h-screen'>
      <Cardnotification
        show={notification.show}
        title={notification.title}
        color={notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
        Icon={
          notification.type === 'success' ? FaCheck : HiOutlineExclamationCircle
        }
      />
      <div className='border-2 min-w-11/12 md:min-w-6/12 lg:min-w-4/12 border-gray-600 rounded-xl bg-gray-800'>
        <div className='flex flex-col justify-center items-center w-full pt-4'>
          <h1 className='text-2xl md:text-3xl font-semibold text-white'>
            {step === 'form' ? 'ورود یا ثبت‌نام' : 'تایید شماره موبایل'}
          </h1>
          <h3 className='text-base text-neutral-300 py-4'>
            {step === 'form'
              ? 'شماره موبایل خود را وارد کنید'
              : `کد ارسال شده به ${phone} را وارد کنید`}
          </h3>
        </div>

        {step === 'form' ? (
          <form className='flex flex-col gap-6 items-center justify-center px-2 md:px-6 lg:px-8 pt-6 md:pt-8 pb-8'>
            <div className='flex items-center w-11/12 justify-between gap-3 rounded-lg border border-gray-300 bg-gray-900 px-4 py-2 focus-within:border-blue-500'>
              <input
                type='text'
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
                placeholder='ایمیل (اختیاری برای اعضای جدید)'
                dir='ltr'
                value={email}
                onChange={e => setEmail(e.target.value)}
                className='flex-1 outline-none bg-transparent p-2 text-right placeholder:text-gray-400 text-neutral-200'
              />
              <FiMail className='text-gray-500' />
            </div>

            <button
              type='button'
              onClick={sendOtpHandler}
              disabled={loading}
              className='flex items-center justify-center w-11/12 text-center rounded-lg bg-blue-600 px-4 py-4 text-neutral-200 disabled:opacity-60 font-semibold cursor-pointer'
            >
              {loading ? 'در حال ارسال...' : 'ارسال کد یکبار مصرف'}
            </button>
          </form>
        ) : (
          <div className='flex flex-col gap-6 items-center justify-center px-2 md:px-6 lg:px-8 pt-6 md:pt-8 pb-8'>
            <div
              className='flex items-center justify-center gap-2 w-11/12'
              dir='ltr'
              onPaste={handleOtpPaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => {
                    inputsRef.current[index] = el
                  }}
                  type='text'
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(index, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(index, e)}
                  className='w-12 h-12 md:w-14 md:h-14 text-center text-lg md:text-xl font-bold rounded-lg border border-gray-500 bg-gray-900 text-white outline-none focus:border-blue-500'
                />
              ))}
            </div>

            <div className='w-11/12 flex items-center justify-between text-sm text-neutral-300'>
              <button
                type='button'
                onClick={() => setStep('form')}
                className='flex items-center gap-2 text-blue-400 cursor-pointer'
              >
                <FiArrowRight />
                ویرایش شماره
              </button>

              {timer > 0 ? (
                <span>{formatTime(timer)}</span>
              ) : (
                <button
                  type='button'
                  onClick={resendOtpHandler}
                  disabled={loading}
                  className='text-blue-400 disabled:opacity-60 cursor-pointer font-medium'
                >
                  ارسال مجدد کد
                </button>
              )}
            </div>

            <button
              type='button'
              onClick={verifyOtpHandler}
              disabled={loading}
              className='flex items-center justify-center w-11/12 text-center rounded-lg bg-blue-600 px-4 py-4 text-neutral-200 disabled:opacity-60 font-semibold cursor-pointer'
            >
              {loading ? 'در حال بررسی...' : 'تایید و ورود'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthPage
