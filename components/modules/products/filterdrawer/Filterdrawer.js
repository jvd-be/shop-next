'use client'
import React, { useEffect } from 'react'
import { FiX, FiSliders, FiCheck } from 'react-icons/fi'

export default function Filterdrawer({
  isOpen,
  onClose,
  categories = [],
  filters,
  setFilters,
  sizes = [],      // ← از والد پاس داده می‌شود
  colors = [],     // ← از والد پاس داده می‌شود
  materials = [],
  genders = []
}) {
  // بستن با ESC + قفل اسکرول
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = e => {
      if (e.key === 'Escape') onClose?.()
    }

    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.documentElement.style.overflow = prevOverflow
    }
  }, [isOpen, onClose])

  if (!filters) return null

  const activeCount =
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.categories?.length ? 1 : 0) +
    (filters.sizes?.length ? 1 : 0) +
    (filters.colors?.length ? 1 : 0) +
    (filters.gender ? 1 : 0) +
    (filters.materials?.length ? 1 : 0) +
    (filters.onSale ? 1 : 0)

  const toggleCategory = (id) => {
    const categoryId = String(id)
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(x => x !== categoryId)
        : [...prev.categories, categoryId]
    }))
  }

  const toggleSize = (size) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes?.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...(prev.sizes || []), size]
    }))
  }

  const toggleColor = (color) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors?.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...(prev.colors || []), color]
    }))
  }

  const toggleMaterial = (material) => {
    setFilters(prev => ({
      ...prev,
      materials: prev.materials?.includes(material)
        ? prev.materials.filter(m => m !== material)
        : [...(prev.materials || []), material]
    }))
  }

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      categories: [],
      sizes: [],
      colors: [],
      gender: '',
      materials: [],
      onSale: false
    })
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed z-50 inset-x-0 bottom-0 md:right-0 md:left-auto md:top-0 
        w-full md:w-[420px] h-[88vh] md:h-full
        bg-white dark:bg-gray-900 
        rounded-t-3xl md:rounded-none shadow-2xl
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full'}`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
              <FiSliders className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                فیلتر محصولات
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activeCount > 0 ? `${activeCount} فیلتر فعال` : 'همه محصولات'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FiX className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto px-6 py-6 space-y-9 pb-28">
          
          {/* Price Range */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-gray-900 dark:text-white">بازه قیمت (تومان)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">حداقل قیمت</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={e => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                  placeholder="۲۰۰٬۰۰۰"
                  className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">حداکثر قیمت</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={e => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                  placeholder="۲٬۵۰۰٬۰۰۰"
                  className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Gender */}
          {genders.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">جنسیت</h4>
              <div className="flex flex-wrap gap-2">
                {genders.map(g => (
                  <button
                    key={g.value}
                    onClick={() => setFilters(prev => ({ ...prev, gender: prev.gender === g.value ? '' : g.value }))}
                    className={`px-5 py-3 rounded-2xl border text-sm font-medium transition-all ${
                      filters.gender === g.value
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">سایز</h4>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`py-3 rounded-2xl border text-sm font-medium transition-all ${
                      filters.sizes?.includes(size)
                        ? 'bg-black text-white border-black'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {colors.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">رنگ</h4>
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => toggleColor(color)}
                    className={`px-5 py-2.5 rounded-2xl border text-sm transition-all ${
                      filters.colors?.includes(color)
                        ? 'bg-rose-600 text-white'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Materials */}
          {materials.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">جنس پارچه</h4>
              <div className="grid grid-cols-2 gap-2">
                {materials.map(mat => (
                  <button
                    key={mat}
                    onClick={() => toggleMaterial(mat)}
                    className={`px-4 py-3 rounded-2xl border text-sm text-right transition-all ${
                      filters.materials?.includes(mat)
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* On Sale */}
          <div className="flex items-center gap-3 pt-4">
            <input
              type="checkbox"
              id="onSale"
              checked={filters.onSale}
              onChange={e => setFilters(prev => ({ ...prev, onSale: e.target.checked }))}
              className="w-5 h-5 accent-rose-600 cursor-pointer"
            />
            <label htmlFor="onSale" className="font-medium cursor-pointer select-none">
              فقط محصولات تخفیف‌دار
            </label>
          </div>
        </div>

        {/* Footer */}
       <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-5 flex gap-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20">
          <button
            onClick={clearFilters}
            className="flex-1 py-4 text-base font-medium rounded-2xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            پاک کردن همه
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-4 text-base font-semibold rounded-2xl bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-200 transition-all active:scale-[0.985]"
          >
            اعمال فیلترها
          </button>
        </div>
      </aside>
    </>
  )
}