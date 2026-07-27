'use client'

import React, { useRef } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-coverflow'

import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules'
import Fashioncard from '../fashioncard/Fashioncard'
import Link from 'next/link'

export default function Sliderblogmain ({ titlecolor, blogs = [] }) {
  const prevRef = useRef(null)
  const nextRef = useRef(null)

  return (
    <section className='mx-auto w-full max-w-[92%] py-4'>
      <div className='mb-5 flex items-center justify-between px-1 md:px-2'>
        <div className='relative inline-flex items-center px-2 py-1'>
          <h3 className='text-base font-bold text-gray-900 dark:text-white md:text-lg'>
            <span className='relative inline-block'>
              <span className='absolute -bottom-0.5 -left-1 -right-1 -z-10 h-3 -rotate-2deg rounded-sm bg-blue-500/40' />
              <span className='text-blue-600 '>{titlecolor}</span>
            </span>
            <span className='ml-1 text-gray-900 dark:text-white'> ها </span>
          </h3>
        </div>

        <Link
          href='/blogs'
          className='group flex items-center gap-1.5 text-sm font-bold text-blue-600 transition hover:text-blue-700 cursor-pointer'
        >
          <span>مشاهده همه</span>
          <FaArrowLeft className='text-xs transition group-hover:-translate-x-1' />
        </Link>
      </div>

      <div className='group relative'>
        <Swiper
          effect='coverflow'
          grabCursor={true}
          centeredSlides={true}
          slidesPerView='auto'
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current
          }}
          onBeforeInit={swiper => {
            swiper.params.navigation.prevEl = prevRef.current
            swiper.params.navigation.nextEl = nextRef.current
          }}
          coverflowEffect={{
            rotate: 35,
            stretch: 0,
            depth: 120,
            modifier: 1,
            slideShadows: true
          }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Pagination, Navigation]}
          className='pb-10!'
        >
          {blogs?.filter(Boolean).map(post => (
            <SwiperSlide
              key={post._id}
              className='w-70! sm:w-[320px]! md:w-90!'
            >
              <Fashioncard post={post} />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          ref={prevRef}
          type='button'
          aria-label='اسلاید قبلی'
          className='absolute right-8 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-blue-500 hover:text-white active:scale-95 dark:border-gray-700 dark:bg-gray-800/95 dark:text-gray-100 md:flex [&.swiper-button-disabled]:pointer-events-none [&.swiper-button-disabled]:opacity-30'
        >
          <FaArrowRight />
        </button>

        <button
          ref={nextRef}
          type='button'
          aria-label='اسلاید بعدی'
          className='absolute left-8 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-700 shadow-lg backdrop-blur transition hover:scale-105 hover:bg-blue-500 hover:text-white active:scale-95 dark:border-gray-700 dark:bg-gray-800/95 dark:text-gray-100 md:flex [&.swiper-button-disabled]:pointer-events-none [&.swiper-button-disabled]:opacity-30'
        >
          <FaArrowLeft />
        </button>
      </div>
    </section>
  )
}
