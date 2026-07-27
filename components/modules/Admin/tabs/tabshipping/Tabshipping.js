import React from 'react'
import { FaSave } from 'react-icons/fa'
import { UseNotification } from '@/components/hooks/UseNotification'
import Cardnotification from '@/components/modules/cardnotification/Cardnotification'
import { FaCheck } from 'react-icons/fa'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
export default function TabShipping ({
  handleSave,
  shippingSettings,
  handleShippingChange
}) {
  const { notification, showNotification } = UseNotification()
  const formatNumber = num => {
    if (num === null || num === undefined) return ''
    return Number(num).toLocaleString('en-US')
  }

  const handleNumberChange = e => {
    const { name, value } = e.target

    const numericValue = value.replace(/,/g, '').replace(/\D/g, '')

    handleShippingChange({
      target: {
        name,
        value: numericValue
      }
    })
  }

  const onSave = async () => {
    const res = await handleSave()

    if (res.ok) {
      showNotification('success', 'تغییرات با موفقیت انجام شد')
    } else {
      showNotification('error', 'مشکلی در ایجاد تغییرات به وجود امد')
    }
  }
  return (
    <div className='space-y-10'>
      <Cardnotification
        show={notification.show}
        title={notification.title}
        color={notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
        Icon={
          notification.type === 'success' ? FaCheck : HiOutlineExclamationCircle
        }
      />
      {/* 🔹 بخش اول: آستانه ها */}
      <div className='bg-gray-50  dark:text-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow'>
        <h3 className='text-lg font-bold mb-6'>تنظیم محدوده‌های مبلغ خرید</h3>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div>
            <label className='block text-sm mb-2'>
              تا چه مبلغی ارسال کامل حساب شود؟
            </label>
            <input
              type='text'
              name='fullThreshold'
              value={formatNumber(shippingSettings.fullThreshold)}
              onChange={handleNumberChange}
              className='w-full p-3 border rounded-lg'
              placeholder='مثال: 1990000'
            />
          </div>

          <div>
            <label className='block text-sm mb-2'>
              از چه مبلغی ارسال نیم‌بها شود؟
            </label>
            <input
              type='text'
              name='halfThreshold'
              value={formatNumber(shippingSettings.halfThreshold)}
              onChange={handleNumberChange}
              className='w-full p-3 border rounded-lg'
              placeholder='مثال: 200000'
            />
          </div>
          <div>
            <label className='block text-sm mb-2'>
              از چه مبلغی ارسال رایگان شود؟
            </label>
            <input
              type='text'
              name='freeThreshold'
              value={formatNumber(shippingSettings.freeThreshold)}
              onChange={handleNumberChange}
              className='w-full p-3 border rounded-lg'
              placeholder='مثال: 500000'
            />
          </div>
        </div>
      </div>

      {/* 🔹 بخش دوم: هزینه ها */}
      <div className='bg-gray-50 dark:bg-gray-800  dark:text-gray-100 p-6 rounded-lg shadow'>
        <h3 className='text-lg font-bold mb-6'>تنظیم هزینه‌های ارسال</h3>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div>
            <label className='block text-sm mb-2'>هزینه ارسال کامل</label>
            <input
              type='text'
              name='fullShippingCost'
              value={formatNumber(shippingSettings.fullShippingCost)}
              onChange={handleNumberChange}
              className='w-full p-3 border rounded-lg'
              placeholder='مثال: 30000'
            />
          </div>

          <div>
            <label className='block text-sm mb-2'>هزینه ارسال نیم‌بها</label>
            <input
              type='text'
              name='halfShippingCost'
              value={formatNumber(shippingSettings.halfShippingCost)}
              onChange={handleNumberChange}
              className='w-full p-3 border rounded-lg'
              placeholder='مثال: 15000'
            />
          </div>

          <div>
            <label className='block text-sm mb-2'>هزینه ارسال رایگان</label>
            <input
              type='text'
              name='freeShippingCost'
              value={formatNumber(shippingSettings.freeShippingCost)}
              onChange={handleNumberChange}
              className='w-full p-3 border rounded-lg'
              placeholder='معمولاً 0'
            />
          </div>
        </div>
      </div>

      {/* دکمه ذخیره */}
      <div className='flex justify-end'>
        <button
          onClick={onSave}
          className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg'
        >
          <FaSave />
          ذخیره تنظیمات ارسال
        </button>
      </div>
    </div>
  )
}
