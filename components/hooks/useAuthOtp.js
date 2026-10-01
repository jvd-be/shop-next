'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UseNotification } from '@/components/hooks/UseNotification'

export default function useAuthOtp () {
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('form')

  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  const [timer, setTimer] = useState(180)
  const [rateLimitTimer, setRateLimitTimer] = useState(0)
  const [otpInvalid, setOtpInvalid] = useState(false)

  const inputsRef = useRef([])

  const router = useRouter()

  const { notification, showNotification } = UseNotification()

  const toEnglishDigits = value => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

    let result = String(value ?? '')

    for (let i = 0; i < 10; i++) {
      result = result.replace(new RegExp(persianDigits[i], 'g'), String(i))

      result = result.replace(new RegExp(arabicDigits[i], 'g'), String(i))
    }

    return result
  }

  const normalizePhone = value => {
    let normalized = toEnglishDigits(value).trim()

    normalized = normalized.replace(/[\s-]/g, '')

    if (normalized.startsWith('+98')) {
      normalized = '0' + normalized.slice(3)
    } else if (normalized.startsWith('98')) {
      normalized = '0' + normalized.slice(2)
    }

    return normalized
  }

  const formatTime = seconds => {
    const safeSeconds = Math.max(0, Number(seconds) || 0)

    const min = Math.floor(safeSeconds / 60)

    const sec = safeSeconds % 60

    return `${min}:${sec < 10 ? '0' : ''}${sec}`
  }

  useEffect(() => {
    if (step !== 'otp' || timer <= 0) {
      return
    }

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [step, timer])

  useEffect(() => {
    if (rateLimitTimer <= 0) {
      return
    }

    const interval = setInterval(() => {
      setRateLimitTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [rateLimitTimer])

  const extractSeconds = message => {
    if (!message) {
      return 0
    }

    const match = message.match(/(\d+)\s*ثانیه/)

    return match ? Number(match[1]) : 0
  }

  const resetOtp = () => {
    setOtp(['', '', '', '', '', ''])

    setOtpInvalid(false)
  }

  const sendOtpHandler = async () => {
    if (rateLimitTimer > 0) {
      showNotification(
        'error',
        `لطفاً ${formatTime(rateLimitTimer)} دیگر صبر کنید`
      )

      return
    }

    const normalizedPhone = normalizePhone(phone)

    if (!/^09\d{9}$/.test(normalizedPhone)) {
      showNotification('error', 'شماره موبایل معتبر نیست')

      return
    }

    try {
      setLoading(true)

      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          phone: normalizedPhone,
          email: email.trim()
        })
      })

      let data = {}

      try {
        data = await res.json()
      } catch {
        data = {}
      }

      const message = data?.message || data?.err || 'ارتباط با سرور برقرار نشد'

      if (!res.ok) {
        if (res.status === 429) {
          const retryAfter = Number(data?.retryAfter) || extractSeconds(message)

          if (retryAfter > 0) {
            setRateLimitTimer(retryAfter)
          }
        }

        showNotification('error', message)

        return
      }

      setPhone(normalizedPhone)

      resetOtp()

      setTimer(180)

      setStep('otp')

      setTimeout(() => {
        inputsRef.current[0]?.focus()
      }, 50)

      showNotification('success', message)
    } catch (error) {
      console.error('SEND OTP ERROR:', error)

      showNotification('error', 'ارتباط با سرور برقرار نشد')
    } finally {
      setLoading(false)
    }
  }

  const verifyOtpHandler = async () => {
    if (rateLimitTimer > 0) {
      showNotification(
        'error',
        `لطفاً ${formatTime(rateLimitTimer)} دیگر صبر کنید`
      )

      return
    }

    if (otpInvalid) {
      showNotification(
        'error',
        'این کد دیگر معتبر نیست. لطفاً کد جدید دریافت کنید'
      )

      return
    }

    const code = toEnglishDigits(otp.join(''))

    if (!/^\d{6}$/.test(code)) {
      showNotification('error', 'کد تایید باید ۶ رقمی باشد')

      return
    }

    const normalizedPhone = normalizePhone(phone)

    if (!/^09\d{9}$/.test(normalizedPhone)) {
      showNotification('error', 'شماره موبایل معتبر نیست')

      setStep('form')

      return
    }

    try {
      setLoading(true)

      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          phone: normalizedPhone,
          code
        })
      })

      let data = {}

      try {
        data = await res.json()
      } catch {
        data = {}
      }

      const message = data?.message || data?.err || 'کد وارد شده معتبر نیست'

      if (res.ok) {
        showNotification('success', message)

        setTimeout(() => {
          router.push('/')
          router.refresh()
        }, 300)

        return
      }

      if (res.status === 429) {
        const retryAfter = Number(data?.retryAfter) || extractSeconds(message)

        if (retryAfter > 0) {
          setRateLimitTimer(retryAfter)

          showNotification('error', message)

          return
        }

        if (
          message.includes('کد بیش از حد اشتباه') ||
          message.includes('کد جدید دریافت کنید')
        ) {
          setOtpInvalid(true)

          resetOtp()

          setTimer(0)

          showNotification('error', message)

          return
        }

        showNotification('error', message)

        return
      }

      if (res.status === 404) {
        resetOtp()

        setTimer(0)

        showNotification('error', message)

        return
      }

      if (res.status === 400) {
        showNotification('error', message)

        setTimeout(() => {
          const lastFilledIndex = otp.findIndex(digit => !digit)

          const focusIndex =
            lastFilledIndex === -1 ? 5 : Math.max(0, lastFilledIndex)

          inputsRef.current[focusIndex]?.focus()
        }, 50)

        return
      }

      if (res.status === 403) {
        resetOtp()

        setTimer(0)

        showNotification('error', message)

        return
      }

      showNotification('error', message)
    } catch (error) {
      console.error('VERIFY OTP ERROR:', error)

      showNotification('error', 'ارتباط با سرور برقرار نشد')
    } finally {
      setLoading(false)
    }
  }

  const resendOtpHandler = async () => {
    if (rateLimitTimer > 0) {
      showNotification(
        'error',
        `لطفاً ${formatTime(rateLimitTimer)} دیگر صبر کنید`
      )

      return
    }

    if (timer > 0) {
      return
    }

    await sendOtpHandler()
  }

  const handleOtpChange = (index, value) => {
    const englishValue = toEnglishDigits(value).replace(/[^0-9]/g, '')

    const digit = englishValue.slice(-1)

    const newOtp = [...otp]

    newOtp[index] = digit

    setOtp(newOtp)

    if (digit) {
      setOtpInvalid(false)
    }

    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()

      return
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus()

      return
    }

    if (e.key === 'ArrowRight' && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleOtpPaste = e => {
    e.preventDefault()

    const pasted = toEnglishDigits(e.clipboardData.getData('text')).replace(
      /[^0-9]/g,
      ''
    )

    if (!pasted) {
      return
    }

    const digits = pasted.slice(0, 6).split('')

    const newOtp = ['', '', '', '', '', '']

    digits.forEach((digit, index) => {
      newOtp[index] = digit
    })

    setOtp(newOtp)

    setOtpInvalid(false)

    const focusIndex = Math.min(digits.length - 1, 5)

    if (focusIndex >= 0) {
      setTimeout(() => {
        inputsRef.current[focusIndex]?.focus()
      }, 0)
    }
  }

  const editPhoneHandler = () => {
    setStep('form')

    resetOtp()

    setTimer(0)

    setRateLimitTimer(0)
  }

  const handleFormSubmit = e => {
    e.preventDefault()

    if (!loading) {
      sendOtpHandler()
    }
  }

  const codeComplete = otp.every(digit => digit !== '')

  const verifyDisabled =
    loading || !codeComplete || otpInvalid || rateLimitTimer > 0

  const sendDisabled = loading || rateLimitTimer > 0

  return {
    phone,
    setPhone,

    email,
    setEmail,

    loading,
    step,

    otp,
    timer,
    rateLimitTimer,
    otpInvalid,

    inputsRef,

    notification,

    formatTime,

    sendOtpHandler,
    verifyOtpHandler,
    resendOtpHandler,

    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,

    editPhoneHandler,
    handleFormSubmit,

    verifyDisabled,
    sendDisabled
  }
}
