'use client'
import { useRef, useState, useMemo, useEffect, useEffectEvent } from 'react'

import Herosection from '@/components/modules/products/herosection/Herosection'
import Category from '@/components/modules/products/category/Category'
import Productcard from '@/components/modules/productcard/Productcard'
import Sortdropdown from '@/components/modules/products/sortdropdown/Sortdropdown'
import Filters from '@/components/modules/products/filters/Filters'
import Customfetch from '@/components/utils/CustomeFetch'
import { UseNotification } from '@/components/hooks/UseNotification'
import Cardnotification from '@/components/modules/cardnotification/Cardnotification'
import { FiCheck } from 'react-icons/fi'
import { HiOutlineExclamation } from 'react-icons/hi'
import UsePagination from '@/components/hooks/UsePagination'
import Pagenationadminproduct from '@/components/modules/Admin/pagenationadminproduct/Pagenationadminproduct'
import Filterdrawer from '@/components/modules/products/filterdrawer/Filterdrawer'
import { useSearchParams } from 'next/navigation'

export default function Productswrapper ({
  products = [],
  user,
  categories = []
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('default')
  const searchParams = useSearchParams()

  useEffect(() => {
    const sortFromUrl = searchParams.get('sort')
     if (sortFromUrl) {
      setSortBy(sortFromUrl)
    }
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
        body: JSON.stringify({ productId: normalizedId })
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

    // فیلتر قیمت
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

    // فیلتر دسته‌بندی
    if (filters.categories.length > 0) {
      currentProducts = currentProducts.filter(product => {
        const catId =
          typeof product.category === 'string'
            ? product.category
            : product.category?._id
        return filters.categories.includes(String(catId))
      })
    }

    // فیلتر سایز (از variants)
    if (filters.sizes.length > 0) {
      currentProducts = currentProducts.filter(product =>
        product.variants?.some(variant => filters.sizes.includes(variant.size))
      )
    }

    if (filters.colors.length > 0) {
      currentProducts = currentProducts.filter(product =>
        product.variants?.some(variant =>
          filters.colors.includes(variant.color)
        )
      )
    }

    // جنسیت
    if (filters.gender) {
      currentProducts = currentProducts.filter(p => p.gender === filters.gender)
    }

    // جنس پارچه
    if (filters.materials.length > 0) {
      currentProducts = currentProducts.filter(p =>
        filters.materials.includes(p.material)
      )
    }

    // فقط تخفیف‌دار
    if (filters.onSale) {
      currentProducts = currentProducts.filter(p => Number(p.discount) > 0)
    }

    // مرتب‌سازی
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

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    indexOfFirstItem,
    indexOfLastItem,
    currentItems
  } = UsePagination(sortedAndFilteredProduct, 8)

  useEffect(() => {
    setCurrentPage(1)
  }, [filters, sortBy, setCurrentPage])

  const productSectionRef = useRef(null)
  const prevPageRef = useRef(currentPage)

  useEffect(() => {
    if (prevPageRef.current === currentPage) return

    productSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })

    prevPageRef.current = currentPage
  }, [currentPage])

  useEffect(() => {
    if (isFilterOpen) {
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = 'unset'
    }

    return () => {
      document.documentElement.style.overflow = 'unset'
    }
  }, [isFilterOpen])
  const availableSizes = useMemo(() => {
    const sizeSet = new Set()
    products.forEach(product => {
      product.variants?.forEach(variant => {
        if (variant.size) sizeSet.add(variant.size)
      })
    })
    return Array.from(sizeSet).sort()
  }, [products])

  const availableColors = useMemo(() => {
    const colorSet = new Set()
    products.forEach(product => {
      product.variants?.forEach(variant => {
        if (variant.colorName) colorSet.add(variant.colorName)
      })
    })
    return Array.from(colorSet)
  }, [products])
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
      />

      <Herosection />

      <Cardnotification
        color={notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
        Icon={notification.type === 'success' ? FiCheck : HiOutlineExclamation}
        show={notification.show}
        title={notification.title}
      />

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <Category categories={categories} />

        <div ref={productSectionRef} className='scroll-mt-24'>
          <div className='flex flex-col md:flex-row justify-between items-center mb-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center gap-2 mb-4 md:mb-0'>
              <h2 className='text-xl font-bold text-gray-800 dark:text-white'>
                محصولات
              </h2>
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                ({sortedAndFilteredProduct.length} مورد)
              </span>
            </div>

            <div className='flex gap-3 w-full md:w-auto'>
              <Filters setIsFilterOpen={setIsFilterOpen} filters={filters} />
              <Sortdropdown sortBy={sortBy} setSortBy={setSortBy} />
            </div>
          </div>
        </div>

        <section className='mb-16'>
          {currentItems.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {currentItems.filter(Boolean).map(product => (
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

          {totalPages > 1 && (
            <Pagenationadminproduct
              allProducts={totalItems}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              indexOfFirstProduct={indexOfFirstItem}
              indexOfLastProduct={indexOfLastItem}
              name='محصول'
            />
          )}
        </section>
      </main>
    </div>
  )
}
