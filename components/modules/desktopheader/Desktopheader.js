'use client'

import { useDevice } from '@/components/utils/helper'
import { useHeight } from '@/components/utils/navHeightContext'
import React from 'react'
import Link from 'next/link'
function Desktopheader ({
  categoryName,
  parentCategoryName,
  parentCategorySlug,
  categorySlug,
  name
}) {
  const isMobile = useDevice()
  const { mobileNavHeight, desktopNavHeight } = useHeight()


  return (
    <header
      style={{
        marginTop: `${isMobile ? mobileNavHeight : desktopNavHeight}px`
      }}
      className='hidden md:block bg-white dark:bg-gray-900 shadow-sm'
    >
      <div className='max-w-7xl mx-auto px-4 py-4'>
        <nav className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
          <Link href={'/product'}>
          <span className='hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer'>
            فروشگاه
          </span>
          </Link>

          {parentCategoryName && (
            <>
              <span>/</span>
              <Link href={`/category/${parentCategorySlug}`}>
                <span className='hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer'>
                  {parentCategoryName}
                </span>
              </Link>
            </>
          )}

          {categoryName && (
            <>
              <span>/</span>
  <Link href={`/category/${parentCategorySlug}/${categorySlug}`}>

              <span className='hover:text-gray-700 dark:hover:text-gray-200 '>
                {categoryName}
              </span>
</Link>
            </>
          )}

          <span>/</span>

          <span className='text-gray-700 dark:text-gray-200'>{name}</span>
        </nav>
      </div>
    </header>
  )
}

export default Desktopheader
