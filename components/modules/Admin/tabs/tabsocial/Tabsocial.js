import { UseNotification } from '@/components/hooks/UseNotification'
import Cardnotification from '@/components/modules/cardnotification/Cardnotification'
import React from 'react'
import { FaCheck, FaSave } from 'react-icons/fa'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function Tabsocial ({ socials, setSocialsList, updateSocials }) {
  const { notification, showNotification } = UseNotification()
  const handleSocialChange = (index, value) => {
    setSocialsList(prev =>
      prev.map((item, i) => (i === index ? { ...item, value } : item))
    )
  }

  const onSave = async () => {
    const res = await updateSocials(socials)

    if (res.ok) {
      showNotification('success', 'تغییرات با موفقیت انجام شد')
    } else {
      showNotification('error', 'خطا در ارتباط با سرور')
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
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-bold dark:text-white'>مدیریت سوشال مدیا</h2>
      </div>

      {socials.map((item, index) => (
        <div key={item._id || index}>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            {item.label}
          </label>
          <input
            type='url'
            name={item.type}
            value={item.value || ''}
            onChange={e => handleSocialChange(index, e.target.value)}
            className='w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white'
            placeholder='https://instagram.com/username'
          />
        </div>
      ))}

      <div className='flex justify-end pt-4'>
        <button
          onClick={onSave}
          className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors shadow-md'
        >
          <FaSave />
          <span>ذخیره شبکه‌های اجتماعی</span>
        </button>
      </div>
    </div>
  )
}
