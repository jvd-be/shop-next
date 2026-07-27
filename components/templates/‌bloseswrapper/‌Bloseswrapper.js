'use client'
import { useRef, useState } from 'react'
import {
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaSortAmountDownAlt
} from 'react-icons/fa'
import Productcard from '@/components/modules/productcard/Productcard'
import Filterdrawer from '@/components/modules/products/filterdrawer/Filterdrawer'
import Sortdropdown from '@/components/modules/products/sortdropdown/Sortdropdown'
import Headercategory from '@/components/modules/headercategory/Headercategory'

// --- داده‌های نمونه اختصاصی برای بلوزها ---
const blousesData = [
  {
    id: 1,
    title: 'شومیز آستین بلند طرح‌دار',
    price: '۶۵۰,۰۰۰',
    oldPrice: '۸۰۰,۰۰۰',
    image: '/blouse1.jpg', // آدرس تصویر خود را جایگزین کنید
    badge: 'حراج',
    slug: 'print-blouse-1'
  },
  {
    id: 2,
    title: 'بلوز حریر مجلسی مشکی',
    price: '۵۴۰,۰۰۰',
    image: '/blouse2.jpg',
    badge: 'جدید',
    slug: 'silk-blouse-black'
  },
  {
    id: 3,
    title: 'شومیز سفید یقه‌دار اداری',
    price: '۴۸۰,۰۰۰',
    oldPrice: '۵۵۰,۰۰۰',
    image: '/blouse3.jpg',
    badge: 'پرفروش',
    slug: 'office-white-blouse'
  },
  {
    id: 4,
    title: 'بلوز توری دخترانه رنگی',
    price: '۳۲۰,۰۰۰',
    image: '/blouse4.jpg',
    badge: null,
    slug: 'tulle-girl-blouse'
  },
  {
    id: 5,
    title: 'شومیز آستین کوتاه طرح‌دار',
    price: '۵۹۰,۰۰۰',
    image: '/blouse5.jpg',
    badge: null,
    slug: 'short-sleeve-print'
  },
  {
    id: 6,
    title: 'بلوز کتان تابستانه',
    price: '۴۱۰,۰۰۰',
    oldPrice: '۴۵۰,۰۰۰',
    image: '/blouse6.jpg',
    badge: 'حراج',
    slug: 'cotton-summer-blouse'
  },
  {
    id: 7,
    title: 'شومیز یقه هفت پارچه‌ای',
    price: '۵۲۰,۰۰۰',
    image: '/blouse7.jpg',
    badge: 'جدید',
    slug: 'v-neck-fabric-blouse'
  },
  {
    id: 8,
    title: 'بلوز لیوانی مجلسی',
    price: '۶۸۰,۰۰۰',
    image: '/blouse8.jpg',
    badge: null,
    slug: 'cup-blouse-formal'
  },
  // محصولات بیشتر برای تست صفحه‌بندی
  {
    id: 9,
    title: 'شومیز آستین‌بلند طوسی',
    price: '۵۵۰,۰۰۰',
    image: '/blouse9.jpg',
    badge: null,
    slug: 'grey-blouse'
  },
  {
    id: 10,
    title: 'بلوز اسپرت نخی',
    price: '۲۹۰,۰۰۰',
    image: '/blouse10.jpg',
    badge: null,
    slug: 'cotton-sport-blouse'
  },
  {
    id: 11,
    title: 'شومیز حریر آبی',
    price: '۶۱۰,۰۰۰',
    image: '/blouse11.jpg',
    badge: 'جدید',
    slug: 'blue-silk-blouse'
  },
  {
    id: 12,
    title: 'بلوز کوتاه کراپ',
    price: '۳۸۰,۰۰۰',
    image: '/blouse12.jpg',
    badge: null,
    slug: 'crop-top-blouse'
  }
]

const productsPerPage = 8

export default function Blouseswrapper () {
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('default')

  // محاسبات صفحه‌بندی
  const totalPages = Math.ceil(blousesData.length / productsPerPage)
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = blousesData.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  )
  const ProductSectionRef = useRef(null)
  const paginate = pageNumber => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
      // اسکرول به بالای بخش محصولات (می‌توانید از useRef برای اسکرول نرم‌تر استفاده کنید)
      ProductSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <div
      className='min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300'
      dir='rtl'
    >
      {/* هدر اختصاصی دسته‌بندی */}
      <Headercategory
        title={'فروشگاه بلوز و شومیز زنانه'}
        desc={
          'جدیدترین مدل‌های شومیز، بلوز مجلسی و اسپرت با بهترین کیفیت و قیمت'
        }
      />

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* نوار فیلتر و مرتب‌سازی */}
        <div className='flex flex-col md:flex-row justify-between items-center mb-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-2 mb-4 md:mb-0'>
            <h2 className='text-xl font-bold text-gray-800 dark:text-white'>
              محصولات
            </h2>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              ({blousesData.length} مورد)
            </span>
          </div>

          <div className='flex gap-3 w-full md:w-auto'>
            {/* دکمه فیلتر */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className='flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm'
            >
              <FaFilter />
              <span>فیلتر</span>
            </button>

            {/* دراپ‌داون مرتب‌سازی */}
            <div className='relative'>
              <Sortdropdown sortBy={sortBy} setSortBy={setSortBy} />
            </div>
          </div>
        </div>

        {/* لیست محصولات */}
        {currentProducts.length > 0 ? (
          <div
            ref={ProductSectionRef}
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'
          >
            {currentProducts.map(product => (
              <Productcard
                key={product.id}
                image={product.image}
                oldPrice={product.oldPrice}
                title={product.title}
                price={product.price}
                slug={product.slug}
                badge={product.badge}
              />
            ))}
          </div>
        ) : (
          <div className='text-center py-20'>
            <p className='text-xl text-gray-500'>
              محصولی در این دسته‌بندی یافت نشد.
            </p>
          </div>
        )}

        {/* صفحه‌بندی */}
        {totalPages > 1 && (
          <div className='flex justify-center items-center gap-2 mt-8 mb-16'>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className='p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              <FaChevronLeft />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-colors ${
                  currentPage === number
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                }`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </main>

      {/* کامپوننت کشوی فیلتر */}
      <Filterdrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={[
          { id: 1, title: 'بلوز آستین بلند', slug: 'long-sleeve' },
          { id: 2, title: 'بلوز آستین کوتاه', slug: 'short-sleeve' },
          { id: 3, title: 'شومیز مجلسی', slug: 'formal' },
          { id: 4, title: 'بلوز اسپرت', slug: 'sport' }
        ]}
      />
    </div>
  )
}
