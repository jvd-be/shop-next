import { FaTrashAlt, FaMinus, FaPlus } from 'react-icons/fa'

function Cartitem ({ item, onUpdateQuantity, onRemove, isRemoving }) {
  const formatPrice = price => new Intl.NumberFormat('fa-IR').format(price)

  const unitFinalPrice = item.finalPrice ?? item.price ?? 0
  const unitOldPrice = item.oldPrice ?? unitFinalPrice

  const hasDiscount = item.discount > 0 && unitOldPrice > unitFinalPrice

  const totalOldPrice = unitOldPrice * item.quantity
  const totalFinalPrice = unitFinalPrice * item.quantity
  const savedPrice = totalOldPrice - totalFinalPrice

  const isDisabled = item.isOutOfStock

  return (
    <div
      className={`bg-white shadow-xs dark:bg-gray-800 rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 transition-all duration-300 ${
        isRemoving ? 'opacity-0 scale-95 translate-x-4' : ''
      } ${isDisabled ? 'opacity-60' : ''}`}
    >
      <div className='flex gap-3 sm:gap-4'>
        {/* image */}
        <div className='w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gray-100 dark:bg-gray-700  rounded-xl lg:rounded-2xl shrink-0 overflow-hidden'>
          <img
            src={item.image}
            alt={item.title}
            className='w-full h-full object-cover'
          />
        </div>

        {/* details */}
        <div className='flex-1 min-w-0 flex flex-col'>
          <div className='flex justify-between items-start gap-2'>
            <div className='min-w-0 flex-1'>
              <h3 className='font-semibold text-gray-900 dark:text-white text-xs sm:text-sm lg:text-base line-clamp-2'>
                {item.title}
              </h3>
            </div>

            <button
              onClick={() => onRemove(item)}
              className='p-1.5 sm:p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg sm:rounded-xl transition-all shrink-0'
            >
              <FaTrashAlt className='w-4 h-4 sm:w-5 sm:h-5' />
            </button>
          </div>

          {/* variants */}
          <div className='flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3'>
            <span className='bg-gray-50 dark:bg-gray-700/50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs text-gray-600 dark:text-gray-300'>
              سایز: <span className='font-medium'>{item.size}</span>
            </span>

            <span className='bg-gray-50 dark:bg-gray-700/50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1 sm:gap-1.5'>
              رنگ:
              <span
                className='w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white dark:border-gray-600 shadow-sm'
                style={{ backgroundColor: item.color }}
              />
              <span>{item.colorName}</span>
            </span>
          </div>

          {/* stock status */}
          {item.isOutOfStock && (
            <p className='text-red-500 text-xs sm:text-sm mt-2'>
              این محصول در حال حاضر ناموجود است
            </p>
          )}

          {item.stock < 2 && (
            <p className='text-orange-500 text-xs sm:text-sm mt-2'>
              فقط {item.stock} عدد موجود است
            </p>
          )}

          {/* bottom */}
          <div className='flex items-end justify-between mt-3 sm:mt-4'>
            {/* quantity */}
            <div className='flex items-center gap-0.5 sm:gap-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl p-0.5 sm:p-1'>
              <button
                onClick={() =>
                  onUpdateQuantity(
                    item.productId,
                    item.variantId,
                    item.quantity - 1
                  )
                }
                disabled={item.quantity <= 1 || isDisabled}
                className='w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95'
              >
                <FaMinus className='w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600 dark:text-gray-300' />
              </button>

              <span className='w-8 sm:w-10 text-center font-semibold text-gray-900 dark:text-white text-sm sm:text-base'>
                {item.quantity}
              </span>

              <button
                onClick={() =>
                  onUpdateQuantity(
                    item.productId,
                    item.variantId,
                    item.quantity + 1
                  )
                }
                disabled={item.quantity >= item.stock || isDisabled}
                className='w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95'
              >
                <FaPlus className='w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600 dark:text-gray-300' />
              </button>
            </div>

            {/* price */}
            <div className='text-left min-w-0'>
              {hasDiscount && (
                <div className='flex items-center justify-end gap-2 mb-1'>
                  <span className='text-[11px] sm:text-xs text-gray-400 line-through'>
                    {formatPrice(totalOldPrice)}
                  </span>

                  <span className='bg-red-100 font-vazir dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md font-medium'>
                    %{item.discount}
                  </span>
                </div>
              )}

              <p className='font-bold text-gray-900 dark:text-white text-sm sm:text-base lg:text-lg leading-tight'>
                {formatPrice(totalFinalPrice)}

                <span className='text-[10px] sm:text-xs font-normal text-gray-400 mr-1'>
                  تومان
                </span>
              </p>

              {item.quantity > 1 && (
                <p className='text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap'>
                  {formatPrice(unitFinalPrice)} / هر عدد
                </p>
              )}

              {savedPrice > 0 && (
                <p className='text-[10px] sm:text-xs text-green-600 dark:text-green-400 mt-1'>
                  {formatPrice(savedPrice)} تومان صرفه‌جویی
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cartitem
