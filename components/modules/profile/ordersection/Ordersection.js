import React from 'react'
import Ordercard from '../ordercard/Ordercard'
import Link from 'next/link'
import { FiShoppingBag } from 'react-icons/fi'

export default function Ordersection ({ orders }) {
  return (
    <div className='w-full'>
      {orders && orders.length > 0 ? (
        <div className='space-y-4'>
          {orders.map(order => (
            <Ordercard key={order._id} order={order} />
          ))}
        </div>
      ) : (
        <div className='relative overflow-hidden rounded-3xl bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-100 dark:border-gray-800 py-16 px-4 shadow-sm'>
          {/* دکور پس‌زمینه */}
          <div className='absolute -top-10 -right-10 w-40 h-40 bg-orange-50 dark:bg-orange-900/20 rounded-full blur-3xl opacity-50'></div>
          <div className='absolute -bottom-10 -left-10 w-40 h-40 bg-red-50 dark:bg-red-900/20 rounded-full blur-3xl opacity-50'></div>

          <div className='relative z-10 flex flex-col items-center text-center'>
            {/* آیکون */}
            <div className='relative mb-6'>
              <div className='absolute inset-0 bg-orange-100 dark:bg-orange-900/40 rounded-full scale-150 blur-xl opacity-30 animate-pulse'></div>
              <div className='relative bg-white dark:bg-gray-800 p-6 rounded-full shadow-md text-orange-500'>
                <FiShoppingBag size={50} strokeWidth={1.7} />
              </div>
            </div>

            <h3 className='text-2xl font-black text-gray-800 dark:text-white mb-3'>
              هنوز هیچ سفارشی ثبت نکردی!
            </h3>

            <p className='text-gray-500 dark:text-gray-400 max-w-sm mb-10 leading-relaxed'>
              ظاهراً سبد خریدت منتظره تا با محصولات جذاب ما پر بشه. همین حالا
              اولین خریدت رو تجربه کن!
            </p>

            <Link
              href='/products'
              className='group relative inline-flex items-center justify-center px-8 py-3.5 font-bold text-white transition-all duration-300 bg-orange-600 rounded-full hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20 active:scale-95'
            >
              <span className='ml-2'>مشاهده فروشگاه</span>
              <FiShoppingBag className='transition-transform duration-300 group-hover:scale-110' />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
