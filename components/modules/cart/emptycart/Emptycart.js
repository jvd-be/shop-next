import React from 'react'
import { FaShoppingBag } from 'react-icons/fa'
export default function Emptycart() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 lg:p-12 text-center shadow-lg max-w-md w-full mx-auto">
        <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mb-6 sm:mb-8 relative">
          <FaShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
          <div className="absolute -top-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-sm sm:text-lg">۰</span>
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          سبد خرید شما خالی است
        </h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 max-w-sm mx-auto">
          هنوز محصولی به سبد خرید خود اضافه نکرده‌اید. شروع به خرید کنید!
        </p>
        <button className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-blue-600/30 text-sm sm:text-base">
          مشاهده محصولات
        </button>
      </div>
    </div>
  )
}
