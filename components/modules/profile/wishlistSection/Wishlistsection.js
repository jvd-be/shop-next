import React from 'react'
import { FiHeart } from 'react-icons/fi'
import Link from 'next/link'
import Productcard from '../../productcard/Productcard'
import Popups from '@/components/templates/popups/Popups'

export default function Wishlistsection ({
  wishlistItems = [],
  onToggleWishlist,
  popups
}) {
  return (
    <div className='w-full'>
      <Popups popups={popups} popupKey='wishlist' />
      {wishlistItems && wishlistItems.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {wishlistItems.map((item, index) => {
            const key =
              typeof item === 'string' ? item : item._id || item.id || index
            console.log('render key:', key)
            return (
              <Productcard
                key={key}
                product={item}
                isWishlisted={true}
                onToggleWishlist={onToggleWishlist}
              />
            )
          })}
        </div>
      ) : (
        <div className='relative overflow-hidden rounded-3xl bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-100 dark:border-gray-800 py-16 px-4 shadow-sm'>
          <div className='absolute -top-10 -right-10 w-40 h-40 bg-red-50 dark:bg-red-900/20 rounded-full blur-3xl opacity-50'></div>
          <div className='absolute -bottom-10 -left-10 w-40 h-40 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50'></div>

          <div className='relative z-10 flex flex-col items-center text-center'>
            <div className='relative mb-6'>
              <div className='absolute inset-0 bg-red-100 dark:bg-red-900/50 rounded-full scale-150 blur-xl opacity-30 animate-pulse'></div>
              <div className='relative bg-white dark:bg-gray-800 p-6 rounded-full shadow-md text-red-400'>
                <FiHeart size={50} strokeWidth={1.5} />
              </div>
            </div>

            <h3 className='text-2xl font-black text-gray-800 dark:text-white mb-3'>
              لیست محبوبات خالیه!
            </h3>

            <p className='text-gray-500 dark:text-gray-400 max-w-sm mb-10 leading-relaxed'>
              انگار هنوز محصولی دلت رو نبرده! کلی محصول جذاب منتظرن که بیان توی
              این لیست.
            </p>

            <Link
              href='/products'
              className='group relative inline-flex items-center justify-center px-8 py-3.5 font-bold text-white transition-all duration-300 bg-orange-600 rounded-full hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20 active:scale-95'
            >
              <span className='ml-2'>بزن بریم خرید</span>
              <FiHeart className='group-hover:fill-current transition-colors' />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
