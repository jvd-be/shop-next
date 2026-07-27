import { FaArrowRight, FaTruck, FaLock, FaSpinner } from 'react-icons/fa'

function Cartsummary ({
  items,
  subtotal,
  discount,
  discountAmount,
  getShippingCost,
  formatPrice,
  onCheckout,
  isLoading,
  address
}) {
  const shippingCost = getShippingCost(subtotal)

  const isFreeShipping = shippingCost === 0

  // قیمت اصلی محصولات (قبل تخفیف)
  const originalSubtotal = items.reduce(
    (sum, item) => sum + (item.oldPrice || item.price) * item.quantity,
    0
  )

  // تخفیف خود محصولات
  const productsDiscount = originalSubtotal - subtotal

  // مبلغ نهایی
  const totalPrice = subtotal - discountAmount + shippingCost

  // مجموع سود کاربر
  const totalSavings = productsDiscount + discountAmount

  return (
    <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm'>
      {/* header */}
      <div className='flex items-center justify-between mb-5'>
        <h2 className='text-base sm:text-lg font-bold text-gray-900 dark:text-white'>
          خلاصه سفارش
        </h2>

        <span className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
          {items.length} محصول
        </span>
      </div>

      {/* invoice details */}
      <div className='space-y-3'>
        {/* قیمت قبل تخفیف */}
        <div className='flex justify-between text-sm'>
          <span className='text-gray-500 dark:text-gray-400'>قیمت کالاها</span>

          <span className='text-gray-900 dark:text-white font-medium'>
            {formatPrice(originalSubtotal)} تومان
          </span>
        </div>

        {/* تخفیف کالاها */}
        {productsDiscount > 0 && (
          <div className='flex justify-between text-sm'>
            <span className='text-red-500 dark:text-red-400'>
              تخفیف محصولات
            </span>

            <span className='text-red-500 dark:text-red-400 font-medium'>
              -{formatPrice(productsDiscount)} تومان
            </span>
          </div>
        )}

        {/* کد تخفیف */}
        {discount > 0 && (
          <div className='flex justify-between text-sm'>
            <span className='text-green-600 dark:text-green-400'>کد تخفیف</span>

            <span className='text-green-600 dark:text-green-400 font-medium'>
              -{formatPrice(discountAmount)} تومان
            </span>
          </div>
        )}

        {/* ارسال */}
        <div className='flex justify-between text-sm'>
          <span className='text-gray-500 dark:text-gray-400'>هزینه ارسال</span>

          <span
            className={
              isFreeShipping
                ? 'text-green-600 dark:text-green-400 font-medium'
                : 'text-gray-900 dark:text-white'
            }
          >
            {isFreeShipping ? 'رایگان' : `${formatPrice(shippingCost)} تومان`}
          </span>
        </div>
      </div>

      {/* summary box */}
      <div className='mt-4 rounded-2xl bg-gray-50 dark:bg-gray-700/40 p-4 space-y-3 border border-gray-100 dark:border-gray-700'>
        {/* قیمت بدون تخفیف */}
        <div className='flex items-center justify-between'>
          <span className='text-sm text-gray-500 dark:text-gray-400'>
            قیمت نهایی بدون تخفیف
          </span>

          <span className='font-semibold text-gray-800 dark:text-gray-200 line-through'>
            {formatPrice(originalSubtotal + shippingCost)} تومان
          </span>
        </div>

        {/* سود شما */}
        {totalSavings > 0 && (
          <div className='flex items-center justify-between'>
            <span className='text-sm text-green-700 dark:text-green-300'>
              سود شما از خرید
            </span>

            <span className='font-bold text-green-600 dark:text-green-400'>
              {formatPrice(totalSavings)} تومان
            </span>
          </div>
        )}

        {/* مبلغ نهایی */}
        <div className='border-t border-dashed border-gray-200 dark:border-gray-600 pt-3 flex items-center justify-between'>
          <span className='text-base font-bold text-gray-900 dark:text-white'>
            مبلغ قابل پرداخت
          </span>

          <div className='text-left'>
            <div className='text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400'>
              {formatPrice(totalPrice)}
            </div>

            <span className='text-xs text-gray-400'>تومان</span>
          </div>
        </div>
      </div>

      {/* checkout */}
      <button
        onClick={onCheckout}
        disabled={isLoading || address.length === 0}
        className='w-full mt-5 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl sm:rounded-2xl font-semibold flex items-center justify-center gap-2 sm:gap-3 transition-all shadow-lg shadow-blue-600/30 disabled:shadow-none text-sm sm:text-base'
      >
        {isLoading ? (
          <>
            <FaSpinner className='w-4 h-4 sm:w-5 sm:h-5 animate-spin' />
            <span>در حال پردازش...</span>
          </>
        ) : (
          <>
            <span>پرداخت و ثبت سفارش</span>

            <FaArrowRight className='w-4 h-4' />
          </>
        )}
      </button>

      {/* features */}
      <div className='grid grid-cols-2 gap-2 sm:gap-3 mt-5 pt-5 border-t border-gray-100 dark:border-gray-700'>
        <div className='flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
          <div className='w-8 h-8 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center'>
            <FaTruck className='text-green-500' />
          </div>

          <span>ارسال سریع</span>
        </div>

        <div className='flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
          <div className='w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center'>
            <FaLock className='text-blue-500' />
          </div>

          <span>پرداخت امن</span>
        </div>
      </div>
    </div>
  )
}

export default Cartsummary
