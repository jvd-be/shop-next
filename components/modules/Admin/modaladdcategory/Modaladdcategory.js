import React from 'react'

export default function Modaladdcategory ({
  formData,
  handleAddSubmit,
  handleInputChange,
  categories,
  isEdit,
  onClose
}) {
  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl p-6'>
        <h2 className='text-lg font-bold mb-4'>
          {isEdit ? 'ویرایش دسته بندی' : 'افزودن دسته بندی'}
        </h2>

        <form onSubmit={handleAddSubmit} className='space-y-4'>
          <input
            type='text'
            name='name'
            placeholder='نام دسته'
            value={formData.name ?? ''}
            onChange={handleInputChange}
            className='w-full border p-2 rounded'
            required
          />

          <input
            type='text'
            name='slug'
            placeholder='slug'
            value={formData.slug ?? ''}
            onChange={handleInputChange}
            className='w-full border p-2 rounded'
            required
          />

          <input
            type='number'
            name='order'
            placeholder='ترتیب نمایش'
            value={formData.order ?? 0}
            onChange={handleInputChange}
            className='w-full border p-2 rounded'
            required
          />

          <input
            type='file'
            name='image'
            accept='image/*'
            onChange={handleInputChange}
            className='w-full border p-2 rounded'
          />

          <select
            name='parent'
            value={formData.parent ?? ''}
            onChange={handleInputChange}
            className='w-full border p-2 rounded'
          >
            <option value=''>بدون والد</option>

            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <textarea
            name='description'
            placeholder='توضیحات'
            value={formData.description ?? ''}
            onChange={handleInputChange}
            className='w-full border p-2 rounded'
          />

          <label className='flex items-center gap-2'>
            <input
              type='checkbox'
              name='isActive'
              checked={Boolean(formData.isActive)}
              onChange={handleInputChange}
            />
            فعال
          </label>

          <div className='flex justify-end gap-3 pt-3'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 bg-gray-400 text-white rounded'
            >
              انصراف
            </button>

            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 text-white rounded'
            >
         {isEdit ? 'ویرایش دسته' : 'افزودن دسته'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
