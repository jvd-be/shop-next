'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { FaCheck } from 'react-icons/fa'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import Cardnotification from '@/components/modules/cardnotification/Cardnotification'
import useAuthOtp from '@/components/hooks/useAuthOtp'
import Authheader from '@/components/modules/auth/authheader/Authheader'
import PhoneForm from '@/components/modules/auth/phoneform/Phoneform'
import OtpForm from '@/components/modules/auth/otpform/Otpform'

export default function AuthPage ({ isLoggedIn }) {
  const auth = useAuthOtp()
  const router = useRouter()
  if (isLoggedIn === true) {
    router.back()
  }
  return (
    <div className='bg-gray-900 flex justify-center items-center min-h-screen'>
      <Cardnotification
        show={auth.notification.show}
        title={auth.notification.title}
        color={
          auth.notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }
        Icon={
          auth.notification.type === 'success'
            ? FaCheck
            : HiOutlineExclamationCircle
        }
      />

      <div className='border-2 min-w-11/12 md:min-w-6/12 lg:min-w-4/12 border-gray-600 rounded-xl bg-gray-800'>
        <Authheader step={auth.step} phone={auth.phone} />

        {auth.step === 'form' ? (
          <PhoneForm
            phone={auth.phone}
            setPhone={auth.setPhone}
            email={auth.email}
            setEmail={auth.setEmail}
            loading={auth.loading}
            rateLimitTimer={auth.rateLimitTimer}
            sendDisabled={auth.sendDisabled}
            formatTime={auth.formatTime}
            onSubmit={auth.handleFormSubmit}
          />
        ) : (
          <OtpForm
            otp={auth.otp}
            timer={auth.timer}
            rateLimitTimer={auth.rateLimitTimer}
            otpInvalid={auth.otpInvalid}
            loading={auth.loading}
            inputsRef={auth.inputsRef}
            verifyDisabled={auth.verifyDisabled}
            formatTime={auth.formatTime}
            onChange={auth.handleOtpChange}
            onKeyDown={auth.handleOtpKeyDown}
            onPaste={auth.handleOtpPaste}
            onEditPhone={auth.editPhoneHandler}
            onResend={auth.resendOtpHandler}
            onVerify={auth.verifyOtpHandler}
          />
        )}
      </div>
    </div>
  )
}
