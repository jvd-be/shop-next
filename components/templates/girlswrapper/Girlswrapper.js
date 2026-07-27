'use client'
import { useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaFilter } from 'react-icons/fa'
import Productcard from '@/components/modules/productcard/Productcard'
import Filterdrawer from '@/components/modules/products/filterdrawer/Filterdrawer'
import Sortdropdown from '@/components/modules/products/sortdropdown/Sortdropdown'
import Headercategory from '@/components/modules/headercategory/Headercategory'

// --- داده‌های نمونه اختصاصی برای لباس دخترانه ---
const girlsClothingData = [
  {
    id: 1,
    title: 'پیراهن گلدار تابستانه دخترانه',
    price: '۴۵۰,۰۰۰',
    oldPrice: '۵۵۰,۰۰۰',
    image: '/girls-dress1.jpg',
    badge: 'حراج',
    slug: 'floral-summer-dress'
  },
  {
    id: 2,
    title: 'ست تیشرت و شلوار جین',
    price: '۶۸۰,۰۰۰',
    image: '/girls-set1.jpg',
    badge: 'جدید',
    slug: 'tshirt-jeans-set'
  },
  {
    id: 3,
    title: 'بلوز دخترانه طرح پرنسس',
    price: '۳۲۰,۰۰۰',
    image: '/girls-blouse1.jpg',
    badge: null,
    slug: 'princess-blouse'
  },
  {
    id: 4,
    title: 'شلوار لی دخترانه اسپرت',
    price: '۴۱۰,۰۰۰',
    oldPrice: '۴۸۰,۰۰۰',
    image: '/girls-jeans1.jpg',
    badge: 'پرفروش',
    slug: 'sport-girls-jeans'
  },
  {
    id: 5,
    title: 'پیراهن مجلسی توری',
    price: '۸۵۰,۰۰۰',
    image: '/girls-formal1.jpg',
    badge: null,
    slug: 'tulle-formal-dress'
  },
  {
    id: 6,
    title: 'هودی دخترانه رنگی',
    price: '۵۹۰,۰۰۰',
    image: '/girls-hoodie1.jpg',
    badge: 'جدید',
    slug: 'colorful-girls-hoodie'
  },
  {
    id: 7,
    title: 'دامن چین‌دار دخترانه',
    price: '۳۸۰,۰۰۰',
    image: '/girls-skirt1.jpg',
    badge: null,
    slug: 'ruffled-girls-skirt'
  },
  {
    id: 8,
    title: 'بلوز یقه اسکی دخترانه',
    price: '۲۹۰,۰۰۰',
    oldPrice: '۳۵۰,۰۰۰',
    image: '/girls-turtleneck1.jpg',
    badge: 'حراج',
    slug: 'turtleneck-girls-blouse'
  },
  { id: 9, title: 'کاپشن دخترانه گرم', price: '۹۲۰,۰۰۰', image: '/girls-jacket1.jpg', badge: null, slug: 'warm-girls-jacket' },
  { id: 10, title: 'شال و کلاه بافتنی', price: '۲۵۰,۰۰۰', image: '/girls-scarf1.jpg', badge: null, slug: 'knit-scarf-hat' },
  { id: 11, title: 'پیراهن کلاسیک سفید', price: '۴۲۰,۰۰۰', image: '/girls-classic1.jpg', badge: 'جدید', slug: 'classic-white-dress' },
  { id: 12, title: 'شلوار پارچه‌ای گشاد', price: '۳۴۰,۰۰۰', image: '/girls-widepants1.jpg', badge: null, slug: 'wide-leg-girls-pants' },
]

const productsPerPage = 8

export default function Girlswrapper() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('default')

  // محاسبات صفحه‌بندی
  const totalPages = Math.ceil(girlsClothingData.length / productsPerPage)
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = girlsClothingData.slice(indexOfFirstProduct, indexOfLastProduct)
  const productSectionRef=useRef(null)
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
      productSectionRef.current.scrollIntoView({behavior:"smooth",block:"start"})
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300" dir="rtl">
      
      {/* هدر اختصاصی دسته‌بندی */}

      <Headercategory title={'پوشاک دخترانه'} desc={' جدیدترین مدل‌های لباس، پیراهن، ست و اکسسوری برای دختران با طراحی‌های شاد و رنگارنگ'}/>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* نوار فیلتر و مرتب‌سازی */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              محصولات
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({girlsClothingData.length} مورد)
            </span>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {/* دکمه فیلتر */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
            >
              <FaFilter />
              <span>فیلتر</span>
            </button>

            {/* دراپ‌داون مرتب‌سازی */}
            <div className="relative">
              <Sortdropdown sortBy={sortBy} setSortBy={setSortBy} />
            </div>
          </div>
        </div>

        {/* لیست محصولات */}
        {currentProducts.length > 0 ? (
          <div ref={productSectionRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {currentProducts.map((product) => (
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
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">محصولی در این دسته‌بندی یافت نشد.</p>
          </div>
        )}

        {/* صفحه‌بندی */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 mb-16">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaChevronLeft />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
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
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
          { id: 1, title: 'پیراهن', slug: 'dresses' },
          { id: 2, title: 'شلوار و جین', slug: 'pants' },
          { id: 3, title: 'ست لباس', slug: 'sets' },
          { id: 4, title: 'اکسسوری', slug: 'accessories' },
        ]}
      />
    </div>
  )
}