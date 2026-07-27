'use client'

import { useEffect, useMemo, useState } from 'react'
import Gallery from '@/components/modules/gallery/Gallery'
import Tabssection from '@/components/templates/tabssection/Tabssection'
import Sizeguide from '@/components/modules/sizeguide/Sizeguide'
import Desktopheader from '@/components/modules/desktopheader/Desktopheader'
import Mobileheader from '@/components/modules/mobileheader/Mobileheader'
import { FaCheck } from 'react-icons/fa'
import Selectcolors from '@/components/modules/selectcolors/Selectcolors'
import Selectsize from '@/components/modules/selectsize/Selectsize'
import Quickinfo from '@/components/modules/quickinfo/Quickinfo'
import Pricewidget from '@/components/modules/pricewdget/Pricewidget'
import Quantity from '@/components/modules/quantity/Quantity'
import Cartnotification from '@/components/modules/cardnotification/Cardnotification'
import Addwishlistheaderdesktop from '@/components/modules/addwishlistheaderdesktop/Addwishlistheaderdesktop'
import Btnaddtocart from '@/components/modules/btnaddtocart/Btnaddtocart'
import { UseNotification } from '@/components/hooks/UseNotification'
import { FiCheck } from 'react-icons/fi'
import { HiOutlineExclamation } from 'react-icons/hi'
import { useCart } from '@/components/utils/CartContext'

const sizeGuide = {
  header: ['سایز', 'دور سینه', 'قد لباس', 'دور کمر'],
  rows: [
    { size: 'S', chest: '۹۲-۹۶', length: '۶۸', waist: '۸۲-۸۶' },
    { size: 'M', chest: '۹۶-۱۰۰', length: '۷۰', waist: '۸۶-۹۰' },
    { size: 'L', chest: '۱۰۰-۱۰۴', length: '۷۲', waist: '۹۰-۹۴' },
    { size: 'XL', chest: '۱۰۴-۱۰۸', length: '۷۴', waist: '۹۴-۹۸' },
    { size: 'XXL', chest: '۱۰۸-۱۱۲', length: '۷۶', waist: '۹۸-۱۰۲' }
  ]
}

