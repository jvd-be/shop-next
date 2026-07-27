import React from 'react'

export default function Membercard ({member}) {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow'>
      <div className='w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-5xl mb-4'>
        {member.avatar}
      </div>
      <h4 className='font-bold text-gray-900 dark:text-white text-lg'>
        {member.name}
      </h4>
      <p className='text-blue-600 dark:text-blue-400 text-sm'>{member.role}</p>
    </div>
  )
}
