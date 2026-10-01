'use client'

import { useState } from 'react'
import { FaCheck, FaExclamationCircle } from 'react-icons/fa'
import { FaArrowLeft } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'

import Emptycart from '@/components/modules/cart/emptycart/Emptycart'
import Deletemodal from '@/components/modules/cart/deletemodal/Deletemodal'
import Cartitem from '@/components/modules/cart/cartitem/Cartitem'
import Cartsummary from '@/components/modules/cart/cartsummary/Cartsummary'
import Couponinput from '@/components/modules/cart/couponinput/Couponinput'
import Shippingprogress from '@/components/modules/cart/shippingprogress/Shippingprogress'
import Cartnotification from '@/components/modules/cardnotification/Cardnotification'
import { UseNotification } from '@/components/hooks/UseNotification'
import { useCart } from '@/components/utils/CartContext'
import Cardnotification from '@/components/modules/cardnotification/Cardnotification'
import Addressform from '@/components/modules/profile/addressform/Addressform'
import Customfetch from '@/components/utils/CustomeFetch'
import { useHeight } from '@/components/utils/navHeightContext'
import { useDevice } from '@/components/utils/helper'

export default function Cartwrapper ({ shippings, address }) {
  const router = useRouter()
  const isMobile = useDevice()
  const { mobileNavHeight, desktopNavHeight } = useHeight()
  const gateways = [
    {
      id: 'ZARINPAL',
      title: 'زرین‌پال'
    },
    {
      id: 'ZIBAL',
      title: 'زیبال'
    },
    {
      id: 'NEXTPAY',
      title: 'نکست‌پی'
    }
  ]
  const { items, updateQuantity, removeFromCart, cartTotal, mounted } =
    useCart()

  const [couponCode, setCouponCode] = useState('')
  const { notification, showNotification } = UseNotification()
  const [discount, setDiscount] = useState(0)
  const [selectedGateway, setSelectedGateway] = useState('ZARINPAL')
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [discountLabel, setDiscountLabel] = useState('')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [freeShipping, setFreeShipping] = useState(false)
  const [couponError, setCouponError] = useState(false)
  const [couponMessage, setCouponMessage] = useState('')
  const [typeDiscount, setTypeDiscount] = useState('')

  const [showCouponInput, setShowCouponInput] = useState(true)

  const [confirmDelete, setConfirmDelete] = useState(null)

  const [isLoading, setIsLoading] = useState(false)

  // hydration از provider
  if (!mounted) {
    return <div className='min-h-screen bg-gray-50 dark:bg-gray-900' />
  }

  // cart empty
  if (!items?.length) {
    return <Emptycart />
  }
  const FREE_SHIPPING_THRESHOLD = Number(shippings?.freeThreshold || 0)
  const TIERED_SHIPPING_THRESHOLD = Number(shippings?.halfThreshold || 0)

  const FREE_SHIPPING_COST = Number(shippings?.freeShippingCost || 0)
  const TIERED_SHIPPING_COST = Number(shippings?.halfShippingCost || 0)
  const REGULAR_SHIPPING_COST = Number(shippings?.fullShippingCost || 0)

  const shippingProgress = FREE_SHIPPING_THRESHOLD
    ? Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
    : 0

  let amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal)

  function getShippingCost (amount) {
    // کد ارسال رایگان
    if (freeShipping) {
      return 0
    }

    // threshold معمولی
    if (amount >= FREE_SHIPPING_THRESHOLD) {
      return FREE_SHIPPING_COST
    }

    if (amount >= TIERED_SHIPPING_THRESHOLD) {
      return TIERED_SHIPPING_COST
    }

    return REGULAR_SHIPPING_COST
  }
  const formatPrice = price => new Intl.NumberFormat('fa-IR').format(price)

  // update qty
  const updateQ = (productId, variantId, newQuantity) => {
    updateQuantity({
      productId,
      variantId,
      quantity: Number(newQuantity)
    })
  }

  // open delete modal
  const handleRemoveRequest = item => {
    setConfirmDelete(item)
  }

  // confirm delete
  const handleConfirmDelete = async item => {
    await removeFromCart({
      productId: item.productId,
      variantId: item.variantId
    })

    setConfirmDelete(null)
  }

  // apply coupon
  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase()

    if (!code) {
      setCouponError(true)
      setTimeout(() => setCouponError(false), 2000)
      return
    }

    try {
      const res = await fetch('/api/discount/use', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code,
          items: items.map(item => ({
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity
          }))
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setCouponMessage(data.error || 'خطا در بررسی کد تخفیف')

        setTimeout(() => setCouponMessage(false), 4000)
        return
      }

      setTypeDiscount(data.type)
      setDiscount(data.value)
      setDiscountAmount(data.discountAmount)
      setDiscountLabel(data.code)

      if (data.type === 'Shipping') {
        setFreeShipping(true)
      }

      setCouponError(false)
      setShowCouponInput(false)
    } catch (error) {
      console.error(error)
      setCouponMessage('خطا در ارتباط با سرور')
      setTimeout(() => setCouponMessage(false), 4000)
    }
  }

  const removeCoupon = () => {
    setDiscount(0)
    setCouponMessage('')
    setDiscountAmount(0)
    setTypeDiscount('')
    setDiscountLabel('')

    setCouponCode('')

    setFreeShipping(false)

    setShowCouponInput(true)
  }

  const handleCheckout = async () => {
    try {
      setIsLoading(true)

      const orderRes = await fetch('/api/orders', {
        method: 'POST'
      })

      const orderData = await orderRes.json()

      if (!orderRes.ok) {
        showNotification(
          'error',
          orderData.message || 'ثبت سفارش با خطا مواجه شد'
        )
        return
      }

      const paymentRes = await fetch('/api/payment/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: orderData.orderId,
          gateway: selectedGateway
        })
      })

      const paymentData = await paymentRes.json()

      if (!paymentRes.ok || !paymentData.success) {
        showNotification(
          'error',
          paymentData.message || 'اتصال به درگاه پرداخت ناموفق بود'
        )
        return
      }

      window.location.href = paymentData.paymentUrl
    } catch (error) {
      console.error(error)
      showNotification(
        'error',
        'مشکلی در ارتباط با سرور پیش آمد، دوباره تلاش کنید'
      )
    } finally {
      setIsLoading(false)
    }
  }
  const handleAddAddress = async newAddress => {
    setShowAddressForm(false)

    try {
      let response = await Customfetch('/api/user/address/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress)
      })

      if (response.ok) {
        const data = await response.json()

        showNotification('success', 'آدرس شما با موفقیت ثبت شد.')
      } else {
        showNotification('error', 'خطا در ثبت آدرس')
      }
    } catch (error) {
      console.log(error)

      showNotification('error', 'مشکل در اتصال')
    }
  }
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <Cardnotification
        title={notification.title}
        type={notification.type}
        show={notification.show}
        Icon={notification.type === 'success' ? FaCheck : FaExclamationCircle}
        color={notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
      />

      <Deletemodal
        confirmDelete={confirmDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
        title='حذف از سبد خرید'
        desc='آیا از حذف این محصول اطمینان دارید؟'
      />

      <div        style={{
            marginTop: `${
              isMobile ? mobileNavHeight  : desktopNavHeight 
            }px`}}
      
      className='max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8'>
        <div className='flex  items-center justify-between mb-4 sm:mb-6'>
          <div

          >
            <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white'>
              سبد خرید
            </h1>

            <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1'>
              {items.length} محصول در سبد خرید شما
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className='flex items-center gap-1.5 sm:gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors text-xs sm:text-sm'
          >
            <FaArrowLeft className='w-3.5 h-3.5 sm:w-4 sm:h-4' />

            <span>ادامه خرید</span>
          </button>
        </div>

        {/* content */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'>
          {/* items */}

          <div className='lg:col-span-2 space-y-3 sm:space-y-4'>
            {items.map(item => (
              <Cartitem
                key={`${item.productId}-${item.variantId}`}
                item={item}
                onUpdateQuantity={updateQ}
                onRemove={handleRemoveRequest}
              />
            ))}
            {address.length < 1 ? (
              <Addressform
                onSubmit={handleAddAddress}
                onCancel={() => setShowAddressForm(false)}
              />
            ) : null}
          </div>

          {/* summary */}
          <div className='lg:col-span-1'>
            <div className='lg:sticky lg:top-4'>
              <Shippingprogress
                subtotal={cartTotal}
                shippingProgress={shippingProgress}
                amountToFreeShipping={amountToFreeShipping}
              />

              <Couponinput
                showCouponInput={showCouponInput}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                couponError={couponError}
                couponMessage={couponMessage}
                discountLabel={discountLabel}
                discount={discount}
                onApply={applyCoupon}
                onRemove={removeCoupon}
                typeDiscount={typeDiscount}
              />
              <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 my-3 sm:p-5'>
                <h3 className='mb-3 text-sm font-bold text-gray-800 dark:text-white'>
                  انتخاب درگاه پرداخت
                </h3>

                <div className='grid grid-cols-3 gap-2 sm:gap-3'>
                  {gateways.map(gateway => {
                    const isSelected = selectedGateway === gateway.id
                    return (
                      <button
                        key={gateway.id}
                        type='button'
                        onClick={() => setSelectedGateway(gateway.id)}
                        aria-pressed={isSelected}
                        className={`relative flex items-center justify-center rounded-xl border px-2 py-3 text-xs sm:text-sm font-semibold transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        {isSelected && (
                          <span className='absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white'>
                            <FaCheck className='w-2 h-2' />
                          </span>
                        )}
                        {gateway.title}
                      </button>
                    )
                  })}
                </div>
              </div>
              <Cartsummary
                items={items}
                subtotal={cartTotal}
                discount={discount}
                discountAmount={discountAmount}
                getShippingCost={getShippingCost}
                formatPrice={formatPrice}
                onCheckout={handleCheckout}
                isLoading={isLoading}
                freeShipping={freeShipping}
                address={address}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
