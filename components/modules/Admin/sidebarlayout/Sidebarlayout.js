"use client"
import React from 'react'
import Link from 'next/link'
import { FaTimes,FaBars,FaSignOutAlt } from 'react-icons/fa'
import { usePathname } from 'next/navigation'
export default function Sidebarlayout({isSidebarOpen,setIsSidebarOpen,menuItems}) {
 const pathname = usePathname();
    return (
     <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } dark:bg-slate-900 bg-slate-100 text-slate-900 dark:text-white transition-all duration-300 ease-in-out flex flex-col shadow-xl`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
          {isSidebarOpen && (
            <span className="text-xl font-bold tracking-wider text-blue-400">پنل ادمین</span>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded hover:bg-slate-800 transition-colors"
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 bg-slate-100 dark:bg-slate-900 text-white ">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => {
              const isActive = pathname === item.path
              return (
                <li key={item.path}> {/* <--- Key باید منحصر به فرد باشد */}
                  <Link 
                    href={item.path} 
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-slate-900 dark:text-white  ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {isSidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <Link 
            href="/" 
            className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors"
          >
            <FaSignOutAlt />
            {isSidebarOpen && <span className="text-sm">خروج از پنل</span>}
          </Link>
        </div>
      </aside>
  )
}
