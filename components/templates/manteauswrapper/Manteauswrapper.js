'use client'
import { useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaFilter } from 'react-icons/fa'
import Productcard from '@/components/modules/productcard/Productcard'
import Filterdrawer from '@/components/modules/products/filterdrawer/Filterdrawer'
import Sortdropdown from '@/components/modules/products/sortdropdown/Sortdropdown'
import Headercategory from '@/components/modules/headercategory/Headercategory'

// --- داده‌های نمونه اختصاصی برای مانتو ---
const manteausData = [
  {
    id: 1,
    title: 'مانتو کتی بلند مشکی',
    price: '۱,۲۰۰,۰۰۰',
    oldPrice: '۱,۵۰۰,۰۰۰',
    image: '/manteau1.jpg',
    badge: 'پرفروش',
    slug: 'black-long-blazer-manteau'
  },
  {
    id: 2,
    title: 'مانتو اداری کرم',
    price: '۹۸۰,۰۰۰',
    image: '/manteau2.jpg',
    badge: null,
    slug: 'cream-office-manteau'
  },
  {
    id: 3,
    title: 'مانتو اسپرت طرح‌دار',
    price: '۸۵۰,۰۰۰',
    oldPrice: '۹۵۰,۰۰۰',
    image: '/manteau3.jpg',
    badge: 'حراج',
    slug: 'print-sport-manteau'
  },
  {
    id: 4,
    title: 'مانتو مجلسی پاشنه‌دار',
    price: '۱,۸۰۰,۰۰۰',
    image: '/manteau4.jpg',
    badge: 'جدید',
    slug: 'formal-trim-manteau'
  },
  {
    id: 5,
    title: 'مانتو جین آبی',
    price: '۱,۱۰۰,۰۰۰',
    image: '/manteau5.jpg',
    badge: null,
    slug: 'blue-jean-manteau'
  },
  {
    id: 6,
    title: 'مانتو تابستانه لینن',
    price: '۷۵۰,۰۰۰',
    oldPrice: '۸۵۰,۰۰۰',
    image: '/manteau6.jpg',
    badge: 'حراج',
    slug: 'linen-summer-manteau'
  },
  {
    id: 7,
    title: 'مانتو کوتاه پلی‌استر',
    price: '۶۲۰,۰۰۰',
    image: '/manteau7.jpg',
    badge: null,
    slug: 'short-polyester-manteau'
  },
  {
    id: 8,
    title: 'مانتو بلند گل‌دار',
    price: '۱,۳۵۰,۰۰۰',
    image: '/manteau8.jpg',
    badge: 'جدید',
    slug: 'floral-long-manteau'
  },
  {
    id: 9,
    title: 'مانتو چرم مصنوعی',
    price: '۲,۱۰۰,۰۰۰',
    image: '/manteau9.jpg',
    badge: null,
    slug: 'faux-leather-manteau'
  },
  {
    id: 10,
    title: 'مانتو یقه ایستاده',
    price: '۸۹۰,۰۰۰',
    image: '/manteau10.jpg',
    badge: null,
    slug: 'stand-collar-manteau'
  },
  {
    id: 11,
    title: 'مانتو باز طرح‌دار',
    price: '۱,۰۵۰,۰۰۰',
    image: '/manteau11.jpg',
    badge: 'پرفروش',
    slug: 'open-print-manteau'
  },
  {
    id: 12,
    title: 'مانتو پشمی زمستانه',
    price: '۱,۹۰۰,۰۰۰',
    image: '/manteau12.jpg',
    badge: null,
    slug: 'wool-winter-manteau'
  }
]

const productsPerPage = 8

export default function Manteauswrapper () {
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('default')

  // محاسبات صفحه‌بندی
  const totalPages = Math.ceil(manteausData.length / productsPerPage)
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = manteausData.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  )
  const productSectionRef = useRef(null)

  const paginate = pageNumber => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
      productSectionRef.current.scrollIntoView({
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
        title={'فروشگاه مانتو زنانه'}
        desc={
          ' مجموعه‌ای کامل از مانتوهای اداری، مجلسی، اسپرت و تابستانه با دوخت عالی و پارچه‌های درجه یک'
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
              ({manteausData.length} مورد)
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
            ref={productSectionRef}
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
          { id: 1, title: 'مانتو اداری', slug: 'office' },
          { id: 2, title: 'مانتو مجلسی', slug: 'formal' },
          { id: 3, title: 'مانتو اسپرت', slug: 'sport' },
          { id: 4, title: 'مانتو کتی', slug: 'blazer' }
        ]}
      />
    </div>
  )
}
