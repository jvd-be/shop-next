import React from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Link from 'next/link'

export default function Pagenationbackendproduct ({
  totalPages,
  currentPage,
  allProducts,
  limit = 8,
  name = 'محصول',
  title=""
}) {
  if (totalPages <= 1) {
    return null
  }


  const getVisiblePages = () => {
    const delta = 1
    const range = []

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (!range.includes(1)) {
      range.unshift(1)

      if (range[1] !== 2) {
        range.splice(1, 0, '...')
      }
    }

    if (!range.includes(totalPages)) {
      if (range[range.length - 1] !== totalPages - 1) {
        range.push('...')
      }

      range.push(totalPages)
    }

    return range
  }

  const visiblePages = getVisiblePages()

  const start = (currentPage - 1) * limit + 1

  const end = Math.min(currentPage * limit, allProducts)

  const getPageUrl = page => {
    if (page <= 1) {
      return `/${title}`
    }

    return `/${title}?page=${page}`
  }

  return (
    <div className='mt-10 flex flex-col md:flex-row items-center justify-between gap-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm'>

      <div className='text-sm text-gray-500 dark:text-gray-400'>
        نمایش{' '}
        <span className='font-semibold text-gray-800 dark:text-white'>
          {start}
        </span>{' '}
        تا{' '}
        <span className='font-semibold text-gray-800 dark:text-white'>
          {end}
        </span>{' '}
        از{' '}
        <span className='font-semibold text-gray-800 dark:text-white'>
          {allProducts}
        </span>{' '}
        {name}
      </div>

      {/* Pagination */}

      <div className='flex items-center gap-2'>
        {/* قبلی */}

        {currentPage > 1 ? (
          <Link
            href={getPageUrl(currentPage - 1)}
            className='flex items-center gap-1 rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm transition hover:bg-gray-100 dark:hover:bg-gray-700'
          >
            <FiChevronRight size={18} />
            قبلی
          </Link>
        ) : (
          <span className='flex items-center gap-1 rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm opacity-40 cursor-not-allowed'>
            <FiChevronRight size={18} />
            قبلی
          </span>
        )}


        <div className='flex items-center gap-2'>
          {visiblePages.map((page, index) =>
            page === '...' ? (
              <span key={`ellipsis-${index}`} className='px-2 text-gray-400'>
                ...
              </span>
            ) : (
              <Link
                key={page}
                href={getPageUrl(page)}
                className={`h-10 min-w-10 px-3 flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
                  currentPage === page
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {page}
              </Link>
            )
          )}
        </div>

     

        {currentPage < totalPages ? (
          <Link
            href={getPageUrl(currentPage + 1)}
            className='flex items-center gap-1 rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm transition hover:bg-gray-100 dark:hover:bg-gray-700'
          >
            بعدی
            <FiChevronLeft size={18} />
          </Link>
        ) : (
          <span className='flex items-center gap-1 rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm opacity-40 cursor-not-allowed'>
            بعدی
            <FiChevronLeft size={18} />
          </span>
        )}
      </div>
    </div>
  )
}
