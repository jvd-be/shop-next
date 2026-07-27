import { FaExclamationCircle } from 'react-icons/fa'
export default function Selectsize ({
  sizes,
  setShowSizeGuide,
  setSelectedSize,
  sizeError,
  selectedSize,
  setSizeError
}) 

{
 
  return (
    <div>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          سایز:{' '}
          <span className='text-gray-900 dark:text-white'>
            {selectedSize || 'انتخاب کنید'}
          </span>
        </h3>
        <button
          onClick={() => setShowSizeGuide(true)}
          className='text-sm text-blue-600 dark:text-blue-400 hover:underline'
        >
          راهنمای سایز
        </button>
      </div>
      <div className='flex gap-2 flex-wrap'>
        {sizes.map(size => (
          <button
            key={size}
            onClick={() => {
              setSelectedSize(size)
              setSizeError(false)
            }}
            className={`w-12 h-12 lg:w-14 lg:h-14 rounded-lg border-2 font-medium transition-all ${
              selectedSize === size
                ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : sizeError
                ? 'border-red-500 dark:border-red-400 text-red-600 dark:text-red-400'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
      {sizeError && (
        <p className='text-red-500 dark:text-red-400 text-sm mt-2 flex items-center gap-1'>
          <FaExclamationCircle className='w-4 h-4' />
          لطفاً سایز را انتخاب کنید
        </p>
      )}
    </div>
  )
}
