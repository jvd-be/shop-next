'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

function Gallery({ images = [] }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)

  if (!images?.length) return null

  return (
    <div className="space-y-4">
      {/* Main slider */}
      <Swiper
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="rounded-xl lg:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"
      >
        {images.map((src, index) => (
          <SwiperSlide key={src + index}>
            {/* این wrapper باید relative باشه تا Image fill درست کار کنه */}
            <div className="relative w-full aspect-square lg:aspect-[4/5]">
              <Image
                alt="عکس محصول لباس"
                src={src}
                fill
                // برای اینکه بالا/پایین خالی نمونه => cover
                // اگر نخواستی کراپ بشه، cover رو به contain تغییر بده
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbs */}
      <Swiper
        onSwiper={setThumbsSwiper}
        modules={[FreeMode, Navigation, Thumbs]}
        watchSlidesProgress
        freeMode
        slidesPerView={5}
        spaceBetween={10}
        className="h-16 lg:h-20"
      >
        {images.map((src, index) => (
          <SwiperSlide key={'thumb-' + src + index}>
            <button
              type="button"
              className="relative w-full h-full rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 hover:ring-2 hover:ring-blue-500 dark:hover:ring-blue-400 transition-all"
              aria-label={`تصویر ${index + 1}`}
            >
              <Image
                alt={`تصویر بندانگشتی ${index + 1}`}
                src={src}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Gallery
