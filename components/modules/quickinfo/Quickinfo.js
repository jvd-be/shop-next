import { FaBoxOpen, FaShieldAlt, FaSyncAlt } from 'react-icons/fa'
export default function Quickinfo () {
  return (
    <div className='bg-gray-100 dark:bg-gray-800 rounded-xl p-4'>
      <div className='flex flex-wrap items-center justify-center gap-4 text-xs lg:text-sm text-gray-600 dark:text-gray-400'>
        <div className='flex items-center gap-2'>
          <FaBoxOpen className='w-5 h-5 text-green-600 dark:text-green-400' />
          ارسال رایگان
        </div>
        <div className='flex items-center gap-2'>
          <FaShieldAlt className='w-5 h-5 text-blue-600 dark:text-blue-400' />
          گارانتی
        </div>
        <div className='flex items-center gap-2'>
          <FaSyncAlt className='w-5 h-5 text-orange-500 dark:text-orange-400' />
          ۷ روز بازگشت
        </div>
      </div>
    </div>
  )
}