export default function Productpagewrapper ({ product, isWishListed, user,review }) {
  const categoryName = product?.category?.name || 'بدون دسته‌بندی'

  const { showNotification, notification } = UseNotification()

  const { addToCart } = useCart()

  const [selectedSize, setSelectedSize] = useState(null)

  const [quantity, setQuantity] = useState(1)

  const [showSizeGuide, setShowSizeGuide] = useState(false)

  const [showCartNotification, setShowCartNotification] = useState(false)

  const [isAddedToCart, setIsAddedToCart] = useState(false)

  const [sizeError, setSizeError] = useState(false)

  const [reviews, setReviews] = useState(review|| [])

  const [isWishlist, setIsWishlist] = useState(
    Array.isArray(isWishListed)
      ? isWishListed.some(item => String(item._id) === String(product._id))
      : false
  )

  // فقط variant های موجود
  const availableVariants = useMemo(() => {
    return product?.variants?.filter(variant => variant.quantity > 0) || []
  }, [product?.variants])

  // رنگ‌های موجود
  const colors = useMemo(() => {
    return Array.from(
      new Map(
        availableVariants.map(variant => [
          variant.color,
          {
            color: variant.color,
            colorName: variant.colorName
          }
        ])
      ).values()
    )
  }, [availableVariants])

  const [selectedColor, setSelectedColor] = useState(colors[0] || null)

  // سایزهای رنگ انتخاب‌شده
  const sizes = useMemo(() => {
    if (!selectedColor) return []

    return [
      ...new Set(
        availableVariants
          .filter(variant => variant.color === selectedColor.color)
          .map(variant => variant.size)
      )
    ]
  }, [availableVariants, selectedColor])

  // variant انتخابی
  const selectedVariant = useMemo(() => {
    if (!selectedColor || !selectedSize) {
      return null
    }

    return (
      availableVariants.find(
        variant =>
          variant.color === selectedColor.color && variant.size === selectedSize
      ) || null
    )
  }, [availableVariants, selectedColor, selectedSize])

  const quantityPerSize = selectedVariant?.quantity ?? 0

  // reset هنگام تغییر محصول
  useEffect(() => {
    setSelectedColor(colors[0] || null)
    setSelectedSize(null)
    setQuantity(1)
  }, [product?._id, colors])

  // انتخاب خودکار سایز
  useEffect(() => {
    if (!selectedSize && sizes.length > 0) {
      setSelectedSize(sizes[0])
    } else if (selectedSize && !sizes.includes(selectedSize)) {
      setSelectedSize(null)
    }
  }, [sizes, selectedSize])

  // کنترل quantity
  useEffect(() => {
    if (!selectedVariant) {
      setQuantity(1)
      return
    }

    if (quantity > quantityPerSize) {
      setQuantity(quantityPerSize)
    }

    if (quantity < 1 && quantityPerSize > 0) {
      setQuantity(1)
    }
  }, [selectedVariant, quantityPerSize, quantity])

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true)

      setTimeout(() => {
        setSizeError(false)
      }, 3000)

      return
    }

    if (!selectedVariant || quantityPerSize <= 0) {
      showNotification('error', 'این سایز موجود نیست')
      return
    }

    if (quantity <= 0 || quantity > quantityPerSize) {
      showNotification('error', 'تعداد انتخابی نامعتبر است')
      return
    }

    addToCart({
      product,
      selectedVariant,
      qty: quantity
    })

    setIsAddedToCart(true)
    setShowCartNotification(true)

    setTimeout(() => {
      setShowCartNotification(false)
    }, 3000)

    setTimeout(() => {
      setIsAddedToCart(false)
    }, 2000)
  }

  const addToWishList = async () => {
    try {
      const response = await fetch('/api/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: String(product._id)
        })
      })

      const data = await response.json()

      if (response.ok) {
        setIsWishlist(true)

        showNotification('success', data.message)
      } else {
        showNotification('error', data.message)
      }
    } catch (error) {
      console.error(error)

      showNotification('error', 'خطا در ارتباط با سرور')
    }
  }

  const tabs = [
    {
      id: 'description',
      label: 'توضیحات'
    },

    {
      id: 'reviews',
      label: `نظرات (${reviews.length})`
    }
  ]

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
      <Cartnotification
        show={showCartNotification}
        title='محصول به سبد خرید اضافه شد!'
        Icon={FaCheck}
        color='bg-green-500'
      />

      <Cartnotification
        title={notification.title}
        color={notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
        Icon={notification.type === 'success' ? FiCheck : HiOutlineExclamation}
        show={notification.show}
      />

      {showSizeGuide && (
        <Sizeguide sizeGuide={sizeGuide} setShowSizeGuide={setShowSizeGuide} />
      )}

      <Mobileheader
        isWishlist={isWishlist}
        addToWishList={addToWishList}
        name={product.title}
        category={categoryName}
      />

      <Desktopheader name={product.title} category={categoryName} />

      <main className='max-w-7xl mx-auto px-4 py-4 lg:py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12'>
          <Gallery images={product.images} />

          <div className='space-y-5 lg:space-y-6'>
            <Addwishlistheaderdesktop
              isWishlist={isWishlist}
              id={product._id}
              addToWishList={addToWishList}
            />

            <div>
              <h1 className='text-xl lg:text-2xl font-bold text-gray-900 dark:text-white'>
                {product.title}
              </h1>

              <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                کد محصول: {product._id}
              </p>
            </div>

            <Pricewidget
              price={product.finalPrice}
              oldPrice={product.price}
              discount={product.discount}
            />

            <Selectcolors
              colors={colors}
              selectedColor={selectedColor}
              setSelectedColor={color => {
                setSelectedColor(color)
                setSelectedSize(null)
              }}
            />

            <Selectsize
              sizes={sizes}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              sizeError={sizeError}
              setSizeError={setSizeError}
              setShowSizeGuide={setShowSizeGuide}
            />

            <Quantity
              quantityPerSize={quantityPerSize}
              quantity={quantity}
              setQuantity={setQuantity}
            />

            <Btnaddtocart
              handleAddToCart={handleAddToCart}
              isAddedToCart={isAddedToCart}
            />

            <Quickinfo />
          </div>
        </div>

        <Tabssection
          tabs={tabs}
          user={user}
          description={product.description}
          product={product}
          reviews={reviews}
          setReviews={setReviews}
        />
      </main>
    </div>
  )
}
