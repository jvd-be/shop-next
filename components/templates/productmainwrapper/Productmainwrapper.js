'use client'
import { UseNotification } from '@/components/hooks/UseNotification'
import Cardnotification from '@/components/modules/cardnotification/Cardnotification'
import Productcard from '@/components/modules/productcard/Productcard'
import Sliderblogmain from '@/components/modules/sliderblogmain/Sliderblogmain'
import Sliderproductmain from '@/components/modules/sliderproductmain/Sliderproductmain'
import { useCart } from '@/components/utils/CartContext'
import React, { useEffect, useMemo, useState } from 'react'
import { FiCheck } from 'react-icons/fi'
import { HiOutlineExclamation } from 'react-icons/hi'

export default function Productmainwrapper ({
  lastProducts = [],
  bestsellersProducts = [],
  hugeDiscountsProduct = [],
  lastblogs = [],
  user = null
}) {
  const { showNotification, notification } = UseNotification()

  const initialWishlistIds = useMemo(() => {
    const list = user?.wishlist || []
    return list.map(item =>
      typeof item === 'string' ? item : String(item._id)
    )
  }, [user])

  const [wishlist, setWishlist] = useState(initialWishlistIds)

  useEffect(() => {
    setWishlist(initialWishlistIds)
  }, [initialWishlistIds])

  const toggleWishlist = async productId => {
    try {
      const response = await fetch('/api/wishlist/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })

      const data = await response.json()

      if (!response.ok) {
        showNotification(
          'error',
          data?.message || 'مشکلی پیش آمد لطفا بعدا تلاش کنید.'
        )
        return
      }

      setWishlist((data.wishlist || []).map(String))
      showNotification('success', data.message)
    } catch (error) {
      console.error(error)
      showNotification('error', 'مشکلی پیش آمد لطفا بعدا تلاش کنید.')
    }
  }
  const { addToCart } = useCart()

  const handleAddToCart = product => {
    const variant = product?.variants?.find(v => v.quantity > 0)

    if (!variant) {
      showNotification('error', 'این محصول موجود نیست!')
      return
    }

    addToCart({
      product,
      selectedVariant: variant,
      qty: 1
    })

    showNotification('success', 'به سبد خرید اضافه شد!')
  }

  return (
    <>
      <Sliderproductmain
        titlecolor={' جدیدترین '}
        products={lastProducts}
        toggleWishlist={toggleWishlist}
        handleAddToCart={handleAddToCart}
        wishlist={wishlist}
        href={'/products?sort=newest'}
      />
      <Sliderproductmain
        titlecolor={' پرفروش ترین '}
        products={bestsellersProducts}
        toggleWishlist={toggleWishlist}
        handleAddToCart={handleAddToCart}
        wishlist={wishlist}
        href={'/products?sort=best-sales'}
      />
      <Sliderproductmain
        titlecolor={' پرتخفیف ترین  '}
        products={hugeDiscountsProduct}
        toggleWishlist={toggleWishlist}
        handleAddToCart={handleAddToCart}
        wishlist={wishlist}
        href={'/products?sort=best-discount'}
      />
      <Sliderblogmain titlecolor={' اخرین مقاله '} blogs={lastblogs} />
      <div className='mt-8 mb-28 md:mb-0 w-11/12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 justify-center mx-auto'>
        <Cardnotification
          color={
            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }
          Icon={
            notification.type === 'success' ? FiCheck : HiOutlineExclamation
          }
          show={notification.show}
          title={notification.title}
        />
      </div>
    </>
  )
}
