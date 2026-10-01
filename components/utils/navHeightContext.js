'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'

const HeightContext = createContext({
  desktopNavRef: null,
  mobileNavRef: null,
  desktopNavHeight: 0,
  mobileNavHeight: 0
})

export default function HeightProvider ({ children }) {
  const desktopNavRef = useRef(null)
  const mobileNavRef = useRef(null)

  const [desktopNavHeight, setDesktopNavHeight] = useState(0)
  const [mobileNavHeight, setMobileNavHeight] = useState(0)

  useEffect(() => {
    const updateHeights = () => {
      if (desktopNavRef.current) {
        setDesktopNavHeight(
          desktopNavRef.current.getBoundingClientRect().height
        )
      }
      if (mobileNavRef.current) {
        setMobileNavHeight(mobileNavRef.current.getBoundingClientRect().height)
      }
    }

    const observer = new ResizeObserver(updateHeights)

    const timer = setTimeout(() => {
      updateHeights()

      if (desktopNavRef.current) observer.observe(desktopNavRef.current)
      if (mobileNavRef.current) observer.observe(mobileNavRef.current)
    }, 0)

    window.addEventListener('resize', updateHeights)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
      window.removeEventListener('resize', updateHeights)
    }
  }, [])

  return (
    <HeightContext.Provider
      value={{
        desktopNavRef,
        mobileNavRef,
        desktopNavHeight,
        mobileNavHeight
      }}
    >
      {children}
    </HeightContext.Provider>
  )
}

export const useHeight = () => useContext(HeightContext)
