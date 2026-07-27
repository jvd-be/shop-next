'use client'
import { useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaFilter } from 'react-icons/fa'
import Productcard from '@/components/modules/productcard/Productcard'
import Filterdrawer from '@/components/modules/products/filterdrawer/Filterdrawer'
import Sortdropdown from '@/components/modules/products/sortdropdown/Sortdropdown'
import Headercategory from '@/components/modules/headercategory/Headercategory'

// --- داده‌های نمونه اختصاصی برای دامن ---
const skirtsData = [
  {
    id: 1,
    title: 'دامن فون بلند مشکی',
    price: '۵۸۰,۰۰۰',
    oldPrice: '۷۰۰,۰۰۰',
    image: '/skirt1.jpg',
    badge: 'پرفروش',
    slug: 'black-fun-fishtail-skirt'
  },
  {
    id: 2,
    title: 'دامن کلوش مجلسی',
    price: '۶۵۰,۰۰۰',
    image: '/skirt2.jpg',
    badge: 'جدید',
    slug: 'flared-formal-skirt'
  },
  {
    id: 3,
    title: 'دامن جین کوتاه مینی',
    price: '۴۲۰,۰۰۰',
    image: '/skirt3.jpg',
    badge: null,
    slug: 'denim-mini-skirt'
  },
  {
    id: 4,
    title: 'دامن راسته اداری طوسی',
    price: '۴۹۰,۰۰۰',
    oldPrice: '۵۵۰,۰۰۰',
    image: '/skirt4.jpg',
    badge: 'حراج',
    slug: 'grey-office-straight-skirt'
  },
  {
    id: 5,
    title: 'دامن پف‌دار اسپرت',
    price: '۵۱۰,۰۰۰',
    image: '/skirt5.jpg',
    badge: null,
    slug: 'puffy-sport-skirt'
  },
  {
    id: 6,
    title: 'دامن چین‌دار گل‌دار',
    price: '۳۸۰,۰۰۰',
    oldPrice: '۴۵۰,۰۰۰',
    image: '/skirt6.jpg',
    badge: 'حراج',
    slug: 'floral-ruffle-skirt'
  },
  {
    id: 7,
    title: 'دامن لی فاق‌بلند',
    price: '۶۲۰,۰۰۰',
    image: '/skirt7.jpg',
    badge: 'جدید',
    slug: 'high-waist-jean-skirt'
  },
  {
    id: 8,
    title: 'دامن ساتن بلند',
    price: '۷۵۰,۰۰۰',
    image: '/skirt8.jpg',
    badge: null,
    slug: 'satin-long-skirt'
  },
  {
    id: 9,
    title: 'دامن پلایه‌دار',
    price: '۵۵۰,۰۰۰',
    image: '/skirt9.jpg',
    badge: null,
    slug: 'pleated-skirt'
  },
  {
    id: 10,
    title: 'دامن جین دکلته',
    price: '۴۸۰,۰۰۰',
    image: '/skirt10.jpg',
    badge: 'پرفروش',
    slug: 'cutout-jean-skirt'
  },
  {
    id: 11,
    title: 'دامن چرم مصنوعی',
    price: '۸۹۰,۰۰۰',
    image: '/skirt11.jpg',
    badge: 'جدید',
    slug: 'faux-leather-skirt'
  },
  {
    id: 12,
    title: 'دامن کتی کوتاه',
    price: '۶۱۰,۰۰۰',
    image: '/skirt12.jpg',
    badge: null,
    slug: 'short-blazer-skirt'
  }
]

const productsPerPage = 8

export default function Skirtswrapper () {
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('default')

  // محاسبات صفحه‌بندی
  const totalPages = Math.ceil(skirtsData.length / productsPerPage)
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = skirtsData.slice(
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
        title={'فروشگاه دامن زنانه'}
        desc={
          '  جدیدترین مدل‌های دامن فون، کلوش، راسته و مینی با طرح‌های متنوع و پارچه‌های باکیفیت'
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
              ({skirtsData.length} مورد)
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
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
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
          { id: 1, title: 'دامن فون', slug: 'fishtail' },
          { id: 2, title: 'دامن کلوش', slug: 'flared' },
          { id: 3, title: 'دامن راسته', slug: 'straight' },
          { id: 4, title: 'دامن مینی', slug: 'mini' }
        ]}
      />
    </div>
  )
}
