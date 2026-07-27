import Headersection from '@/components/modules/aboutus/headersection/Headersection'
import React from 'react'

export default function Ourhistory({timeline}) {
  return (
 <div className='max-w-2xl mx-auto'>
          <Headersection title={" تاریخچه ما"} desc={" سفر ما از ابتدا تا امروز"}/>
            <div className='relative'>
              {/* خط عمودی */}
              <div className='absolute right-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 hidden lg:block' />
              {timeline.map((item, index) => (
                <div key={index} className='relative flex gap-6 mb-8 last:mb-0'>
                  {/* نقطه */}
                  <div className='shrink-0 w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white font-bold z-10'>
                    {index + 1}
                  </div>
                  {/* محتوا */}
                  <div className='flex-1 bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-sm'>
                    <div className='text-blue-600 dark:text-blue-400 font-bold text-lg mb-1'>
                      {item.year}
                    </div>
                    <h4 className='font-bold text-gray-900 dark:text-white text-lg mb-2'>
                      {item.title}
                    </h4>
                    <p className='text-gray-600 dark:text-gray-400'>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
  )
}
