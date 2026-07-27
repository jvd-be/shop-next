'use client'
import { FiMapPin, FiUser, FiPhone, FiTrash2, FiHash, FiNavigation, FiCheckCircle } from 'react-icons/fi'

export default function AddressCard({ address, onDelete, onSetDefault, loading }) {
  if (!address) return null;

  return (
    <div className={`relative group bg-white dark:bg-gray-800/50 p-5 rounded-3xl border ${address.isDefault ? 'border-green-500 shadow-md' : 'border-gray-100 dark:border-gray-700'} hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-xl`}>
      
      {/* هدر کارت */}
      <div className='flex justify-between items-start mb-4'>
        <div className='flex items-center gap-3'>
          <div className={`w-10 h-10 ${address.isDefault ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'} rounded-xl flex items-center justify-center`}>
            <FiNavigation className='text-xl' />
          </div>
          <div>
            <span className='text-xs text-gray-400 block'>استان / شهر</span>
            <h4 className='font-bold text-gray-800 dark:text-white'>{address.city}</h4>
          </div>
        </div>
        
        {/* دکمه‌های عملیاتی برجسته */}
        <div className='flex items-center gap-2'>
          {!address.isDefault ? (
            <button 
              onClick={() => onSetDefault(address._id)}
              disabled={loading}
              className='flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-600 hover:text-white rounded-full text-[10px] font-bold transition-all duration-300 border border-green-100 dark:border-green-800/30'
            >
              <FiCheckCircle className='text-sm' />
              <span>انتخاب پیش‌فرض</span>
            </button>
          ) : (
            <span className='flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-full text-[10px] font-bold shadow-sm'>
              <FiCheckCircle className='text-sm' />
              <span>آدرس پیش‌فرض</span>
            </span>
          )}

          <button 
            onClick={() => onDelete(address._id)}
            disabled={loading}
            className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors border border-transparent hover:border-red-100'
            title="حذف آدرس"
          >
            <FiTrash2 className='text-lg' />
          </button>
        </div>
      </div>

      {/* محتوای آدرس */}
      <div className='space-y-3'>
        <div className='flex items-start gap-2'>
          <FiMapPin className='mt-1 text-gray-400 shrink-0' />
          <p className='text-sm text-gray-600 dark:text-gray-300 leading-6'>
            {address.address} 
            <span className='mx-1 font-bold text-gray-800 dark:text-gray-100'>پلاک {address.plaque}</span>
            {address.unit && <span className='mr-1 font-bold text-gray-800 dark:text-gray-100'>واحد {address.unit}</span>}
          </p>
        </div>

        <div className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2'>
          <FiHash className='text-blue-500' />
          <span>کد پستی: {address.postalCode}</span>
        </div>

        {/* باکس گیرنده */}
        <div className='flex flex-wrap gap-4 mt-2 p-3 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100 dark:border-gray-800'>
          <div className='flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300'>
            <FiUser className='text-orange-500' />
            {address.receiverName}
          </div>
          <div className='flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300'>
            <FiPhone className='text-green-500' />
            <span className='tracking-widest'>{address.receiverPhone}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
