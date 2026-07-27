'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { FaSearch, FaUser, FaHome, FaBlog } from 'react-icons/fa'
import { FaCartShopping } from 'react-icons/fa6'
import { usePathname } from 'next/navigation'

function Menumobilewrapper ({ auth }) {
  const path = usePathname()
  const [showSearch, setShowSearch] = useState(false)
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
  }

  const menuItems = [
    {
      id: 1,
      icon: <FaUser />,
      label: isLoggedIn ? userName : 'ورود عضویت',
      href: isLoggedIn ? '/profile' : '/login'
    },
    { id: 2, icon: <FaHome />, label: 'خانه', href: '/' },
    { id: 3, icon: <FaCartShopping />, label: 'سبد خرید', href: '/cart' },
    { id: 4, icon: <FaBlog />, label: 'بلاگ', href: '/blogs' },
    { id: 5, icon: <FaSearch />, label: 'جستجو', href: '#' }
  ]

  const getActiveId = () => {
    if (showSearch) return 5
    if (path === '/') return 2
    if (path === '/cart') return 3
    if (path === '/login' || path === '/profile') return 1
    return 0
  }

  const active = getActiveId()

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
          <input
            ref={inputRef}
            className='outline-0 p-1 text-base border-0 w-10/12 text-neutral-700 bg-transparent'
            type='text'
            placeholder='جستجو کنید'
          />
          <FaSearch className='size-4 w-2/12' />
        </div>
      </div>
    </>
  )
}

export default Menumobilewrapper
