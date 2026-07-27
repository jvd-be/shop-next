'use client'
import { useState } from 'react'
import { FiCheck } from 'react-icons/fi'
import Cardnotification from '../../cardnotification/Cardnotification'
import { HiOutlineExclamation } from 'react-icons/hi'
import { UseNotification } from '@/components/hooks/UseNotification'
const Addressform = ({ onSubmit, onCancel, loading }) => {
  const { notification, showNotification } = UseNotification()
  const [formData, setFormData] = useState({
    city: '',
    address: '',
    plaque: '',
    unit: '',
    postalCode: '',
    receiverName: '',
    receiverPhone: ''
  })

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

const handleSubmit = e => {
  e.preventDefault()

  // کد پستی: دقیقا ۱۰ رقم (فارسی یا انگلیسی)
  if (!/^[0-9۰-۹]{10}$/.test(formData.postalCode)) {
    showNotification('error', "کد پستی باید ۱۰ رقم باشد.")
    return
  }

  // شماره موبایل ایران (فارسی یا انگلیسی)
  if (!/^[0۰][9۹][0-9۰-۹]{9}$/.test(formData.receiverPhone)) {
    showNotification('error', "شماره تماس معتبر نیست.")
    return
  }

  onSubmit(formData)
}
  return (
    <>
      <Cardnotification
            color={notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
            Icon={notification.type === 'success' ? FiCheck : HiOutlineExclamation}
            show={notification.show}
            title={notification.title}
          />
    <div className='bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 mb-6 shadow-xl animate-in fade-in slide-in-from-top-4'>

      <h3 className='text-xl font-bold mb-6 text-gray-800 dark:text-white'>
        افزودن آدرس جدید
      </h3>
      <form onSubmit={handleSubmit} className='space-y-5'>
        {/* سطر اول: شهر و کد پستی */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-1 text-right'>
            <label className='text-xs font-bold text-gray-500 mr-2'>شهر</label>
            <input
              type='text'
              name='city'
              required
              value={formData.city}
              onChange={handleChange}
              className='w-full border-none rounded-2xl p-3 bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none'
              placeholder='مثال: تهران'
            />
          </div>
          <div className='space-y-1 text-right'>
            <label className='text-xs font-bold text-gray-500 mr-2'>
              کد پستی
            </label>
            <input
              type='text'
              name='postalCode'
              required
              value={formData.postalCode}
              onChange={handleChange}
              className='w-full border-none rounded-2xl p-3 bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none text-left'
              placeholder='۱۰ رقم بدون خط تیره'
            />
          </div>
        </div>

        {/* سطر دوم: آدرس دقیق */}
        <div className='space-y-1 text-right'>
          <label className='text-xs font-bold text-gray-500 mr-2'>
            آدرس دقیق (خیابان و کوچه)
          </label>
          <textarea
            name='address'
            required
            value={formData.address}
            onChange={handleChange}
            rows='3'
            className='w-full border-none rounded-2xl p-3 bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none'
            placeholder='مثال: بلوار نلسون ماندلا، کوچه تورج...'
          />
        </div>

        {/* سطر سوم: پلاک و واحد */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='space-y-1 text-right col-span-1'>
            <label className='text-xs font-bold text-gray-500 mr-2'>پلاک</label>
            <input
              type='text'
              name='plaque'
              required
              value={formData.plaque}
              onChange={handleChange}
              className='w-full border-none rounded-2xl p-3 bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none'
            />
          </div>
          <div className='space-y-1 text-right col-span-1'>
            <label className='text-xs font-bold text-gray-500 mr-2'>واحد</label>
            <input
              type='text'
              name='unit'
              value={formData.unit}
              onChange={handleChange}
              className='w-full border-none rounded-2xl p-3 bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none'
            />
          </div>
          <div className='space-y-1 text-right col-span-2 md:col-span-2'>
            <label className='text-xs font-bold text-gray-500 mr-2'>
              نام تحویل گیرنده
            </label>
            <input
              type='text'
              name='receiverName'
              required
              value={formData.receiverName}
              onChange={handleChange}
              className='w-full border-none rounded-2xl p-3 bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none'
            />
          </div>
        </div>

        {/* سطر آخر: شماره تماس */}
        <div className='space-y-1 text-right'>
          <label className='text-xs font-bold text-gray-500 mr-2'>
            شماره تماس تحویل گیرنده
          </label>
          <input
            type='tel'
            name='receiverPhone'
            required
            value={formData.receiverPhone}
            onChange={handleChange}
            className='w-full border-none rounded-2xl p-3 bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none text-left'
            placeholder='۰۹۱۲xxxxxxx'
          />
        </div>

        {/* دکمه‌ها */}
        <div className='flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800'>
          <button
            type='button'
            onClick={onCancel}
            className='px-6 py-3 rounded-2xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all'
          >
            انصراف
          </button>
          <button
            type='submit'
            disabled={loading}
            className='px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30'
          >
            {loading ? (
              'در حال ثبت...'
            ) : (
              <>
                <FiCheck /> ثبت آدرس
              </>
            )}
          </button>
        </div>
      </form>
    </div>
    </>
  )
}
export default Addressform
