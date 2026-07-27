import React from 'react'

export default function Featurecard({desc,Icon,title}) {
  return (
      <div
           
            className='bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 text-center'
          >
            <div className='w-12 h-12 mx-auto bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center mb-3 shadow-sm'>
              <Icon className='text-xl text-blue-600 dark:text-blue-400' />
            </div>
            <h4 className='font-medium text-gray-900 dark:text-white mb-1'>
              {title}
            </h4>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              {desc}
            </p>
          </div>
  )
}
