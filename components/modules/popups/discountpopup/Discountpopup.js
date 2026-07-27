'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const DiscountPopup = ({ popup }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  
  useEffect(() => {
    if (!popup || !popup.isActive) return
    if (isOpen) return
    // const now = new Date();

    // if (popup.startDate && new Date(popup.startDate) > now) return;
    // if (popup.endDate && new Date(popup.endDate) < now) return;

    // frequency
    if (popup.frequency === 'once') {
      if (localStorage.getItem(`popup_${popup.key}`)) return
    }

    if (popup.frequency === 'oncePerDay') {
      const last = localStorage.getItem(`popup_${popup.key}`)
      if (last) {
        const diff = Date.now() - Number(last)
        if (diff < 86400000) return
      }
    }
    if (popup.triggerType === 'delay') {
      const delay = Number(popup.delay) ?? 15000

      const timer = setTimeout(() => {
        setIsOpen(true)
      }, delay)

      return () => clearTimeout(timer)
    }

    if (popup.triggerType === 'instant') {
      setIsOpen(true)
      return
    }
    if (popup.triggerType === 'scroll') {
      const handleScroll = () => {
        const pageHeight =
          document.documentElement.scrollHeight - window.innerHeight

        if (pageHeight <= 0) return

        const scrolledPercent = (window.scrollY / pageHeight) * 100

        if (scrolledPercent >= Number(popup.delay)) {
          setIsOpen(true)
          window.removeEventListener('scroll', handleScroll)
        }
      }

      window.addEventListener('scroll', handleScroll)

      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [
    popup?._id,
    popup?.isActive,
    popup?.triggerType,
    popup?.delay,
    popup?.frequency
  ])

  const handleClose = () => {
    setIsClosing(true)

    if (popup.frequency === 'once') {
      localStorage.setItem(`popup_${popup.key}`, '1')
    }

    if (popup.frequency === 'oncePerDay') {
      localStorage.setItem(`popup_${popup.key}`, Date.now())
    }

    setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
    }, 200)
  }

  if (!popup || !popup.isActive) return null
  if (!isOpen) return null

  let backgroundStyle = {}

  if (popup.backgroundType === 'gradient') {
    backgroundStyle = {
      background: `linear-gradient(135deg, ${
        popup.gradientFrom || '#6366f1'
      }, ${popup.gradientTo || '#2563eb'})`
    }
  }

  if (popup.backgroundType === 'image' && popup.image) {
    backgroundStyle = {
      backgroundImage: `url("${popup.image}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }

  if (popup.backgroundType === 'color') {
    backgroundStyle = {
      backgroundColor: popup.backgroundColor || '#ffffff'
    }
  }

  return (
    <div
      onClick={handleClose}
      className='fixed inset-0 flex items-center justify-center p-4'
      style={{
        zIndex: 600,
        background: `rgba(0,0,0,${(popup.overlayOpacity ?? 60) / 100})`,
        backdropFilter: 'blur(6px)'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transition-all duration-200 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        style={backgroundStyle}
      >
        <div className='px-6 py-6 text-center'>
          {popup.title && (
            <h2
              className='text-2xl font-bold mb-4'
              style={{ color: popup.textColor || '#111827' }}
            >
              {popup.title}
            </h2>
          )}

          {popup.description && (
            <p className='mb-6' style={{ color: popup.textColor || '#374151' }}>
              {popup.description}
            </p>
          )}

          {popup.buttonText && popup.buttonLink && (
            <Link
              href={popup.buttonLink}
              onClick={handleClose}
              className='block w-full text-center font-semibold py-4 rounded-2xl transition-all'
              style={{
                background: popup.buttonColor || '#6366f1',
                color: '#fff'
              }}
            >
              {popup.buttonText}
            </Link>
          )}
        </div>

        {popup.closable !== false && (
  <div className='border-t px-6 py-4 flex justify-end'>
            <button
              onClick={handleClose}
              className='text-sm font-medium px-4 py-2 rounded-xl text-white hover:bg-black/10'
            >
              بعداً
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscountPopup
