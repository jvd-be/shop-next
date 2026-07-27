'use client'
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2'

export default function Filters({ setIsFilterOpen, filters }) {
  const activeFiltersCount =
    (filters?.minPrice ? 1 : 0) +
    (filters?.maxPrice ? 1 : 0) +
    (filters?.categories?.length ? 1 : 0) +
    (filters?.sizes?.length ? 1 : 0) +
    (filters?.colors?.length ? 1 : 0) +
    (filters?.gender ? 1 : 0) +
    (filters?.materials?.length ? 1 : 0) +
    (filters?.onSale ? 1 : 0)

  const hasActiveFilter = activeFiltersCount > 0

  return (
    <button
      type="button"
      onClick={() => setIsFilterOpen(true)}
      className={`group inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl border transition-all duration-300 w-full md:w-auto font-medium
        ${hasActiveFilter 
          ? 'bg-rose-50 border-rose-500 text-rose-600 dark:bg-rose-950/30 dark:border-rose-500 dark:text-rose-400' 
          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
    >
      <HiOutlineAdjustmentsHorizontal 
        className={`h-5 w-5 transition-transform ${hasActiveFilter ? 'rotate-12' : 'group-hover:rotate-12'}`} 
      />
      
      <span>فیلترها</span>

      {/* Badge فعال بودن فیلتر */}
      {hasActiveFilter && (
        <div className="ml-1 bg-rose-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full min-w-[20px] h-[20px] flex items-center justify-center">
          {activeFiltersCount}
        </div>
      )}

      {/* Optional: Text when active */}
      {hasActiveFilter && (
        <span className="text-xs text-rose-500 dark:text-rose-400 font-medium hidden sm:inline">
          فعال
        </span>
      )}
    </button>
  )
}