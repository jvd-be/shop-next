'use client'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  FaSearch,
  FaUser,
  FaHome,
  FaBlog,
  FaShoppingBag,
  FaTags,
  FaCube,
  FaBoxes,
  FaBoxOpen
} from 'react-icons/fa'
import { FaCartShopping } from 'react-icons/fa6'
import { usePathname } from 'next/navigation'
import { useCart } from '@/components/utils/CartContext'

function Menumobilewrapper ({
  auth,
  logo,
  initialproducts,
  initialblogs,
  categories
}) {
  const path = usePathname()
  const [showSearch, setShowSearch] = useState(false)
  const [search, setSearch] = useState('')
  const { cartCount, mounted } = useCart()
  const [products, setProducts] = useState(initialproducts)
  const [blogs, setBlogs] = useState(initialblogs)
  const inputRef = useRef()
  const isLoggedIn = auth?.isLoggedIn
  const userName = auth?.user?.name || 'پروفایل'

  useEffect(() => {
    if (showSearch) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    }
  }, [showSearch])

  useEffect(() => {
    if (showSearch) {
      ;(document.body.style.overflow = 'hidden'),
        (document.body.style.touchAction = 'none')
    } else {
      ;(document.body.style.overflow = 'unset'),
        (document.body.style.touchAction = 'auto')
    }
    return () => {
      ;(document.body.style.overflow = 'unset'),
        (document.body.style.touchAction = 'auto')
    }
  }, [showSearch])

  const handleItemClick = id => {
    if (id === 5) {
      setShowSearch(true)
    } else {
      setShowSearch(false)
    }
  }

  const closeSearch = () => {
    setShowSearch(false)
    setSearch('')
  }

  const menuItems = [
    {
      id: 1,
      icon: <FaUser />,
      label: isLoggedIn ? userName : 'ورود عضویت',
      href: isLoggedIn ? '/profile' : '/signup'
    },
    { id: 3, icon: <FaBoxOpen />, label: 'محصولات', href: '/products' },
    { id: 2, icon: <FaHome />, label: 'خانه', href: '/' },
    { id: 4, icon: <FaBlog />, label: 'بلاگ', href: '/blogs' },
    { id: 5, icon: <FaSearch />, label: 'جستجو', href: '#' }
  ]

  const getActiveId = () => {
    if (showSearch) return 5
    if (path === '/') return 2
    if (path === '/products') return 3
    if (path === '/blogs') return 4
    if (path === '/signup' || path === '/profile') return 1
    return 0
  }

  const active = getActiveId()

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
    <>
      <div className='menu_mobile md:hidden bg-gray-200 shadow-2xl dark:bg-[#1E1E1E] w-11/12 fixed left-1/2 -translate-x-1/2 bottom-6 grid grid-cols-5 rounded-lg min-h-16 z-300'>
        {menuItems.map(item => (
          <Link
            href={item.href}
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className='text-center cursor-pointer flex flex-col items-center justify-around text-xs transition-all'
          >
            <span
              className={`transition-all ease-in duration-300 ${
                active === item.id
                  ? 'text-[#386BF6] relative -top-4 scale-110 bg-white rounded-full size-8 flex justify-center items-center'
                  : 'text-[#A4B7D2]'
              }`}
            >
              {item.icon}
            </span>

            <span
              className={`text-[14px] ${
                active === item.id
                  ? 'text-[#386BF6] relative -top-1'
                  : 'text-[#A4B7D2]'
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      <div>
        <div
          className={`bg-neutral-800/35 backdrop-blur-2xl w-full inset-0 fixed z-50 transition-all duration-200 ${
            showSearch ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          onClick={closeSearch}
        ></div>

        <div
          className={`w-10/12 fixed md:hidden left-1/2 -translate-x-1/2 flex items-center transition-all ease-in-out duration-200 z-50 p-3 bg-neutral-300/60 rounded-2xl ${
            showSearch ? 'top-5 opacity-100' : '-top-16 opacity-0'
          }`}
        >
          <>
            <div className='col-span-2 flex items-center text-base relative'>
              {/* نمایش باکس نتایج */}
              {showSearch && search.trim().length >= 2 && (
                <div className='absolute top-full mt-8  w-full min-w-[320px] max-h-96 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl z-50 py-2'>
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
                            setShowSearch(false)
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
                            setShowSearch(false)
                          }}
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
                  {filteredProducts?.length === 0 &&
                    filteredBlogs?.length === 0 && (
                      <div className='p-4 text-center'>
                        <p className='text-sm text-gray-500 dark:text-gray-400 font-yekan'>
                          نتیجه‌ای برای "
                          <span className='font-bold'>{search}</span>" یافت نشد.
                        </p>
                      </div>
                    )}
                </div>
              )}
            </div>
          </>

          <input
            ref={inputRef}
            className='outline-0 p-1 text-base border-0 w-10/12 text-neutral-700 bg-transparent'
            type='text'
            placeholder='جستجو کنید'
            onChange={handleSearch}
            value={search}
          />
          <FaSearch
            onClick={() => {
              setShowSearch(!showSearch)
              if (showSearch) setSearch('')
            }}
            className='size-4 w-2/12'
          />
        </div>
      </div>
    </>
  )
}

export default Menumobilewrapper
