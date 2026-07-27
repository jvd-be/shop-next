"use client"
import { UseNotification } from '@/components/hooks/UseNotification'
import Cardnotification from '@/components/modules/cardnotification/Cardnotification'
import React, { useState } from 'react'
import { FaCheck, FaSave } from 'react-icons/fa'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function Tabcontact({
  updateContacts,
  contacts,
  setContactsList
}) {
  const { notification, showNotification } = UseNotification()
  const [errors, setErrors] = useState({})

  // ✔ شماره موبایل ایران
  const validateMobilePhone = (phone) => {
    const phoneRegex = /^(09\d{9}|\+989\d{9})$/
    return phoneRegex.test(phone)
  }

  // ✔ شماره ثابت ایران
  const validateStorePhone = (phone) => {
    const storeRegex = /^(0\d{2}\d{8}|\+98\d{2}\d{8})$/
    return storeRegex.test(phone)
  }

  // ✔ ایمیل
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

const handleContactChange = (e) => {
  const { name, value } = e.target
  let cleanedValue = value

  // فقط برای شماره‌ها
  if (name === "mobilePhone" || name === "storePhone") {
    cleanedValue = value.replace(/[^\d+]/g, "")

    // فقط + در ابتدای شماره
    if (cleanedValue.includes("+") && !cleanedValue.startsWith("+")) return

    if (cleanedValue.startsWith("+")) {
      if (cleanedValue.length > 13) return
    } else {
      if (cleanedValue.length > 11) return
    }
  }

  setContactsList((prev) => ({
    ...prev,
    [name]: cleanedValue
  }))

  // validation موبایل
  if (name === "mobilePhone") {
    setErrors((prev) => ({
      ...prev,
      mobilePhone:
        cleanedValue && !validateMobilePhone(cleanedValue)
          ? "شماره موبایل معتبر نیست (0912... یا +98912...)"
          : ""
    }))
  }

  // validation تلفن ثابت
  if (name === "storePhone") {
    setErrors((prev) => ({
      ...prev,
      storePhone:
        cleanedValue && !validateStorePhone(cleanedValue)
          ? "شماره فروشگاه معتبر نیست (021... یا +9821...)"
          : ""
    }))
  }

  // validation ایمیل
  if (name === "email") {
    setErrors((prev) => ({
      ...prev,
      email:
        cleanedValue && !validateEmail(cleanedValue)
          ? "ایمیل معتبر نیست"
          : ""
    }))
  }
}


  // فرم معتبر
  const isFormValid =
    contacts?.mobilePhone &&
    contacts?.storePhone &&
    contacts?.email &&
    validateMobilePhone(contacts.mobilePhone) &&
    validateStorePhone(contacts.storePhone) &&
    validateEmail(contacts.email)

  const onSave = async () => {
    if (!isFormValid) {
      showNotification('error', 'فرم معتبر نیست')
      return
    }

    const res = await updateContacts(contacts)

    if (res.ok) {
      showNotification('success', 'تغییرات با موفقیت انجام شد')
    } else {
      const data = await res.json()
      showNotification('error', data.message || 'خطا')
    }
  }

  return (
    <div className='space-y-6'>
      <Cardnotification
        show={notification.show}
        title={notification.title}
        color={notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
        Icon={
          notification.type === 'success' ? FaCheck : HiOutlineExclamationCircle
        }
      />
   <div className='flex justify-between items-center '>
        <h2 className='text-xl font-bold dark:text-white'>مدیریت تماس ها</h2>

        
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        
        {/* شماره موبایل */}
        <div>
          <label className='block mb-2'>شماره موبایل</label>
          <input
            type='tel'
            name='mobilePhone'
            value={contacts?.mobilePhone || ''}
            onChange={handleContactChange}
            placeholder='09123456789 یا +989123456789'
            className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white ${
              errors.mobilePhone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.mobilePhone && (
            <p className='text-red-500 text-sm mt-1'>{errors.mobilePhone}</p>
          )}
        </div>

        {/* شماره فروشگاه */}
        <div>
          <label className='block mb-2'>شماره فروشگاه (تلفن ثابت)</label>
          <input
            type='tel'
            name='storePhone'
            value={contacts?.storePhone || ''}
            onChange={handleContactChange}
            placeholder='02112345678 یا +982112345678'
            className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white ${
              errors.storePhone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.storePhone && (
            <p className='text-red-500 text-sm mt-1'>{errors.storePhone}</p>
          )}
        </div>

        {/* ایمیل */}
        <div>
          <label className='block mb-2'>ایمیل</label>
          <input
            type='email'
            name='email'
            value={contacts?.email || ''}
            onChange={handleContactChange}
            className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
          )}
        </div>

      </div>

      <div className='flex justify-end pt-4'>
        <button
          onClick={onSave}
          disabled={!isFormValid}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white shadow-md transition ${
            isFormValid
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          <FaSave />
          ذخیره اطلاعات تماس
        </button>
      </div>
    </div>
  )
}
