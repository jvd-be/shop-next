import React from 'react'
import { FaTimes,FaCheck } from 'react-icons/fa'
export default function Modalcategories({closeModal,formData,editingCategory,handleInputChange,handleSave,categories}) {
  return (
   <div className='fixed inset-0 bg-neutral-900/80  flex items-center justify-center z-50 p-4'>
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 relative'>
              <button
                onClick={closeModal}
                className='absolute top-4 left-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              >
                <FaTimes size={20} />
              </button>

              <h3 className='text-xl font-bold mb-4 text-gray-800 dark:text-white pr-6'>
                {editingCategory
                  ? 'ویرایش دسته‌بندی پوشاک'
                  : 'افزودن دسته‌بندی جدید'}
              </h3>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    نام فارسی *
                  </label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none'
                    placeholder='مثال: پوشاک زنانه'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    نام انگلیسی (Slug) *
                  </label>
                  <input
                    type='text'
                    name='slug'
                    value={formData.slug}
                    onChange={handleInputChange}
                    className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono'
                    placeholder='مثال: womens-wear'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    دسته والد (اختیاری)
                  </label>
                  <select
                    name='parentId'
                    value={formData.parentId}
                    onChange={handleInputChange}
                    className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none'
                  >
                    <option value=''>بدون والد (دسته اصلی)</option>
                    {categories
                      .filter(c => c.id !== editingCategory?.id)
                      .map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    وضعیت
                  </label>
                  <div className='flex gap-4'>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='radio'
                        name='status'
                        value='فعال'
                        checked={formData.status === 'فعال'}
                        onChange={handleInputChange}
                        className='text-blue-600 focus:ring-blue-500'
                      />
                      <span className='text-gray-700 dark:text-gray-300'>
                        فعال
                      </span>
                    </label>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='radio'
                        name='status'
                        value='غیرفعال'
                        checked={formData.status === 'غیرفعال'}
                        onChange={handleInputChange}
                        className='text-blue-600 focus:ring-blue-500'
                      />
                      <span className='text-gray-700 dark:text-gray-300'>
                        غیرفعال
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className='flex justify-end gap-3 mt-6'>
                <button
                  onClick={closeModal}
                  className='px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
                >
                  انصراف
                </button>
                <button
                  onClick={handleSave}
                  className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2'
                >
                  <FaCheck />
                  {editingCategory ? 'ذخیره تغییرات' : 'افزودن دسته‌بندی'}
                </button>
              </div>
            </div>
          </div>
  )
}
