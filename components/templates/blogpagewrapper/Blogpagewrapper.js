'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { FaShareNodes, FaCheck } from 'react-icons/fa6'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Fashioncard from '@/components/modules/fashioncard/Fashioncard'
import { useDevice } from '@/components/utils/helper'
import { useHeight } from '@/components/utils/navHeightContext'

const Blogcontent = ({ body }) => {
  if (!body || !Array.isArray(body) || body.length === 0) {
    return null
  }

  return (
    <div className='space-y-6 font-vazir text-base md:text-lg leading-relaxed  text-gray-700 dark:text-gray-300'>
      {body.map((block, index) => (
        <div key={block._id || index} className='mb-8'>
          {block.subTitle && (
            <h2 className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4'>
              {block.subTitle}
            </h2>
          )}

          {block.subDescription && (
            <p className='mb-4'>{block.subDescription}</p>
          )}

          {Array.isArray(block.subImages) && block.subImages.length > 0 && (
            <div className='grid grid-cols-1 gap-4 my-6'>
              {block.subImages.map((imgSrc, imgIndex) => (
                <figure
                  key={imgIndex}
                  className='rounded-2xl overflow-hidden shadow-lg my-2'
                >
                  <Image
                    src={imgSrc}
                    alt={block.subTitle || `تصویر ${imgIndex + 1}`}
                    width={1000}
                    height={600}
                    className='w-full h-auto object-cover'
                  />
                </figure>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function Blogpagewrapper ({ Blog, relatedPosts = [] }) {
  const [copied, setCopied] = useState(false)
  const isMobile = useDevice()
  const { mobileNavHeight, desktopNavHeight } = useHeight()
  const handleShare = async () => {
    const url = window.location.href

    const shareData = {
      title: Blog.title,
      text: Blog.description || '',
      url
    }

    // Web Share API
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch (err) {
        if (err.name === 'AbortError') return
        console.error(err)
      }
    }

    // Clipboard API
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        return
      } catch (err) {
        console.error(err)
      }
    }

    // آخرین fallback برای Safari
    try {
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)

      input.select()
      input.setSelectionRange(0, 99999)

      document.execCommand('copy')

      document.body.removeChild(input)

      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }
  // گارد: اگر Blog هنوز نرسیده باشه
  if (!Blog) return null

  return (
    <div
      style={{
        marginTop: `${isMobile ? mobileNavHeight : desktopNavHeight}px`
      }}
      className='min-h-screen font-vazir  bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 selection:bg-blue-200 dark:selection:bg-blue-900'
    >
      <main className='pt-4 md:pt-6 pb-20'>
        {/* 1. هدر مقاله */}
        <header className='max-w-3xl mx-auto px-4 mb-8 md:mb-12 text-center'>
          <h1 className='text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8 leading-tight tracking-tight'>
            {Blog.title}
          </h1>

          {Blog.description && (
            <p className='text-lg text-gray-500 dark:text-gray-400 mb-6'>
              {Blog.description}
            </p>
          )}

          <div className='flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-gray-500 dark:text-gray-400 border-y border-gray-100 dark:border-gray-700 py-4'>
            <div className='flex items-center gap-2'>
              <span className='font-medium text-gray-900 dark:text-white text-sm md:text-base'>
                {Blog.author}
              </span>
            </div>
            <span className='w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600'></span>
            <span>
              {Blog.createdAt
                ? new Date(Blog.createdAt).toLocaleDateString('fa-IR')
                : ''}
            </span>
          </div>
        </header>

        {/* 2. تصویر کاور */}
        <figure className='max-w-5xl mx-auto px-4 mb-12 md:mb-16'>
          <div className='relative aspect-video md:aspect-21/9 w-full rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50 dark:shadow-black/50'>
            <Image
              src={Blog.coverImage || '/default-cover.png'}
              alt={Blog.title}
              fill
              className='object-cover'
              priority
            />
          </div>
        </figure>

        {/* 3. بدنه مقاله */}
        <article className='max-w-3xl mx-auto px-4'>
          <Blogcontent body={Blog.body} />

          {/* 4. فوتر مقاله */}
          <div className='mt-16 pt-8 border-t border-gray-100 dark:border-gray-700'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
              <div className='flex items-center gap-3'>
                <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                  اشتراک‌گذاری:
                </span>
                <button
                  onClick={handleShare}
                  className='p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors relative'
                  aria-label='اشتراک‌گذاری مقاله'
                >
                  {copied ? (
                    <FaCheck className='w-4 h-4 text-green-500' />
                  ) : (
                    <FaShareNodes className='w-4 h-4' />
                  )}
                </button>
                {copied && (
                  <span className='text-xs text-green-600 dark:text-green-400'>
                    لینک کپی شد!
                  </span>
                )}
              </div>
              <div className='flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-3 pr-6 rounded-full border border-gray-100 dark:border-gray-700 w-full md:w-auto'>
                <div className='flex flex-col'>
                  <span className='text-xs font-bold text-gray-400 uppercase tracking-wider'>
                    نویسنده
                  </span>
                  <span className='font-bold text-gray-900 dark:text-white'>
                    {Blog.author}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* 5. مقالات مرتبط (اسلایدر) */}
        {relatedPosts.length > 0 && (
          <section className='max-w-5xl mx-auto px-4 mt-20 md:mt-24'>
            <h3 className='text-2xl font-bold mb-8 flex items-center gap-3'>
              <span className='w-2 h-8 bg-blue-600 rounded-full'></span>
              مقالات مرتبط
            </h3>

            <div className='w-full'>
              <Swiper
                modules={[Navigation]}
                spaceBetween={12}
                slidesPerView={1.2}
                pagination={{ clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 2.2 },
                  768: { slidesPerView: 3.2 },
                  1024: { slidesPerView: 4.2 }
                }}
                className='w-full pb-10'
              >
                {relatedPosts.map(item => (
                  <SwiperSlide key={item._id} className='h-auto'>
                    <Fashioncard post={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
