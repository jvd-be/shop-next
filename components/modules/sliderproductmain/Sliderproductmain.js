'use client'

import React, { useEffect, useRef, useState } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Keyboard } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import Productcard from '../productcard/Productcard'
import Link from 'next/link'

export default function Sliderproductmain ({
  titlecolor,
  products = [],
  toggleWishlist,
  wishlist = [],
  handleAddToCart,href
}) {
  const prevRef = useRef(null)
  const nextRef = useRef(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

    if (!isMounted) {
    return (
      <div className="w-11/12 mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50">
        {/* این بخش شبیه به اسلایدر پیش از لود است تا پرش ایجاد نشود */}
        <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
        <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
        <div className="hidden md:block aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
        <div className="hidden md:block aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
      </div>
    )
  }
  return (
    <section className='mx-auto w-full max-w-[92%] py-4'>
 <div className='mb-5 flex items-center justify-between px-1 md:px-2'>
  <div className='relative inline-flex items-center px-2 py-1'>

  

<h3 className='text-base font-bold  text-gray-900 dark:text-white md:text-lg'>

  <span className='relative inline-block'>
    <span className='absolute -bottom-0.5 -left-1 -right-1 h-3 bg-orange-500/40 -rotate-2 rounded-sm -z-10' />
    <span className='text-orange-600'>{titlecolor}</span>
  </span>


  <span className='text-gray-900 dark:text-white ml-1'> ها </span>
</h3>



  </div>

      <Link
          href={href}
          className='group flex items-center gap-1.5 text-sm font-bold text-orange-600 transition hover:text-orange-700 cursor-pointer'
        >
          <span>مشاهده همه</span>
          <FaArrowLeft className='text-xs transition group-hover:-translate-x-1' />
        </Link>
</div>


      <div className='group relative'>
        <Swiper
          modules={[Navigation, Pagination, Keyboard]}
          slidesPerView={3.5}
          spaceBetween={30}
                pagination={{ clickable: true }}
          keyboard={{ enabled: true }}
          breakpoints={{
            240: { slidesPerView: 1.25, spaceBetween: 10 },
            360: { slidesPerView: 1.5, spaceBetween: 10 },
            480: { slidesPerView: 2.25, spaceBetween: 14 },
            720: { slidesPerView: 3.25, spaceBetween: 18 },
            940: { slidesPerView: 4.25, spaceBetween: 24 },
            1280: { slidesPerView: 5.25, spaceBetween: 28 }
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current
          }}
          onBeforeInit={swiper => {
            swiper.params.navigation.prevEl = prevRef.current
            swiper.params.navigation.nextEl = nextRef.current
          }}
          className='pb-10!'
        >
          {products?.filter(Boolean).map(product => (
            <SwiperSlide key={product._id} className='h-auto'>
              <Productcard
                product={product}
                onToggleWishlist={toggleWishlist}
                isWishlisted={wishlist?.includes(String(product._id))}
                handleAddToCart={handleAddToCart}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          ref={prevRef}
          type='button'
          aria-label='اسلاید قبلی'
          className='absolute right-8 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-blue-600 hover:text-white active:scale-95 dark:border-gray-700 dark:bg-gray-800/95 dark:text-gray-100 md:flex [&.swiper-button-disabled]:pointer-events-none [&.swiper-button-disabled]:opacity-30'
        >
          <FaArrowRight />
        </button>

        <button
          ref={nextRef}
          type='button'
          aria-label='اسلاید بعدی'
          className='absolute left-8 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 -translate-x-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-blue-600 hover:text-white active:scale-95 dark:border-gray-700 dark:bg-gray-800/95 dark:text-gray-100 md:flex [&.swiper-button-disabled]:pointer-events-none [&.swiper-button-disabled]:opacity-30'
        >
          <FaArrowLeft />
        </button>
      </div>
    </section>
  )
}
