'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Categoryicon from '@/components/modules/categoryicon/Categoryicon'
function Slidercategory ({ category }) {
  return (
    <div className=' w-full md:hidden h-full'>
      <h3 className=' font-vazir  text-sm px-4 pt-2 pb-6 text-gray-700 dark:text-gray-100 py-2'>
        دسته بندی ها
      </h3>
      <Swiper
        className='w-11/12'
        spaceBetween={5}
        slidesPerView={4}
 
      >
        {category?.map((c, index) => (
          <SwiperSlide key={index} className='swiper-slide flex!  justify-center! items-center! grow! '>
            <Categoryicon category={c} />
          </SwiperSlide>
        ))}
    
         
      </Swiper>
    </div>
  )
}

export default Slidercategory
