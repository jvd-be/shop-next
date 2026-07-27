import React from 'react'
import { FaCheck, FaShoppingCart } from 'react-icons/fa'
export default function Btnaddtocart({handleAddToCart,isAddedToCart}) {
  return (
     <div className='flex gap-3'>
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 lg:py-4 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    isAddedToCart
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white'
                  }`}
                >
                  {isAddedToCart ? (
                    <>
                      <FaCheck className='w-5 h-5' />
                      اضافه شد
                    </>
                  ) : (
                    <>
                      <FaShoppingCart className='w-5 h-5' />
                      افزودن به سبد
                    </>
                  )}
                </button>
              </div>
  )
}
