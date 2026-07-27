import React from 'react'
import { FaHeart } from 'react-icons/fa'
export default function Addwishlistheaderdesktop ({
  isWishlist,

  brand,
  addToWishList
}) {
  return (
    <div className='hidden lg:flex items-center justify-between'>
      <span className='px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm'>
        {brand}
      </span>
      <button
        onClick={() => addToWishList()}
        className={`p-2 rounded-lg transition-colors ${
          isWishlist
            ? 'text-red-500 bg-red-50 dark:bg-red-900/30'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        <FaHeart
          className={`w-6 h-6 ${isWishlist ? 'text-red-500' : 'text-gray-400'}`}
        />
      </button>
    </div>
  )
}
