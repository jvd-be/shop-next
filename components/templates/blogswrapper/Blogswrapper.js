'use client'

import Fashioncard from '@/components/modules/fashioncard/Fashioncard'
import { useEffect, useMemo, useRef, useState } from 'react'
import Pagenationadminproduct from '@/components/modules/Admin/pagenationadminproduct/Pagenationadminproduct'
import UsePagination from '@/components/hooks/UsePagination'
import { useHeight } from '@/components/utils/navHeightContext'
import { useDevice } from '@/components/utils/helper'

function safeStr (v) {
  return (v ?? '').toString().trim()
}

function includesFa (haystack, needle) {
  return safeStr(haystack).toLowerCase().includes(safeStr(needle).toLowerCase())
}

export default function FashionBlog ({ blogs = [] }) {
  const sectionRefBlogs = useRef(null)

  // UI state
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest') // newest | oldest | titleAsc | titleDesc

  // سرچ + سورت
  const filteredSortedBlogs = useMemo(() => {
    const q = safeStr(query)
    let list = Array.isArray(blogs) ? [...blogs] : []

    // Filter (search)
    if (q) {
      list = list.filter(p => {
        return (
          includesFa(p?.title, q) ||
          includesFa(p?.description, q) ||
          includesFa(p?.author, q)
        )
      })
    }

    list.sort((a, b) => {
      const aDate = new Date(a?.createdAt).getTime()
      const bDate = new Date(b?.createdAt).getTime()

      switch (sortBy) {
        case 'oldest':
          return (aDate || 0) - (bDate || 0)
        case 'newest':
        default:
          return (bDate || 0) - (aDate || 0)
      }
    })

    return list
  }, [blogs, query, sortBy])

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    indexOfFirstItem,
    indexOfLastItem,
    currentItems
  } = UsePagination(filteredSortedBlogs, 8)

  // وقتی سرچ/سورت عوض شد برو صفحه 1
  useEffect(() => {
    setCurrentPage(1)
  }, [query, sortBy, setCurrentPage])

  // اسکرول نرم بعد از تغییر صفحه
  useEffect(() => {
    if (sectionRefBlogs.current) {
      sectionRefBlogs.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [currentPage])
  const { mobileNavHeight, desktopNavHeight } = useHeight()

  const isMobile = useDevice()
  return (
    <div className='min-h-screen font-vazir bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 mt-8'>
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
        <section
          style={{
            marginTop: `${
              isMobile ? mobileNavHeight / 1.5 : desktopNavHeight / 1.5
            }px`
          }}
          ref={sectionRefBlogs}
          className='mb-8'
          aria-labelledby='blog-title'
        >
          <h1
            id='blog-title'
            className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-white'
          >
            آخرین نوشته‌های مد و استایل
          </h1>
          <p className='text-gray-500 dark:text-gray-400 mt-2 text-sm md:text-base max-w-2xl'>
            جدیدترین مقالات، تحلیل ترندهای روز پوشاک و راهنمای جامع ست کردن لباس
            را اینجا دنبال کنید.
          </p>

          {/* Controls */}
          <div className='mt-6 grid grid-cols-1 md:grid-cols-12 gap-3'>
            {/* Search */}
            <div className='md:col-span-8'>
              <label className='sr-only' htmlFor='blog-search'>
                جستجو در مقالات
              </label>
              <input
                id='blog-search'
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder='جستجو: عنوان، توضیح، نویسنده...'
                className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            {/* Sort */}
            <div className='md:col-span-4'>
              <label className='sr-only' htmlFor='blog-sort'>
                مرتب‌سازی
              </label>
              <select
                id='blog-sort'
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className='w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='newest'>جدیدترین</option>
                <option value='oldest'>قدیمی‌ترین</option>
              </select>
            </div>
          </div>

          <div className='sr-only' aria-live='polite'>
            نمایش صفحه {currentPage} از {totalPages}.
          </div>
        </section>

        {/* List */}
        <div className='min-h-125'>
          {currentItems.length === 0 ? (
            <div className='rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center'>
              <p className='font-bold'>مقاله‌ای پیدا نشد</p>
              <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                عبارت جستجو را تغییر بده یا مرتب‌سازی را عوض کن.
              </p>
              {query ? (
                <button
                  onClick={() => setQuery('')}
                  className='mt-4 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700'
                >
                  پاک کردن جستجو
                </button>
              ) : null}
            </div>
          ) : (
            <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 list-none p-0 m-0'>
              {currentItems.map(post => (
                <li key={post._id} className='h-full'>
                  <Fashioncard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className='mt-12 p-4 border-t border-gray-100 dark:border-gray-800'
            aria-label='ناوبری صفحات وبلاگ'
          >
            <Pagenationadminproduct
              allProducts={totalItems}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              indexOfFirstProduct={indexOfFirstItem}
              indexOfLastProduct={indexOfLastItem}
              name='مقاله ها'
            />
          </nav>
        )}
      </main>
    </div>
  )
}
