import React from 'react'
import Link from 'next/link'

export default function Topbanner({ banner }) {
  if (!banner || !banner.isActive) return null

  const now = new Date()

  if (banner.startDate && new Date(banner.startDate) > now) {
    return null
  }

  if (banner.endDate && new Date(banner.endDate) < now) {
    return null
  }

  const backgroundStyle = (() => {
    if (
      banner.backgroundType === 'gradient' &&
      banner.gradientFrom &&
      banner.gradientTo
    ) {
      return {
        background: `linear-gradient(to right, ${banner.gradientFrom}, ${banner.gradientTo})`
      }
    }

    if (banner.backgroundType === 'image' && banner.image) {
      return {
        backgroundImage: `url("${banner.image}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    }

    return {
      backgroundColor: banner.bgColor || '#dc2626'
    }
  })()

  const content = (
    <>
      {banner.overlay && (
        <div
          className='absolute inset-0 pointer-events-none'
          style={{
            background: banner.overlayColor || 'rgba(0,0,0,0.3)'
          }}
        />
      )}

      <div
        className='
          relative
          w-full
          max-w-7xl
          mx-auto
          px-3
          sm:px-4
          py-1.5
          sm:py-2
          md:py-2.5
        '
      >
        <div
          className='
            flex
            items-center
            justify-center
            gap-x-2
            sm:gap-x-3
            text-center
          '
        >
          {/* متن بنر */}
          <div
            className='
              min-w-0
              flex-1
              sm:flex-none
              sm:w-auto
              overflow-hidden
              line-clamp-2
              leading-5
            '
          >
            <span className='text-xs sm:text-sm md:text-base font-semibold'>
              {banner.title}
            </span>

            {banner.subtitle && (
              <span className='text-[11px] sm:text-xs md:text-sm opacity-90 mr-2'>
                {banner.subtitle}
              </span>
            )}

            {banner.description && (
              <span className='text-[11px] sm:text-xs md:text-sm opacity-90 mr-2'>
                {banner.description}
              </span>
            )}
          </div>

          {/* دکمه فقط دسکتاپ */}
          {banner.buttonText && banner.buttonLink && (
            <span
              className='
                hidden
                sm:inline-flex
                items-center
                justify-center
                shrink-0
                bg-white
                text-black
                text-xs
                md:text-sm
                px-3
                py-1
                rounded-full
                font-medium
                whitespace-nowrap
              '
            >
              {banner.buttonText}
            </span>
          )}
        </div>
      </div>
    </>
  )

  const className = `
    relative
    block
    w-full
    overflow-hidden
    cursor-pointer
    transition-opacity
    hover:opacity-95
    active:opacity-90
  `

  const style = {
    ...backgroundStyle,
    color: banner.textColor || '#fff'
  }

  if (banner.buttonLink) {
    return (
      <Link
        href={banner.buttonLink}
        id='top-banner'
        className={className}
        style={style}
        aria-label={banner.buttonText || banner.title || 'مشاهده'}
      >
        {content}
      </Link>
    )
  }

  return (
    <div
      id='top-banner'
      className={className}
      style={style}
    >
      {content}
    </div>
  )
}