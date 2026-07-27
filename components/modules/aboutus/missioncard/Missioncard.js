import React from 'react'

export default function Missioncard({title,description,Icon}) {
  return (
     <div className='bg-white dark:bg-gray-800  rounded-2xl p-6 lg:p-8 shadow-sm'>
              <div className='w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4'>
                <Icon className='text-2xl text-blue-600 dark:text-blue-400' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
               {title}
              </h3>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                {description}
              </p>
            </div>
  )
}
