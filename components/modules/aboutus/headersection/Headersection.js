import React from 'react'

export default function Headersection ({title,desc}) {
  return (
    <div className='text-center mb-8'>
      <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
        {title}
      </h2>
      <p className='text-gray-500 dark:text-gray-400'>
        {desc}
      </p>
    </div>
  )
}
