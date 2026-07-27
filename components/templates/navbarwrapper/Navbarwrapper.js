'use client'
import React, {  useMemo, useState } from 'react'
import {
  FaSearch,
  FaUser,
  FaFire,
  FaChevronDown,
  FaCartPlus
} from 'react-icons/fa'
import ToggleButton from '../../modules/toggleButton/ToggleButton'
import Link from 'next/link'
import { useCart } from '@/components/utils/CartContext'
import Image from 'next/image'

function Navbarwrapper ({ auth, logo, initialproducts, initialblogs }) {
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [search, setSearch] = useState('')
  const { cartCount, mounted } = useCart()
  const [products, setProducts] = useState(initialproducts)
  const [blogs, setBlogs] = useState(initialblogs)
  const filteredProducts = useMemo(() => {
    if (search.trim().length > 2) {
      return products.filter(
        item =>
          item.title?.toLowerCase().includes(search.toLowerCase()) ||
          item.description?.toLowerCase().includes(search.toLowerCase())
      )
    }
    return []
  }, [products, search])
  const filteredBlogs = useMemo(() => {
    if (search.trim().length > 2) {
      return blogs.filter(
        item =>
          item.title?.toLowerCase().includes(search.trim().toLowerCase()) ||
          item.description
            ?.toLowerCase()
            .includes(search.trim().toLowerCase()) ||
          item.author?.toLowerCase().includes(search.trim().toLowerCase())
      )
    }
    return []
  }, [blogs, search])
  const handleSearch = e => {
    setSearch(e.target.value)
  }

  return (
    <nav
      className='hidden md:flex bg-white dark:bg-gray-900 
                border-b border-gray-200 dark:border-gray-800
                justify-center items-center 
                shadow-sm dark:shadow-sm dark:shadow-black/70 
                sticky top-0 z-50 '
    >
      <div className='grid grid-cols-12 gap-x-4 py-4 w-full max-w-7xl mx-auto px-4'>
        <div className='flex justify-center items-center font-yekan col-span-2'>
          <ToggleButton />

          <Link href={'/'} className=' dark:text-white'>
            {logo ? (
              <Image
                src={logo.siteLogo}
                alt={logo.siteName || 'logo'}
                width={120}
                height={40}
                className='mr-2 object-contain dark:invert'
                priority
              />
            ) : (
              <FaFire className='text-amber-600 size-12 mr-2' />
            )}
          </Link>
        </div>

        {/* ستون منو */}
        <ul className='col-span-5 flex justify-evenly items-center text-base text-neutral-700 dark:text-white'>
          {/* آیتم ۱: صفحه اصلی */}
          <li>
            <Link
              href={'/'}
              className='hover:text-amber-600 cursor-pointer transition-all ease-in duration-150'
            >
              صفحه اصلی
            </Link>
          </li>

          {/* آیتم ۲: محصولات (اصلاح شده) */}
          <li className='relative group'>
            {/* این تگ a به صفحه محصولات می‌رود */}
            <Link
              href='/products'
              className='flex items-center gap-1 hover:text-amber-600 transition-all ease-in duration-150 cursor-pointer'
            >
              <span>محصولات</span>
              <FaChevronDown className='text-xs text-gray-500 group-hover:rotate-180 transition-transform duration-200' />
            </Link>

            <div
              className='drop_down_menu absolute hidden dark:bg-gray-800 bg-gray-200 py-3 z-50 rounded-md group-hover:flex flex-col justify-center items-start w-full whitespace-nowrap min-w-50 space-y-1.5 shadow-lg transition-all ease-in duration-150 left-0'
              onClick={e => e.stopPropagation()}
            >
              <Link
                href={'/products/manteaus'}
                className='px-4 py-2 hover:text-amber-600 hover:bg-gray-300 dark:hover:bg-gray-700 w-full block'
              >
                مانتو
              </Link>
              <Link
                href={'/products/blouses'}
                className='px-4 py-2 hover:text-amber-600 hover:bg-gray-300 dark:hover:bg-gray-700 w-full block'
              >
                بلوز و شومیز
              </Link>
              <Link
                href={'/products/skirts'}
                className='px-4 py-2 hover:text-amber-600 hover:bg-gray-300 dark:hover:bg-gray-700 w-full block'
              >
                دامن
              </Link>
              <Link
                href={'/products/pants'}
                className='px-4 py-2 hover:text-amber-600 hover:bg-gray-300 dark:hover:bg-gray-700 w-full block'
              >
                شلوار
              </Link>
            </div>
          </li>

          {/* آیتم ۳: بلاگ */}
          <Link
            href={'/blogs'}
            className='hover:text-amber-600 cursor-pointer transition-all ease-in duration-150'
          >
            بلاگ
          </Link>

          {/* آیتم ۴: درباره ما */}
          <li>
            <Link
              href={'/aboutus'}
              className='hover:text-amber-600 cursor-pointer transition-all ease-in duration-150'
            >
              درباره ما
            </Link>
          </li>
        </ul>

        {/* ستون جستجو */}

        <>
          <div className='col-span-2 flex items-center text-base relative'>
            <input
              onChange={handleSearch}
              value={search}
              className={`outline-0 text-base border-0 font-yekan transition-all ease-in duration-150 text-neutral-700 dark:text-white bg-transparent ${
                showSearchBar
                  ? 'w-full px-2 py-1 border-b border-amber-500/50'
                  : 'w-0'
              }`}
              type='text'
              placeholder='جستجو کنید...'
            />
            <FaSearch
              onClick={() => {
                setShowSearchBar(!showSearchBar)
                if (showSearchBar) setSearch('') // بستن سرچ = پاک کردن متن
              }}
              className='size-6 w-2/12 text-neutral-700 dark:text-white cursor-pointer hover:text-amber-600 transition-colors'
            />

            {/* نمایش باکس نتایج */}
            {showSearchBar && search.trim().length >= 2 && (
              <div className='absolute top-full mt-2 right-0 w-full min-w-[320px] max-h-96 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl z-50 py-2'>
                {/* بخش محصولات */}
                {filteredProducts?.length > 0 && (
                  <div className='p-2 border-b border-gray-100 dark:border-gray-800'>
                    <p className='px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-500 mb-1'>
                      محصولات
                    </p>
                    {filteredProducts.slice(0, 5).map(item => (
                      <Link
                        key={item._id}
                        href={`/products/${item.slug || item._id}`}
                        onClick={() => {
                          setSearch('')
                          setShowSearchBar(false)
                        }} // پاکسازی بعد از کلیک
                        className='block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all'
                      >
                        <p className='text-sm font-medium text-neutral-800 dark:text-white'>
                          {item.title}
                        </p>
                        {item.description && (
                          <p className='text-[11px] text-gray-500 line-clamp-1 mt-0.5'>
                            {item.description}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                )}

                {/* بخش بلاگ‌ها */}
                {filteredBlogs?.length > 0 && (
                  <div className='p-2'>
                    <p className='px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 mb-1'>
                      مقالات بلاگ
                    </p>
                    {filteredBlogs.slice(0, 5).map(item => (
                      <Link
                        key={item._id}
                        href={`/blogs/${item.slug || item._id}`}
                        onClick={() => {
                          setSearch('')
                          setShowSearchBar(false)
                        }} // پاکسازی بعد از کلیک
                        className='block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all'
                      >
                        <p className='text-sm font-medium text-neutral-800 dark:text-white'>
                          {item.title}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}

                {/* اگر هیچ کدام نتیجه نداشتند */}
                {filteredProducts?.length === 0 && filteredBlogs?.length === 0 && (
                  <div className='p-4 text-center'>
                    <p className='text-sm text-gray-500 dark:text-gray-400 font-yekan'>
                      نتیجه‌ای برای "<span className='font-bold'>{search}</span>
                      " یافت نشد.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>

        {/* ستون اکشن‌ها */}
        <div className='col-span-3 justify-center flex items-center gap-3'>
          <Link
            href={'/cart'}
            className='relative group flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200'
          >
            <FaCartPlus className='size-6 text-neutral-700 dark:text-white group-hover:text-amber-600 transition-colors' />
            <span className='absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-800'>
              {mounted ? cartCount : 0}
            </span>
          </Link>

          {auth.isLoggedIn ? (
            <Link
              href={'/profile'}
              className='flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 transition-all ease-in duration-150 rounded-xl shadow-md hover:shadow-lg whitespace-nowrap'
            >
              <FaUser className='size-5' />
              <span>{auth.user.name || auth.user.phone}</span>
            </Link>
          ) : (
            <Link
              href={'/login'}
              className='flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 transition-all ease-in duration-150 rounded-xl shadow-md hover:shadow-lg whitespace-nowrap'
            >
              <FaUser className='size-5' />
              <span>ورود | عضویت</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbarwrapper
