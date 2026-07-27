import React from 'react'
import { FaTimes, FaCheck } from 'react-icons/fa'
function Couponinput ({
  showCouponInput,
  couponCode,
  setCouponCode,
  couponError,
  discountLabel,
  discount,
  onApply,
  onRemove,
  couponMessage,
  typeDiscount
}) {
  const formatPrice = price => new Intl.NumberFormat('fa-IR').format(price)

  
  return (
    <div className='mb-5'>
      {showCouponInput ? (
        <div className='space-y-2'>
          <div className={`flex gap-2 ${couponError ? 'animate-pulse' : ''}`}>
            <input
              type='text'
              value={couponCode}
              onChange={e => setCouponCode(e.target.value.toUpperCase())}
              placeholder='کد تخفیف'
              className={`flex-1 min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 text-sm border-2 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none transition-all ${
                couponError
                  ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
                  : 'border-transparent focus:border-blue-500'
              }`}
            />
            <button
              onClick={onApply}
              className='px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-900 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-500 text-white text-sm rounded-xl font-medium transition-colors active:scale-95 whitespace-nowrap'
            >
              اعمال
            </button>
          </div>
          {couponError && (
            <p className='text-xs text-red-500 flex items-center gap-1'>
              <FaTimes className='w-3 h-3' />
              کد تخفیف نامعتبر است
            </p>
          )}
          {couponMessage && (
            <p className='text-base text-red-500 flex items-center gap-1'>
              <FaTimes className='w-3 h-3' />
              {couponMessage}
            </p>
          )}
          <p className='text-[10px] sm:text-xs text-gray-400'>
            کد‌های نمونه: DIGIKALA10, WELCOME20
          </p>
        </div>
      ) : (
        <div className='flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-3 sm:px-4 py-2 sm:py-3 rounded-xl'>
          <div className='flex items-center gap-2 min-w-0'>
            <FaCheck className='w-4 h-4 shrink-0' />
            <span className='text-sm font-medium truncate'>
              {discountLabel}
            </span>
            <span className='text-xs shrink-0'>
              (
              {typeDiscount === 'Shipping'
                ? 'ارسال رایگان'
                : typeDiscount === 'Fixed'
                ? `${discount} هزار تومان تخفیف`
                : `${discount} off %`}
              )
            </span>
          </div>
          <button
            onClick={onRemove}
            className='p-1.5 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors shrink-0'
          >
            <FaTimes className='w-4 h-4' />
          </button>
        </div>
      )}
    </div>
  )
}
export default Couponinput
