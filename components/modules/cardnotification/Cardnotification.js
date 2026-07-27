import React from 'react'

export default function Cardnotification ({title,Icon,color,show}) {
  if (!show) return null
  
  return (
    <div className='fixed top-20 min-w-fit  left-1/2 -translate-x-1/2 z-700 animate-bounce'>
      <div className={`${color} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3`}>
        <Icon className='w-5 h-5' />
        <span className='font-medium '>{title}</span>
      </div>
    </div>
  )
}
