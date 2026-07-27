import React from 'react'

export default function Descriptionsection({description}) {
  return (
      <div>
            <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
              {description}
            </p>
          </div>
  )
}
