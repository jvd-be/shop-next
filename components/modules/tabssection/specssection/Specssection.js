import React from 'react'

export default function Specssection({specs}) {
  return (
   <div className='grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4'>
            {Object.entries(specs).map(([key, value], index) => (
              <div
                key={key}
                className={`flex justify-between py-3 text-sm lg:text-base ${
                  index !== Object.keys(specs).length - 1
                    ? 'border-b border-gray-100 dark:border-gray-700'
                    : ''
                }`}
              >
                <span className='text-gray-500 dark:text-gray-400'>{key}</span>
                <span className='font-medium text-gray-900 dark:text-white'>
                  {value}
                </span>
              </div>
            ))}
          </div>
  )
}
