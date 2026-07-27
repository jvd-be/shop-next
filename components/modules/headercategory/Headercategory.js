import React from 'react'

export default function Headercategory({title,desc}) {
  return (
         <div className="bg-white  dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
           {desc}
          </p>
        </div>
      </div>

  )
}
