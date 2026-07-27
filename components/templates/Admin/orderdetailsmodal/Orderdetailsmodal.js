'use client'

import { FaTimes, FaMapMarkerAlt, FaBoxOpen } from 'react-icons/fa'

export default function Orderdetailsmodal ({ order, onClose }) {
  if (!order) return null

  const address =
    order.user?.addresses?.find(a => a.isDefault) || order.user?.addresses?.[0]

  const statusMap = {
    PENDING: 'در انتظار پرداخت',
    PROCESSING: 'در حال آماده سازی',
    SHIPPED: 'ارسال شده',
    DELIVERED: 'تحویل شده',
    CANCELLED: 'لغو شده'
  }

  return (
    <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4'>
      <div className='bg-white dark:bg-gray-900 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b dark:border-gray-800'>
          <div>
            <h2 className='text-xl font-bold'>جزئیات سفارش</h2>

            <p className='text-sm text-gray-500 mt-1'>کد سفارش: {order._id}</p>
          </div>

          <button
            onClick={onClose}
            className='w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center'
          >
            <FaTimes />
          </button>
        </div>

        {/* اطلاعات */}
        <div className='grid md:grid-cols-3 gap-5 p-6'>
          <div className='bg-gray-50 dark:bg-gray-800 rounded-2xl p-4'>
            <p className='text-xs text-gray-500'>وضعیت سفارش</p>

            <p className='font-bold mt-2'>{statusMap[order.status]}</p>
          </div>

          <div className='bg-gray-50 dark:bg-gray-800 rounded-2xl p-4'>
            <p className='text-xs text-gray-500'>مبلغ سفارش</p>

            <p className='font-bold mt-2'>
              {order.totalAmount.toLocaleString('fa-IR')} تومان
            </p>
          </div>

          <div className='bg-gray-50 dark:bg-gray-800 rounded-2xl p-4'>
            <p className='text-xs text-gray-500'>پرداخت</p>

            <p className='font-bold mt-2'>
              {order.isPaid ? 'پرداخت شده' : 'پرداخت نشده'}
            </p>
          </div>
        </div>

        {/* آدرس */}
        {address && (
          <div className='px-6 pb-6'>
            <div className='border rounded-2xl dark:border-gray-700 p-5'>
              <div className='flex items-center gap-2 mb-3'>
                <FaMapMarkerAlt className='text-blue-600' />
                <h3 className='font-bold'>آدرس تحویل</h3>
              </div>

              <p>{address.receiverName}</p>

              <p className='text-sm text-gray-500'>{address.receiverPhone}</p>

              <p className='mt-2'>
                {address.city} - {address.address}
              </p>

              <p className='text-sm mt-1'>
                پلاک {address.plaque}
                {address.unit && ` - واحد ${address.unit}`}
              </p>

              <p className='text-sm mt-1'>کدپستی: {address.postalCode}</p>
            </div>
          </div>
        )}

        {/* محصولات */}
        <div className='px-6 pb-8'>
          <div className='flex items-center gap-2 mb-4'>
            <FaBoxOpen className='text-blue-600' />
            <h3 className='font-bold'>محصولات سفارش</h3>
          </div>

          <div className='space-y-4'>
            {order.items.map(item => (
              <div
                key={item._id}
                className='border dark:border-gray-700 rounded-2xl p-4 flex justify-between items-center'
              >
                <div>
                  <h4 className='font-bold'>{item.product.title}</h4>

                  <div className='text-sm text-gray-500 mt-2 space-y-1'>
                    <p>تعداد: {item.quantity}</p>

                    <p>سایز: {item.size}</p>

                    <div className='flex items-center gap-2'>
                      <span>رنگ:</span>

                      <div
                        className='w-4 h-4 rounded-full border'
                        style={{ background: item.color }}
                      />

                      {item.colorName}
                    </div>
                  </div>
                </div>

                <div className='font-bold text-blue-600'>
                  {item.price.toLocaleString('fa-IR')} تومان
                </div>
              </div>
            ))}
            <div className='space-y-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700'>
              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center'>
                  🚚
                </div>
                <span className='text-gray-700 dark:text-gray-300 font-medium'>
                  هزینه ارسال
                </span>
              </div>

              <span className='text-lg font-semibold text-gray-900 dark:text-white'>
                {order.shippingCost.toLocaleString('fa-IR')} تومان
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
