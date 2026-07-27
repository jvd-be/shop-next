export default function Pricewidget ({price,oldPrice,discount}) {
    const formatPrice = price => {
    return new Intl.NumberFormat('fa-IR').format(price)
  }

  return (
    <div className='bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 lg:p-6'>
      <div className='flex items-baseline gap-2'>
        <span className='text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400'>
          {formatPrice(price)}
        </span>
        <span className='text-gray-500 dark:text-gray-400'>تومان</span>
      </div>
      {oldPrice && (
        <div className='flex items-center gap-3 mt-1'>
          <span className='text-gray-400 dark:text-gray-500 line-through text-lg'>
            {formatPrice(oldPrice)}
          </span>
          <span className='bg-red-500 text-white text-xs px-2 py-1 rounded-full'>
            {discount}% تخفیف
          </span>
        </div>
      )}
    </div>
  )
}
