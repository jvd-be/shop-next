import React from 'react'
import { FaArrowLeft, FaHeart } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
function Mobileheader({ isWishlist, setIsWishlist, name,addToWishList }) {
const router=useRouter()

  return (
    <header className='lg:hidden bg-white dark:bg-gray-800 shadow-sm sticky top-0 md:top-16 z-40'>
      <div className='flex items-center justify-between px-4 py-3'>
        <button onClick={()=>router.back()} className='p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'>
          <FaArrowLeft className='w-6 h-6 text-gray-700 dark:text-gray-200' />
        </button>
        <h1 className='text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-50'>
          {name}
        </h1>
        <button
          onClick={()=>addToWishList()}
          className={`p-2 rounded-lg transition-colors ${
            isWishlist ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          <FaHeart className={`w-6 h-6 ${isWishlist ? 'text-red-500' : 'text-gray-500'}`} />
        </button>
      </div>
    </header>
  )
}

export default Mobileheader