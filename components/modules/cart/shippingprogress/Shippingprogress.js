function Shippingprogress ({
  subtotal,
  shippingProgress,
  amountToFreeShipping
}) {
  const formatPrice = price => new Intl.NumberFormat('fa-IR').format(price)
  const FREE_SHIPPING_THRESHOLD = 3000000

  return (
    <div className='mb-5'>
      <div className='flex justify-between text-xs mb-2'>
        <span className='text-gray-500 dark:text-gray-400'>
          {subtotal >= FREE_SHIPPING_THRESHOLD
            ? '🎉 ارسال رایگان!'
            : 'تا ارسال رایگان'}
        </span>
        <span className='font-medium text-gray-700 dark:text-gray-300'>
          {subtotal >= FREE_SHIPPING_THRESHOLD
            ? 'رایگان شد'
            : formatPrice(amountToFreeShipping) + ' تومان'}
        </span>
      </div>
      <div className='h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden'>
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            shippingProgress >= 100
              ? 'bg-green-500'
              : 'bg-linear-to-br from-blue-500 to-blue-600'
          }`}
          style={{ width: `${shippingProgress}%` }}
        />
      </div>
    </div>
  )
}

export default Shippingprogress

