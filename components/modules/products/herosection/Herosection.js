import React from 'react'

export default function Herosection ({ marginT }) {
  console.log(marginT);
  
  return (
    <div
      style={{ marginTop: `${marginT}px` }}
      className='relative bg-linear-to-br  from-indigo-600 via-purple-600 to-indigo-800 dark:from-indigo-900 dark:via-purple-900 dark:to-indigo-950 text-white py-30 px-4 sm:px-6 lg:px-8 overflow-hidden'
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      <div className='absolute -top-24 -left-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
      <div className='absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>

      <div className='relative max-w-7xl mx-auto text-center z-10'>
        <h1 className='text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg text-white dark:text-white'>
          کلکسیون جدید فصل
        </h1>
        <p className='text-lg md:text-xl text-indigo-100 dark:text-indigo-200 max-w-2xl mx-auto font-light mb-8'>
          جدیدترین مدل‌های مانتو، شومیز، شلوار و لباس دخترانه را با بهترین کیفیت
          و قیمت از ما بخواهید.
        </p>
        <div className='flex justify-center gap-4'>
          <button className='bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg'>
            مشاهده محصولات
          </button>
        </div>
      </div>
    </div>
  )
}
