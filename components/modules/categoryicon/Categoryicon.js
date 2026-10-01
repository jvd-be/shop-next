import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

function Categoryicon ({ category }) {


  return (
    <Link
      href={`/${category?.slug}`}
      className='w-16 h-fit flex flex-col items-center justify-center rounded-full md:hidden '
    >
      <Image
        src={`${category?.image || '/hx.jpg'}`}
        alt={category?.name}
        width={64}
        height={64}
        className='object-cover object-center transition-transform duration-500 rounded-full'
        quality={82}
      />
      <h3 className='font-vazir text-xs text-gray-700 dark:text-gray-100 mt-1'>
        {category?.name}
      </h3>
    </Link>
  )
}

export default Categoryicon
