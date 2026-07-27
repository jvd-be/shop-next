'use client'

import { useState } from 'react'
import { FiPackage, FiClock, FiX } from 'react-icons/fi'

const STATUS_STYLES = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  PAYMENT_FAILED: 'bg-red-100 text-red-700'
}

const STATUS_LABELS = {
  PENDING: 'در انتظار پرداخت',
  PROCESSING: 'در حال پردازش',
  SHIPPED: 'ارسال شده',
  DELIVERED: 'تحویل داده شده',
  CANCELLED: 'لغو شده',
  PAYMENT_FAILED: 'پرداخت ناموفق'
}

const Ordercard = ({ order }) => {
  const [showModal, setShowModal] = useState(false)

  const statusStyle = STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-700'
  const statusLabel = STATUS_LABELS[order.status] || order.status

  return (
    <>
      <div className='border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-all bg-white dark:bg-gray-800'>
        <div className='flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4'>
          <div className='flex items-center gap-4'>
            <div className='bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-blue-600'>
              <FiPackage size={24} />
            </div>

            <div>
              <h4 className='font-bold text-lg'>
                #{order._id.slice(-6)}
              </h4>

              <p className='text-sm text-gray-500 flex items-center gap-1 mt-1'>
                <FiClock size={14} />
                {new Intl.DateTimeFormat('fa-IR').format(
                  new Date(order.createdAt)
                )}
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle}`}
          >
            {statusLabel}
          </span>
        </div>

        <div className='flex justify-between items-center pt-4 border-t'>
          <span>{order.items.length} کالا</span>

          <div className='flex items-center gap-4'>
            <span className='font-bold'>
              {order.totalAmount.toLocaleString('fa-IR')} تومان
            </span>

            <button
              onClick={() => setShowModal(true)}
              className='text-blue-600 hover:underline'
            >
              مشاهده جزئیات
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4'
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className='bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto'
          >
            {/* Header */}
            <div className='flex justify-between items-center border-b p-5'>
              <h2 className='text-xl font-bold'>جزئیات سفارش</h2>

              <button onClick={() => setShowModal(false)}>
                <FiX size={22} />
              </button>
            </div>

            {/* اطلاعات سفارش */}
            <div className='p-5 space-y-6'>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <p className='text-gray-500'>شماره سفارش</p>
                  <p className='font-medium'>{order._id}</p>
                </div>

                <div>
                  <p className='text-gray-500'>وضعیت</p>
                  <p>{statusLabel}</p>
                </div>

                <div>
                  <p className='text-gray-500'>روش پرداخت</p>
                  <p>{order.paymentMethod}</p>
                </div>

                <div>
                  <p className='text-gray-500'>تاریخ</p>
                  <p>
                    {new Intl.DateTimeFormat('fa-IR').format(
                      new Date(order.createdAt)
                    )}
                  </p>
                </div>
              </div>

              {/* محصولات */}
              <div>
                <h3 className='font-bold mb-3'>محصولات</h3>

                <div className='space-y-3'>
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className='border rounded-lg p-4 flex justify-between items-center'
                    >
                      <div>
                        <h4 className='font-semibold'>{item.name}</h4>

                        <div className='text-sm text-gray-500 mt-1 flex gap-4'>
                          <span>تعداد: {item.quantity}</span>

                          {item.colorName && (
                            <span>رنگ: {item.colorName}</span>
                          )}

                          {item.size && (
                            <span>سایز: {item.size}</span>
                          )}
                        </div>
                      </div>

                      <span className='font-bold'>
                        {item.price.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* خلاصه */}
              <div className='border rounded-xl p-4 space-y-3 bg-gray-50 dark:bg-gray-800'>
                <div className='flex justify-between'>
                  <span>جمع کالاها</span>

                  <span>
                    {order.itemsTotal.toLocaleString('fa-IR')} تومان
                  </span>
                </div>

                <div className='flex justify-between'>
                  <span>هزینه ارسال</span>

                  <span>
                    {order.shippingCost.toLocaleString('fa-IR')} تومان
                  </span>
                </div>

                <div className='border-t pt-3 flex justify-between font-bold text-lg'>
                  <span>مبلغ نهایی</span>

                  <span>
                    {order.totalAmount.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              </div>

              {/* آدرس */}
              {order.address && (
                <div className='border rounded-xl p-4'>
                  <h3 className='font-bold mb-2'>آدرس ارسال</h3>

                  <p>{order.address.fullName}</p>
                  <p>{order.address.phone}</p>
                  <p>
                    {order.address.province} - {order.address.city}
                  </p>
                  <p>{order.address.address}</p>
                  <p>کدپستی: {order.address.postalCode}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Ordercard