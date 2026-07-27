'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('system')
  const [darkMode, setDarkMode] = useState(false)

  // مقدار اولیه
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system'
    setTheme(savedTheme)
  }, [])

  // اعمال تم
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = () => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && media.matches)

      setDarkMode(isDark)
      document.documentElement.classList.toggle('dark', isDark)
    }

    applyTheme()

    // فقط وقتی روی system هستیم تغییرات سیستم را دنبال کن
    if (theme === 'system') {
      media.addEventListener('change', applyTheme)
      return () => media.removeEventListener('change', applyTheme)
    }
  }, [theme])

  const toggleMode = () => {
    const next = darkMode ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
  }

  const resetToSystem = () => {
    localStorage.removeItem('theme')
    setTheme('system')
  }

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleMode,
        resetToSystem,
        theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)