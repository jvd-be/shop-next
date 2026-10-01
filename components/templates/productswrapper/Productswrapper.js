'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Herosection from '@/components/modules/products/herosection/Herosection'
import Productcard from '@/components/modules/productcard/Productcard'
import Sortdropdown from '@/components/modules/products/sortdropdown/Sortdropdown'
import Filters from '@/components/modules/products/filters/Filters'
import Customfetch from '@/components/utils/CustomeFetch'
import { UseNotification } from '@/components/hooks/UseNotification'
import Cardnotification from '@/components/modules/cardnotification/Cardnotification'
import { FiCheck } from 'react-icons/fi'
import { HiOutlineExclamation } from 'react-icons/hi'
import Filterdrawer from '@/components/modules/products/filterdrawer/Filterdrawer'
import Pagenationbackendproduct from '@/components/modules/Admin/pagenationbackendproduct/pagenationBackendproduct'
import { useDevice } from '@/components/utils/helper'
import { useHeight } from '@/components/utils/navHeightContext'

export default function Productswrapper ({
  products = [],
  user,
  categories = [],
  totalProducts = 0,
  totalPages = 1
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('default')

  const searchParams = useSearchParams()

  const productSectionRef = useRef(null)

  const currentPage = Math.max(1, Number(searchParams.get('page')) || 1)

  useEffect(() => {
    const sortFromUrl = searchParams.get('sort')

    setSortBy(sortFromUrl || 'default')
  }, [searchParams])

  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    categories: [],
    sizes: [],
    colors: [],
    gender: '',
    materials: [],
    onSale: false
  })

  useEffect(() => {
    const filterFromUrl = searchParams.get('category')

    if (filterFromUrl) {
      setFilters(prev => ({
        ...prev,
        categories: [filterFromUrl]
      }))
    } else {
      setFilters(prev => ({
        ...prev,
        categories: []
      }))
    }
  }, [searchParams])

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

  const { showNotification, notification } = UseNotification()

  const toggleWishlist = async productId => {
    const normalizedId = String(productId)

    try {
      const response = await Customfetch('/api/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: normalizedId
        })
      })

      if (response.ok) {
        const data = await response.json()

        setWishlist(prev =>
          prev.includes(normalizedId)
            ? prev.filter(id => id !== normalizedId)
            : [...prev, normalizedId]
        )

        showNotification('success', data.message)
      } else {
        showNotification('error', 'مشکلی پیش آمد لطفا بعدا تلاش کنید.')
      }
    } catch (error) {
      showNotification('error', 'مشکلی پیش آمد لطفا بعدا تلاش کنید.')
    }
  }

  const sortedAndFilteredProduct = useMemo(() => {
    let currentProducts = [...(products || [])]

    if (filters.minPrice) {
      currentProducts = currentProducts.filter(
        p => Number(p.price) >= Number(filters.minPrice)
      )
    }

    if (filters.maxPrice) {
      currentProducts = currentProducts.filter(
        p => Number(p.price) <= Number(filters.maxPrice)
      )
    }

    if (filters.categories.length > 0) {
      currentProducts = currentProducts.filter(product => {
        const catId =
          typeof product.category === 'string'
            ? product.category
            : product.category?.slug

        return filters.categories.includes(String(catId))
      })
    }

    if (filters.sizes.length > 0) {
      currentProducts = currentProducts.filter(product =>
        product.variants?.some(variant => filters.sizes.includes(variant.size))
      )
    }

    if (filters.colors.length > 0) {
      currentProducts = currentProducts.filter(product =>
        product.variants?.some(variant =>
          filters.colors.includes(variant.colorName)
        )
      )
    }

    if (filters.gender) {
      currentProducts = currentProducts.filter(p => p.gender === filters.gender)
    }

    if (filters.materials.length > 0) {
      currentProducts = currentProducts.filter(p =>
        filters.materials.includes(p.material)
      )
    }

    if (filters.onSale) {
      currentProducts = currentProducts.filter(p => Number(p.discount) > 0)
    }

    if (sortBy === 'price-asc') {
      currentProducts.sort((a, b) => Number(a.price) - Number(b.price))
    } else if (sortBy === 'price-desc') {
      currentProducts.sort((a, b) => Number(b.price) - Number(a.price))
    } else if (sortBy === 'newest') {
      currentProducts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    } else if (sortBy === 'best-discount') {
      currentProducts.sort((a, b) => Number(b.discount) - Number(a.discount))
    } else if (sortBy === 'best-sales') {
      currentProducts.sort((a, b) => Number(b.soldCount) - Number(a.soldCount))
    }

    return currentProducts
  }, [products, filters, sortBy])

  useEffect(() => {
    if (currentPage === 1) return

    productSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }, [currentPage])

  useEffect(() => {
    document.documentElement.style.overflow = isFilterOpen ? 'hidden' : 'unset'

    return () => {
      document.documentElement.style.overflow = 'unset'
    }
  }, [isFilterOpen])

  const availableSizes = useMemo(() => {
    const sizeSet = new Set()

    products.forEach(product => {
      product.variants?.forEach(variant => {
        if (variant.size) {
          sizeSet.add(variant.size)
        }
      })
    })

    return Array.from(sizeSet).sort()
  }, [products])

  const availableColors = useMemo(() => {
    const colorSet = new Set()

    products.forEach(product => {
      product.variants?.forEach(variant => {
        if (variant.colorName) {
          colorSet.add(variant.colorName)
        }
      })
    })

    return Array.from(colorSet)
  }, [products])

  const availableCategory = useMemo(() => {
    const map = new Map()

    products.forEach(product => {
      if (product.category) {
        map.set(product.category._id, product.category)
      }
    })

    return Array.from(map.values())
  }, [products])

  const isMobile = useDevice()
  const { mobileNavHeight, desktopNavHeight } = useHeight()
  return (
    <div

      className='min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100'
      dir='rtl'
    >
      <Filterdrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories}
        filters={filters}
        setFilters={setFilters}
        sizes={availableSizes}
        colors={availableColors}
        availableCategory={availableCategory}
      />

      <Herosection marginT={isMobile ? mobileNavHeight : desktopNavHeight} />

      <Cardnotification
        color={notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
        Icon={notification.type === 'success' ? FiCheck : HiOutlineExclamation}
        show={notification.show}
        title={notification.title}
      />

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div ref={productSectionRef} className='scroll-mt-24'>
          <div className='flex flex-col md:flex-row justify-between items-center mb-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center gap-2 mb-4 md:mb-0'>
              <h2 className='text-xl font-bold text-gray-800 dark:text-white'>
                محصولات
              </h2>

              <span className='text-sm text-gray-500 dark:text-gray-400'>
                ({totalProducts} مورد)
              </span>
            </div>

            <div className='flex gap-3 w-full md:w-auto'>
              <Filters setIsFilterOpen={setIsFilterOpen} filters={filters} />

              <Sortdropdown sortBy={sortBy} setSortBy={setSortBy} />
            </div>
          </div>
        </div>

        <section className='mb-16'>
          {/* Products */}

          {sortedAndFilteredProduct.length > 0 ? (
            <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {sortedAndFilteredProduct.filter(Boolean).map(product => (
                <Productcard
                  key={product._id}
                  product={product}
                  onToggleWishlist={toggleWishlist}
                  isWishlisted={wishlist.includes(String(product._id))}
                />
              ))}
            </div>
          ) : (
            <div className='text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700'>
              <p className='text-gray-500'>هیچ محصولی در این بخش یافت نشد.</p>
            </div>
          )}

          <Pagenationbackendproduct
            allProducts={totalProducts}
            totalPages={totalPages}
            currentPage={currentPage}
            limit={8}
            name='محصول'
            title='products'
          />
        </section>
      </main>
    </div>
  )
}
