import React from 'react'
import {
  HiOutlineDocumentText,
  HiOutlineLink,
  HiOutlineShoppingBag,
  HiOutlineCurrencyDollar,
  HiOutlineTag,
  HiOutlineArchive,
  HiOutlineX
} from 'react-icons/hi'
export default function Modalshowproduct ({
  onClose,
  isOpenEye,
  showedProduct
}) {
  if (!isOpenEye) return null

  return (
    <div
      onClick={onClose}
      className='fixed inset-0 bg-neutral-900/80 bg-opacity-50 flex items-center justify-center z-20 p-4'
      aria-labelledby='modal-title'
      role='dialog'
      aria-modal='true'
    >
      <div
        onClick={e => e.stopPropagation()}
        className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto'
      >
        <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full'>
          {/* هدر */}
          <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200'>
            <div className='flex justify-between items-center'>
              <h3
                className='text-lg leading-6 font-medium text-gray-900'
                id='modal-title'
              >
                مشاهده محصول
              </h3>
              <button
                onClick={onClose}
                className='text-gray-400 hover:text-gray-500 focus:outline-none'
              >
                <HiOutlineX className='h-6 w-6' />
              </button>
            </div>
          </div>
          {/* بدنه فرم */}
          <div className='px-4 py-5 sm:p-6 bg-white'>
            <div className='space-y-6'>
              {/* عنوان */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  <span className='flex items-center gap-2'>
                    <HiOutlineDocumentText className='text-gray-400' /> عنوان
                    محصول
                  </span>
                </label>
                <input
                  type='text'
                  readOnly
                  value={showedProduct.title}
                  name='title'
                  className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border'
                  placeholder='مثلا: کفش ورزشی نایکی'
                />
              </div>
              {/* اسلاگ */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  <span className='flex items-center gap-2'>
                    <HiOutlineLink className='text-gray-400' /> اسلاگ (Slug)
                  </span>
                </label>
                <input
                  type='text'
                  readOnly
                  value={showedProduct.slug}
                  name='slug'
                  className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border'
                  placeholder='nike-sport-shoes'
                />
              </div>
              {/* توضیحات */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  <span className='flex items-center gap-2'>
                    <HiOutlineDocumentText className='text-gray-400' /> توضیحات
                  </span>
                </label>
                <textarea
                  name='description'
                  value={showedProduct.description}
                  readOnly
                  className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border'
                  placeholder='توضیحات کامل محصول را اینجا بنویسید...'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  <span className='flex items-center gap-2'>
                    <HiOutlineShoppingBag className='text-gray-400' /> دسته‌بندی
                  </span>
                </label>
                <select
                  readOnly
                  value={showedProduct.category.name}
                  name='category'
                  className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border'
                >
                  <option>sgj</option>
                </select>
              </div>

              <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    <span className='flex items-center gap-2'>
                      <HiOutlineCurrencyDollar className='text-gray-400' /> قیمت
                      (تومان)
                    </span>
                  </label>
                  <input
                    value={showedProduct.price}
                    name='price'
                    readOnly
                    className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border'
                    placeholder='0'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    <span className='flex items-center gap-2'>
                      <HiOutlineTag className='text-gray-400' /> درصد تخفیف (%)
                    </span>
                  </label>
                  <input
                    readOnly
                    value={showedProduct.discount}
                    type='number'
                    name='discount'
                    className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border'
                    placeholder='0'
                    min='0'
                    max='100'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  <span className='flex items-center gap-2'>
                    <HiOutlineArchive className='text-gray-400' /> تعداد کل
                    موجودی
                  </span>
                </label>
                <input
                  readOnly
                  value={showedProduct.totalQuantity}
                  type='number'
                  name='totalQuantity'
                  className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border'
                  placeholder='0'
                  min='0'
                />
              </div>

              <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2'>
                <div className='flex items-start'>
                  <div className='flex items-center h-5'>
                    <input
                      readOnly
                      id='isActive'
                      checked={showedProduct.isActive}
                      name='isActive'
                      type='checkbox'
                      className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded'
                    />
                  </div>
                  <div className='mr-3 text-sm'>
                    <label
                      htmlFor='isActive'
                      className='font-medium text-gray-700'
                    >
                      فعال بودن محصول
                    </label>
                    <p className='text-gray-500'>
                      این محصول در فروشگاه نمایش داده شود
                    </p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <div className='flex items-center h-5'>
                    <input
                      readOnly
                      checked={showedProduct.isFeatured}
                      id='isFeatured'
                      name='isFeatured'
                      type='checkbox'
                      className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded'
                    />
                  </div>
                  <div className='mr-3 text-sm'>
                    <label
                      htmlFor='isFeatured'
                      className='font-medium text-gray-700'
                    >
                      محصول ویژه (Featured)
                    </label>
                    <p className='text-gray-500'>نمایش در صفحه اصلی</p>
                  </div>
                </div>
              </div>
              {showedProduct.images.length > 0 && (
                <div className='mt-4 grid grid-cols-4 gap-4'>
                  {showedProduct.images.map((url, index) => (
                    <div key={index} className='relative group'>
                      <img
                        src={url}
                        alt={`preview-${index}`}
                        className='w-full h-24 object-cover rounded-md border border-gray-300'
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className='border-t border-gray-200 pt-6'>
                <div className='flex justify-between items-center mb-4'>
                  <h4 className='text-sm font-medium text-gray-900 flex items-center gap-2'>
                    <HiOutlineShoppingBag className='text-gray-400' />{' '}
                    واریانت‌ها (رنگ و سایز)
                  </h4>
                </div>
                {showedProduct.variants.map((item, index) => (
                  <div
                    key={item._id}
                    className='grid grid-cols-12 gap-4 mb-4 items-center'
                  >
                    <div className='col-span-3 flex flex-col  justify-start items-start gap-y-1'>
                      <label className=''>رنگ</label>
                      <input
                        type='text'
                        readOnly
                        value={item.color}
                        name='color'
                        placeholder='رنگ'
                        className='w-full border-gray-300 rounded-md shadow-sm border p-2 text-sm'
                      />
                    </div>
                    <div className='col-span-3 flex flex-col  justify-start items-start gap-y-1'>
                      <label className=''>نام رنگ</label>
                      <input
                        type='text'
                        readOnly
                        value={item.colorName}
                        name='colorName'
                        placeholder='قرمز'
                        className='w-full border-gray-300 rounded-md shadow-sm border p-2 text-sm'
                      />
                    </div>
                    <div className='col-span-3 flex flex-col  justify-start items-start gap-y-1'>
                      <label className=''>سایز</label>
                      <input
                        type='text'
                        readOnly
                        value={item.size}
                        onChange={e =>
                          handleVariantsChange(index, 'size', e.target.value)
                        }
                        placeholder='سایز'
                        className='w-full border-gray-300 rounded-md shadow-sm border p-2 text-sm'
                      />
                    </div>
                    <div className='col-span-3  flex flex-col  justify-start items-start gap-y-1'>
                      <label className=''>تعداد</label>
                      <input
                        type='number'
                        readOnly
                        value={item.quantity}
                        onChange={e =>
                          handleVariantsChange(
                            index,
                            'quantity',
                            e.target.value
                          )
                        }
                        placeholder='تعداد'
                        className='w-full border-gray-300 rounded-md shadow-sm border p-2 text-sm'
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
