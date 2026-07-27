import React from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function Pagenationadminproduct ({
  totalPages,
  currentPage,
  setCurrentPage,
  allProducts,
  indexOfFirstProduct,
  indexOfLastProduct,
  name = 'محصول'
}) {
  const paginate = pageNumber => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  // فقط صفحات اطراف currentPage نمایش داده شوند
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
      if (range[1] !== 2) range.splice(1, 0, '...')
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
  if (totalPages <=1) {
    return null
  } else {
    return (
      <div className='mt-10 flex flex-col md:flex-row items-center justify-between gap-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm'>
        {/* اطلاعات */}
        <div className='text-sm text-gray-500 dark:text-gray-400'>
          نمایش{' '}
          <span className='font-semibold text-gray-800 dark:text-white'>
            {indexOfFirstProduct + 1}
          </span>{' '}
          تا{' '}
          <span className='font-semibold text-gray-800 dark:text-white'>
            {currentPage === totalPages ? allProducts : indexOfLastProduct}
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
          <button
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
            className='flex items-center gap-1 rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm transition hover:bg-gray-100 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40'
          >
            <FiChevronRight size={18} />
            قبلی
          </button>

          {/* شماره صفحات */}
          <div className='flex items-center gap-2'>
            {visiblePages.map((page, index) =>
              page === '...' ? (
                <span key={`ellipsis-${index}`} className='px-2 text-gray-400'>
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`h-10 min-w-10 rounded-xl text-sm font-medium transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-blue-600 text-white shadow-md scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          {/* بعدی */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => paginate(currentPage + 1)}
            className='flex items-center gap-1 rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm transition hover:bg-gray-100 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40'
          >
            بعدی
            <FiChevronLeft size={18} />
          </button>
        </div>
      </div>
    )
  }
}
