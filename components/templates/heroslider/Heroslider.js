'use client'

import { useState, useEffect, useMemo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectFade, Autoplay, Pagination, Navigation } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

export default function HeroSlider ({ slider }) {
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const slides = useMemo(() => {
    if (!slider?.slides) return []

    return slider.slides
      .filter(slide => slide.isActive !== false)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
  }, [slider])

  if (!slider || slides.length === 0) return null

  return (
    <div className='relative w-full aspect-12/11   md:aspect-999/260 bg-gray-900 overflow-hidden'>
      <Swiper
        modules={[EffectFade, Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        effect={slider.animation === 'fade' ? 'fade' : 'slide'}
        autoplay={
          slider.autoplay
            ? {
                delay: slider.autoplayDelay || 5000,
                disableOnInteraction: false
              }
            : false
        }
        pagination={
          slider.showPagination
            ? {
                clickable: true,
                el: '.swiper-pagination-custom'
              }
            : false
        }
        navigation={
          slider.showNavigation
            ? {
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom'
              }
            : false
        }
        loop={slider.loop ?? true}
        className='w-full h-full'
      >
        {slides.map(slide => (
    <SwiperSlide key={slide._id}>
  <div className='relative w-full h-full flex items-center justify-center'>
    
    {/* image */}
    <div className='absolute inset-0 z-0'>
      <img
        src={
          isMobile
            ? slide.imageMobile || slide.imageDesktop
            : slide.imageDesktop
        }
        alt={slide.title || 'slide'}
        className='w-full h-full object-cover'
      />

      {slide.overlay && (
        <div
          className='absolute inset-0 bg-black'
          style={{ opacity: (slide.overlayOpacity || 20) / 100 }}
        />
      )}
    </div>

    {/* CONTENT */}
    <div
      className='relative z-10 text-left max-w-3xl px-6'
      style={{ color: slide.textColor || '#fff' }}
    >
      {slide.title && (
        <h2 className='text-3xl md:text-5xl font-bold mb-4'>
          {slide.title}
        </h2>
      )}

      {slide.subtitle && (
        <h3 className='text-xl md:text-2xl mb-3'>
          {slide.subtitle}
        </h3>
      )}

      {slide.description && (
        <p className='text-sm md:text-lg mb-6'>
          {slide.description}
        </p>
      )}

      {slide.buttonText && slide.buttonLink && (
        <a
          href={slide.buttonLink}
          target={slide.openInNewTab ? '_blank' : '_self'}
          className='inline-block bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition'
        >
          {slide.buttonText}
        </a>
      )}
    </div>

  </div>
</SwiperSlide>

        ))}
      </Swiper>
      {slider.showNavigation && (
        <>
          <div className='swiper-button-prev-custom absolute top-1/2 left-4 sm:left-8 -translate-y-1/2 z-20 text-white cursor-pointer hover:text-amber-500 transition-colors p-1 md:p-2 lg:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/10'>
            <FaChevronLeft className='w-3 h-3 md:w-5 md:h-5' />
          </div>

          <div className='swiper-button-next-custom absolute top-1/2 right-4 sm:right-8 -translate-y-1/2 z-20 text-white cursor-pointer hover:text-amber-500 transition-colors p-1 md:p-2 lg:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/10'>
            <FaChevronRight className='w-3 h-3 md:w-5 md:h-5' />
          </div>
        </>
      )}
      {slider.showPagination && (
        <div className='swiper-pagination-custom absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2' />
      )}
    </div>
  )
}
