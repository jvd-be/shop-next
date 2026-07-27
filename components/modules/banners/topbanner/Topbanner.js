import React from 'react'

export default function Topbanner ({ banner }) {
  if (!banner || !banner.isActive) return null

  const now = new Date()

  // if (banner.startDate && new Date(banner.startDate) > now) return null
  // if (banner.endDate && new Date(banner.endDate) < now) return null

  const backgroundStyle = (() => {
    if (banner.backgroundType === 'gradient') {
      return {
        background: `linear-gradient(to right, ${banner.gradientFrom}, ${banner.gradientTo})`
      }
    }

    if (banner.backgroundType === 'image' && banner.image) {
      return {
        backgroundImage: `url(${banner.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    }

    return {
      backgroundColor: banner.bgColor || '#dc2626'
    }
  })()

  return (
    <div
      className='relative w-full '
      style={{
        ...backgroundStyle,
        color: banner.textColor || '#fff',
        height: banner?.height || 'auto'
      }}
    >
      {banner.overlay && (
        <div
          className='absolute inset-0'
          style={{ background: banner.overlayColor }}
        />
      )}

      <div className='relative max-w-7xl mx-auto flex items-center justify-center gap-4 py-3 px-4 text-center'>
        {banner.title && (
          <h4 className='text-sm md:text-base font-semibold'>{banner.title}</h4>
        )}

        {banner.subtitle && (
          <span className='text-sm opacity-90'>{banner.subtitle}</span>
        )}
        {banner.description && (
          <span className='text-sm opacity-90'>{banner.description}</span>
        )}

        {banner.buttonText && banner.buttonLink && (
          <a
            href={banner.buttonLink}
            className='bg-white text-black text-xs md:text-sm px-3 py-1 rounded-full font-medium hover:opacity-90 transition'
          >
            {banner.buttonText}
          </a>
        )}
      </div>
    </div>
  )
}
