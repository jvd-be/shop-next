'use client'

import { useTheme } from '@/components/utils/ThemeContext'
import { useEffect, useState } from 'react'
import { IoMoon,IoSunny  } from "react-icons/io5";

export default function ThemeToggle() {
  const { darkMode, toggleMode } = useTheme()
  const [mounted, setMounted] = useState(false)

  // جلوگیری از hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
    ) // skeleton placeholder
  }

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={darkMode ? 'روشن کردن حالت روشن' : 'روشن کردن حالت تاریک'}
      className={`
        relative flex items-center justify-center
        w-11 h-11 rounded-full
        bg-gray-200 hover:bg-gray-300
        dark:bg-gray-800 dark:hover:bg-gray-700
        text-gray-800 dark:text-gray-200
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-sky-500 dark:focus:ring-sky-400
        hover:scale-105 active:scale-95
        shadow-sm hover:shadow
      `}
    >
      <div
        className={`
          absolute inset-0 flex items-center justify-center
          transition-all duration-500 ease-out
          ${darkMode ? 'opacity-0 scale-75 rotate-90' : 'opacity-100 scale-100 rotate-0'}
        `}
      >
        <IoSunny size={20} className="stroke-[2.5]" />
      </div>

      <div
        className={`
          absolute inset-0 flex items-center justify-center
          transition-all duration-500 ease-out
          ${darkMode ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-90'}
        `}
      >
        <IoMoon size={20} className="stroke-[2.5]" />
      </div>
    </button>
  )
}