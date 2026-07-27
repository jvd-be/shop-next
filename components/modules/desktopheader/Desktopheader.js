import React from 'react'

function Desktopheader({category,name}) {
  return (
            <header className='hidden lg:block bg-white dark:bg-gray-800 shadow-sm'>
          <div className='max-w-7xl mx-auto px-4 py-4'>
            <nav className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
              <span className='hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer'>
                فروشگاه
              </span>
              <span>/</span>
              <span className='hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer'>
                {category}
              </span>
              <span>/</span>
              <span className='text-gray-700 dark:text-gray-200'>
                {name}
              </span>
            </nav>
          </div>
        </header>

  )
}

export default Desktopheader
