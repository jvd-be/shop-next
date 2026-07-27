import React from 'react'

export default function Ticketslist () {
  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between p-3 border-b hover:bg-gray-50'>
        <div>
          <h4 className='font-semibold text-gray-800'>مشکل در پرداخت آنلاین</h4>
          <p className='text-xs text-gray-500'>واحد پشتیبانی فنی</p>
        </div>
        <span className='bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded'>
          در حال بررسی
        </span>
      </div>
      <div className='flex items-center justify-between p-3 border-b hover:bg-gray-50'>
        <div>
          <h4 className='font-semibold text-gray-800'>
            سوال در مورد سایز لباس
          </h4>
          <p className='text-xs text-gray-500'>واحد فروش</p>
        </div>
        <span className='bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded'>
          پاسخ داده شده
        </span>
      </div>
    </div>
  )
}
