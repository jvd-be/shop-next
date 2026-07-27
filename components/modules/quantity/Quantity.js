'use client'
import { FaMinus, FaPlus } from 'react-icons/fa'

export default function Quantity ({ quantityPerSize, quantity, setQuantity }) {
  return (
    <div className='flex flex-col gap-3'>
      {/* عنوان + موجودی */}
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
          تعداد
        </h3>
{quantityPerSize<5? <span className='text-sm text-amber-600 dark:text-amber-400 font-medium'>
          فقط {quantityPerSize} عدد موجود است
        </span>:null}
       
      </div>

      {/* کنترل تعداد */}
      <div className='flex items-center justify-between rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden w-fit'>
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className='group flex h-12 w-12 items-center justify-center transition hover:bg-gray-100 dark:hover:bg-gray-700'
        >
          <FaMinus className='h-4 w-4 text-gray-600 dark:text-gray-300 transition group-hover:scale-110' />
        </button>

        <div className='flex min-w-20 items-center justify-center border-x border-gray-200 dark:border-gray-700 px-5 text-lg font-semibold text-gray-900 dark:text-white'>
          {quantity}
        </div>

        <button
          onClick={() => setQuantity(quantity + 1)}
          className='group flex h-12 w-12 items-center justify-center transition hover:bg-gray-100 dark:hover:bg-gray-700'
        >
          <FaPlus className='h-4 w-4 text-gray-600 dark:text-gray-300 transition group-hover:scale-110' />
        </button>
      </div>
    </div>
  )
}
