import React from 'react'

export default function Valuecard({value}) {
  return (
     <div
              className='bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow'
            >
              <div className='w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-3'>
                <value.icon className='text-xl text-blue-600 dark:text-blue-400' />
              </div>
              <h4 className='font-medium text-gray-900 dark:text-white mb-1'>
                {value.title}
              </h4>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                {value.desc}
              </p>
            </div>
  )
}
