'use client'
import React from 'react'
import Link from 'next/link'
import { HiShoppingBag, HiUser } from 'react-icons/hi'
import ThemeToggle from '../toggleButton/ToggleButton'
import { useCart } from '@/components/utils/CartContext'
import { FaFire } from 'react-icons/fa'
import Image from 'next/image'

export default function Headermobile ({ logo }) {
  const { cartCount, mounted } = useCart()

  console.log(logo)

  return (
    <header className='sticky top-0  left-0 right-0 z-50 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 shadow-md md:hidden'>
      <div className='flex items-center justify-between px-4 py-3 h-16'>
        <Link href={'/'} className=' dark:text-white'>
          {logo ? (
            <Image
              src={logo.siteLogo}
              alt={logo.siteName || 'logo'}
              width={80}
              height={30}
              className='mr-2 object-contain dark:invert'
              priority
            />
          ) : (
            <FaFire className='text-amber-600 size-12 mr-2' />
          )}
        </Link>

        <div className='flex items-center gap-4'>
          <ThemeToggle />

          <Link
            href='/profile'
            className='relative p-2 text-gray-600 hover:text-blue-600  dark:text-gray-100 transition-colors'
          >
            <HiUser className='w-6 h-6 ' />
          </Link>

          <Link
            href='/cart'
            className='relative p-2 text-gray-600 hover:text-blue-600  dark:text-gray-100 transition-colors'
          >
            <HiShoppingBag className='w-6 h-6 ' />

            <span className='absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-800'>
              {mounted ? cartCount : 0}
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
