"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FaHome, FaBox, FaBlog, FaUsers, FaCogs, 
  FaImage, FaChartLine, FaTags, FaEnvelope, 
  FaCommentDots, FaBars, FaSignOutAlt, FaTimes 
} from 'react-icons/fa'
import Sidebarlayout from '@/components/modules/Admin/sidebarlayout/Sidebarlayout'

const Adminlayout = ({ children }) => {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  // جلوگیری از هیدرهیدراتیشن (Hydration Mismatch)
  useEffect(() => {
    setMounted(true)
  }, [])

  const menuItems = [
    { name: 'داشبورد', icon: <FaHome />, path: '/admin' },
    { name: 'محصولات', icon: <FaBox />, path: '/admin/products' },
    { name: 'بلاگ‌ها', icon: <FaBlog />, path: '/admin/blogs' },
    { name: 'کاربران', icon: <FaUsers />, path: '/admin/users' },
    { name: 'دسته‌بندی‌ها', icon: <FaTags />, path: '/admin/categories' },
    { name: 'تیکت ها', icon: <FaEnvelope />, path: '/admin/tickets' },
    { name: 'نظرات', icon: <FaCommentDots />, path: '/admin/comments' },
    { name: 'تنظیمات ظاهری', icon: <FaImage />, path: '/admin/settings' },
    { name: 'آمار و گزارش‌ها', icon: <FaChartLine />, path: '/admin/stats' },
  ]

  // اگر هنوز mount نشده، یک حالت پیش‌فرض یا خالی برگردانید تا از خطای mismatch جلوگیری شود
  if (!mounted) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-vazir">
        <aside className="w-64 bg-slate-900 text-white flex flex-col">
          <div className="h-16 flex items-center justify-center border-b border-slate-700">
            <span className="text-xl font-bold text-blue-400">پنل ادمین</span>
          </div>
        </aside>
        <div className="flex-1 flex flex-col">
          <header className="h-16 bg-white dark:bg-gray-800 shadow-sm"></header>
          <main className="flex-1 p-6"></main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-vazir overflow-hidden">
      
      {/* --- سایدبار --- */}
     <Sidebarlayout menuItems={menuItems} setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen}/>
      {/* --- محتوای اصلی --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between px-6 z-10">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            {menuItems.find(i => i.path === pathname)?.name || 'داشبورد'}
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              <FaEnvelope />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                ا
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:block">مدیر سیستم</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          {children}
        </main>
      </div>

    </div>
  )
}

export default Adminlayout