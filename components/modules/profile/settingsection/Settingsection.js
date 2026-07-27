'use client'
import { useState, useRef } from 'react'
import {
  FiPhone,
  FiShoppingBag,
  FiHeart,
  FiEdit2,
  FiCheck,
  FiX,
  FiHeadphones,
  FiMessageSquare,
  FiInfo,
  FiCalendar,
  FiMail
} from 'react-icons/fi'
import { UseNotification } from '@/components/hooks/UseNotification'
import Customfetch from '@/components/utils/CustomeFetch'
import { HiOutlineExclamation } from 'react-icons/hi'
import Cardnotification from '../../cardnotification/Cardnotification'

export default function Settingsection ({ user, handleEditSetting }) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '') // اضافه شدن استیت ایمیل
  console.log(user.createdAt)

  const { notification, showNotification } = UseNotification()

  const handleUpdate = async () => {
    // ۱. اعتبارسنجی نام
    if (!name.trim()) {
      showNotification('error', 'لطفاً نام خود را وارد کنید.')
      return
    }

    // ۲. اعتبارسنجی فرمت ایمیل (در صورت وارد کردن)
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        showNotification('error', 'لطفاً یک ایمیل معتبر وارد کنید.')
        return
      }
    }

    setLoading(true)

    try {
      const res = await Customfetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, name})
      })

      const data = await res.json()

      if (res.ok) {
        if (handleEditSetting) {
          handleEditSetting(data.user)
        }

        setIsEditing(false)
      } else {
        showNotification('error', data.message || 'مشکلی در بروزرسانی رخ داد.')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      showNotification('error', 'خطا در ارتباط با سرور')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-8'>
      {/* هدر پروفایل */}
      <div className='bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 lg:p-8'>
        <div className='flex flex-col md:flex-row items-center gap-6'>
          <div className='flex-1 text-center md:text-right w-full'>
            {isEditing ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto md:mx-0 text-right'>
                {/* فیلد ویرایش نام */}
                <div className='space-y-2'>
                  <label className='text-[11px] text-gray-500 block font-bold mr-1'>
                    نام و نام خانوادگی
                  </label>
                  <input
                    type='text'
                    value={name}
                    onChange={e => setName(e.target.value)}
                    disabled={loading}
                    className='w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:border-blue-500 transition-all'
                  />
                </div>
                {/* فیلد ویرایش ایمیل */}
                <div className='space-y-2'>
                  <label className='text-[11px] text-gray-500 block font-bold mr-1'>
                    آدرس ایمیل
                  </label>
                  <input
                    type='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder='example@mail.com'
                    disabled={loading}
                    className='w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:border-blue-500 text-left transition-all'
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className='text-2xl font-black text-gray-800 dark:text-white mb-3'>
                  {name || 'کاربر گرامی'}
                </h2>
                <div className='flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-6 text-sm font-medium'>
                  {/* نمایش شماره تلفن */}
                  <span className='flex items-center gap-2 text-gray-500 bg-gray-50 dark:bg-gray-700/30 px-3 py-1.5 rounded-lg'>
                    <FiPhone className='text-blue-500' size={16} />{' '}
                    {user?.phone}
                  </span>

                  {/* نمایش ایمیل یا راهنمای ثبت ایمیل */}
                  <span
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                      email
                        ? 'text-gray-500 bg-gray-50 dark:bg-gray-700/30'
                        : 'text-gray-400 bg-gray-50/50 dark:bg-gray-700/10 italic'
                    }`}
                  >
                    <FiMail
                      className={email ? 'text-blue-500' : 'text-gray-300'}
                      size={16}
                    />
                    {email || 'ایمیل ثبت نشده (جهت ویرایش کلیک کنید)'}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className='flex gap-2 w-full items-center md:w-auto mt-4 md:mt-0'>
            {isEditing ? (
              <div className='flex items-center gap-2 w-full'>
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className='flex-3 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none'
                >
                  {loading ? '...' : 'ذخیره'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setName(user?.name || '')
                    setEmail(user?.email || '')
                  }}
                  disabled={loading}
                  className='flex-1 md:flex-none bg-red-50 hover:bg-red-100 dark:bg-red-900/20 text-red-600 p-3.5 rounded-2xl transition-all border border-red-100 dark:border-red-900/30 flex items-center justify-center'
                >
                  <FiX size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className='w-full md:w-auto bg-linear-to-br from-indigo-600 to-violet-700 hover:shadow-indigo-200 dark:hover:shadow-none text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg'
              >
                <FiEdit2 size={16} /> ویرایش پروفایل
              </button>
            )}
          </div>
        </div>
      </div>
      <Cardnotification
        color={notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
        Icon={notification.type === 'success' ? FiCheck : HiOutlineExclamation}
        show={notification.show}
        title={notification.title}
      />
      {/* بخش آمار و پشتیبانی */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 text-right'>
        {/* خلاصه فعالیت‌ها */}
        <div className='lg:col-span-3 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm'>
          <h3 className='font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2'>
            تاریخچه فعالیت
          </h3>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <div className='bg-blue-50/50 dark:bg-blue-950/20 p-5 rounded-3xl border border-blue-100 dark:border-blue-900/50'>
              <FiShoppingBag
                className='text-blue-600 dark:text-blue-400 mb-3'
                size={24}
              />
              <div className='text-xl font-black dark:text-white'>
                {user?.totalOrders || 0}
              </div>
              <div className='text-[10px] text-gray-500 dark:text-gray-400 font-bold'>
                سفارش موفق
              </div>
            </div>
            <div className='bg-red-50/50 dark:bg-red-950/20 p-5 rounded-3xl border border-red-100 dark:border-red-900/50'>
              <FiHeart
                className='text-red-500 dark:text-red-400 mb-3'
                size={24}
              />
              <div className='text-xl font-black dark:text-white'>
                {user?.wishlist?.length || 0}
              </div>
              <div className='text-[10px] text-gray-500 dark:text-gray-400 font-bold'>
                لیست علاقه‌ها
              </div>
            </div>
            <div className='bg-green-50/50 dark:bg-green-950/20 p-5 rounded-3xl border border-green-100 dark:border-green-900/50'>
              <FiCalendar
                className='text-green-600 dark:text-green-400 mb-3'
                size={24}
              />
              <div className='text-xl font-black dark:text-white'>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleString('fa-IR', {
                      year: 'numeric',
                      month: 'long'
                    })
                  : 'نامعلوم'}
              </div>
       
              <div className='text-[10px] text-gray-500 dark:text-gray-400 font-bold'>
                تاریخ عضویت
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
