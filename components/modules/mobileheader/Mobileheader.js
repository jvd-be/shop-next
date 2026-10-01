'use client'

import React from 'react'
import { FaArrowLeft, FaHeart } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useHeight } from '@/components/utils/navHeightContext'

function Mobileheader ({
  isWishlist,
  addToWishList,
  categoryName,
  categorySlug,
  parentCategoryName,
  parentCategorySlug,
  name
}) {
  const router = useRouter()
  const { mobileNavHeight } = useHeight()

  return (
    <header
      style={{
        marginTop: `${mobileNavHeight}px`
      }}
      className='md:hidden block bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40'
    >
      <div className=' flex items-center justify-between px-4 py-2'>
        <button
          type='button'
          onClick={() => router.back()}
          aria-label='بازگشت'
          className='p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
        >
          <FaArrowLeft className='w-5 h-5 text-gray-700 dark:text-gray-200' />
        </button>

        {/* Breadcrumb + Product name */}
        <div className='flex-1 min-w-0 mx-3 text-center'>
          <nav
            aria-label='مسیر صفحه'
            dir='rtl'
            className='flex items-center justify-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 truncate'
          >
            {/* فروشگاه */}
            <Link
              href='/products'
              className='hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer transition-colors truncate'
            >
              فروشگاه
            </Link>

            {/* Parent Category */}
            {parentCategoryName && (
              <>
                <span>/</span>

                <Link
                  href={`/category/${parentCategorySlug}`}
                  className='hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer transition-colors truncate'
                >
                  {parentCategoryName}
                </Link>
              </>
            )}

            {/* Current Category */}
            {categoryName && (
              <>
                <span>/</span>
                <Link
                  href={`/category/${parentCategorySlug}/${categorySlug}`}
                  className='hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer transition-colors truncate'
                >
                  <span className='text-gray-500 dark:text-gray-400 truncate'>
                    {categoryName}
                  </span>
                </Link>
              </>
            )}
          </nav>

          <h1 className='text-sm font-medium text-gray-800 dark:text-gray-200 truncate mt-0.5'>
            {name}
          </h1>
        </div>

        {/* Wishlist */}
        <button
          type='button'
          onClick={addToWishList}
          aria-label={
            isWishlist ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'
          }
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            isWishlist ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
          }`}
        >
          <FaHeart
            className={`w-5 h-5 ${
              isWishlist ? 'text-red-500' : 'text-gray-500'
            }`}
          />
        </button>
      </div>
    </header>
  )
}

export default Mobileheader
