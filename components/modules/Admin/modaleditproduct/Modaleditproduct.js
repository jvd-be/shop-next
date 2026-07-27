'use client'
import React, { useState, useEffect } from 'react'
import {
  HiOutlineDocumentText,
  HiOutlineLink,
  HiOutlineShoppingBag,
  HiOutlineCurrencyDollar,
  HiOutlineTag,
  HiOutlineArchive,
  HiOutlineExclamationCircle,
  HiOutlineX
} from 'react-icons/hi'
import { handleNumberInput } from '@/components/utils/helper'
import { cleanNumberInput } from '@/components/utils/helper'
import Cardnotification from '../../cardnotification/Cardnotification'
import { FaCheck } from 'react-icons/fa'
import Addimage from '../addimage/Addimage'
const Modaleditproduct = ({
  isOpen,
  onClose,
  editProduct,
  categories,
  onProductAdded
}) => {
  const [notification, setNotification] = useState({
    show: false,
    type: 'success',
    title: ''
  })

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    images: [],
    price: '',
    discount: '',
    stock: 0,
    isActive: false,
    isFeatured: false,
    category: '',
    variants: []
  })

  useEffect(() => {
    if (!editProduct) return

    setFormData({
      id: editProduct._id,
      title: editProduct.title || '',
      slug: editProduct.slug || '',
      description: editProduct.description || '',
      images: editProduct.images || [],
      price: editProduct.price || '',
      discount: editProduct.discount || '',
      stock: editProduct.stock || 0,
      isActive: editProduct.isActive || false,
      isFeatured: editProduct.isFeatured || false,
      category:
        typeof editProduct.category === 'object'
          ? editProduct.category?._id
          : editProduct.category || '',
      variants: (editProduct.variants || []).map(item => ({
        ...item,
        id: item.id || item._id || crypto.randomUUID()
      }))
    })
  }, [editProduct, categories])

  const handleVariantsChange = (index, field, value) => {
    const updatedVariants = [...formData.variants]

    updatedVariants[index][field] = value

    const totalStock = updatedVariants.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    )
    setFormData(prev => ({
      ...prev,
      variants: updatedVariants,
      stock: totalStock
    }))
  }

  useEffect(() => {
    const totalStock = formData.variants.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    )
    setFormData(prev => ({
      ...prev,
      stock: totalStock
    }))
  }, [formData.variants])

  const handleRemoveVariant = index => {
    const updatedVariants = formData.variants.filter((_, i) => i !== index)
    const totalStock = updatedVariants.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    )
    setFormData(prev => ({
      ...prev,
      variants: updatedVariants,
      stock: totalStock
    }))
  }

  const handleAddVariants = () => {
    const newVariant = {
      id: crypto.randomUUID(),
      color: '',
      size: '',
      quantity: ''
    }

    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, newVariant]
    }))
  }

  const handleRemoveImage = indexToRemove => {
    const newImages = formData.images.filter(
      (_, index) => index !== indexToRemove
    )

    setFormData(prev => ({
      ...prev,
      images: newImages
    }))
  }

  const handleImageChange = e => {
    const files = Array.from(e.target.files)

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }))
  }

  const handleSubmit = async () => {
    const finalData = {
      ...formData,
      variants: formData.variants,
      isActive: formData.isActive,
      isFeatured: formData.isFeatured
    }

    const formDataToSend = new FormData()

    formDataToSend.append('id', finalData.id)
    formDataToSend.append('title', finalData.title)
    formDataToSend.append('slug', finalData.slug)
    formDataToSend.append('description', finalData.description)
    formDataToSend.append('price', finalData.price)
    formDataToSend.append('discount', finalData.discount)
    formDataToSend.append('totalQuantity', formData.stock)
    formDataToSend.append('category', finalData.category)

    formDataToSend.append('isActive', finalData.isActive.toString())
    formDataToSend.append('isFeatured', finalData.isFeatured.toString())

    formDataToSend.append('variants', JSON.stringify(finalData.variants))

    finalData.images.forEach(item => {
      if (item instanceof File) {
        formDataToSend.append('images', item)
      } else {
        formDataToSend.append('existingImages', item)
      }
    })

    try {
      const res = await fetch('/api/products/edit', {
        method: 'PUT',
        body: formDataToSend
      })


      if (res.ok) {
        const data = await res.json()

        setNotification({
          show: true,
          type: 'success',
          title: 'محصول با موفقیت ادیت شد'
        })
        if (onProductAdded && data?.product) {
          onProductAdded(data.product)
        }

        setTimeout(() => {
          setNotification(prev => ({ ...prev, show: false }))
          onClose()
        }, 3000)
      } else {
        setNotification({
          show: true,
          type: 'error',
          title: 'خطا در ادیت شدن محصول'
        })

        setTimeout(() => {
          setNotification(prev => ({ ...prev, show: false }))
        }, 3000)
      }
    } catch (error) {
      console.log(error)

      setNotification({
        show: true,
        type: 'error',
        title: 'خطا در ارتباط با سرور'
      })

      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }))
      }, 3000)
    }
  }

  console.log(editProduct)

  if (!editProduct) return null

  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      className='fixed inset-0 bg-neutral-900/80 bg-opacity-50 flex items-center justify-center z-20 p-4'
      aria-labelledby='modal-title'
      role='dialog'
      aria-modal='true'
    >
      <Cardnotification
        show={notification.show}
        title={notification.title}
        color={notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
        Icon={
          notification.type === 'success' ? FaCheck : HiOutlineExclamationCircle
        }
      />

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
                ادیت محصول
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
                  name='title'
                  value={formData.title}
                  onChange={e =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border'
                  placeholder='مثلا: کفش ورزشی نایکی'
                  required
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
                  name='slug'
                  value={formData.slug}
                  onChange={e =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border'
                  placeholder='nike-sport-shoes'
                  required
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
                  rows={4}
                  name='description'
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border'
                  placeholder='توضیحات کامل محصول را اینجا بنویسید...'
                  required
                />
              </div>
              {/* تصاویر */}
              <Addimage
                imageUrls={formData.images}
                setFormData={setFormData}
                handleRemoveImage={handleRemoveImage}
                handleInputChange={handleImageChange}
              />

              {/* دسته‌بندی */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  <span className='flex items-center gap-2'>
                    <HiOutlineShoppingBag className='text-gray-400' /> دسته‌بندی
                  </span>
                </label>
                <select
                  name='category'
                  className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border'
                  required
                  value={formData.category}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      category: e.target.value
                    }))
                  }
                >
                  <option value='' disabled>
                    انتخاب دسته‌بندی...
                  </option>

                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
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
                    type='text'
                    value={formData.price}
                    onChange={e =>
                      handleNumberInput({ e, field: 'price', setFormData })
                    }
                    name='price'
                    className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    <span className='flex items-center gap-2'>
                      <HiOutlineTag className='text-gray-400' /> درصد تخفیف (%)
                    </span>
                  </label>
                  <input
                    type='text'
                    name='discount'
                    value={formData.discount}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        discount: cleanNumberInput(e.target.value)
                      })
                    }
                    className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border'
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
                  type='number'
                  name='totalQuantity'
                  value={formData.stock}
                  className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border'
                  placeholder='0'
                  min='0'
                  required
                />
              </div>

              <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2'>
                <div className='flex items-start'>
                  <div className='flex items-center h-5'>
                    <input
                      id='isActive'
                      name='isActive'
                      checked={formData.isActive}
                      onChange={e =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
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
                      id='isFeatured'
                      name='isFeatured'
                      type='checkbox'
                      checked={formData.isFeatured}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          isFeatured: e.target.checked
                        })
                      }
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

              <div className='border-t border-gray-200 pt-6'>
                <div className='flex justify-between items-center mb-4'>
                  <h4 className='text-sm font-medium text-gray-900 flex items-center gap-2'>
                    <HiOutlineShoppingBag className='text-gray-400' />{' '}
                    واریانت‌ها (رنگ و سایز)
                  </h4>
                  <button
                    onClick={() => handleAddVariants()}
                    className='text-sm text-blue-600 cursor-pointer hover:text-blue-500 font-medium'
                  >
                    + افزودن واریانت
                  </button>
                </div>
                {formData.variants.map((item, index) => (
                  <div
                    key={item.id || item._id || `${item.size}-${item.color}`}
                    className='grid grid-cols-12 gap-4 mb-4 items-center'
                  >
                    <div className='col-span-3'>
                      <input
                        onChange={e =>
                          handleVariantsChange(index, 'color', e.target.value)
                        }
                        type='text'
                        value={item.color}
                        name='color'
                        placeholder='رنگ'
                        className='w-full border-gray-300 rounded-md shadow-sm border p-2 text-sm'
                      />
                    </div>
                    <div className='col-span-3'>
                      <input
                        onChange={e =>
                          handleVariantsChange(index, 'colorName', e.target.value)
                        }
                        type='text'
                        value={item.colorName || ""}
                        name='colorName'
                        placeholder='نام رنگ'
                        className='w-full border-gray-300 rounded-md shadow-sm border p-2 text-sm'
                      />
                    </div>
                    <div className='col-span-3'>
                      <input
                        type='text'
                        value={item.size}
                        onChange={e =>
                          handleVariantsChange(index, 'size', e.target.value)
                        }
                        placeholder='سایز'
                        className='w-full border-gray-300 rounded-md shadow-sm border p-2 text-sm'
                      />
                    </div>
                    <div className='col-span-3'>
                      <input
                        type='text'
                        value={item.quantity}
                        onChange={e =>
                          handleVariantsChange(
                            index,
                            'quantity',
                            cleanNumberInput(e.target.value)
                          )
                        }
                        placeholder='تعداد'
                        className='w-full border-gray-300 rounded-md shadow-sm border p-2 text-sm'
                      />
                    </div>
                    <div className='col-span-1 flex justify-center'>
                      <button
                        onClick={() => handleRemoveVariant(index)}
                        type='button'
                        className='text-red-500 hover:text-red-700'
                      >
                        <HiOutlineExclamationCircle className='h-5 w-5' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* فوتر */}
          <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
            <button
              onClick={handleSubmit}
              type='button'
              className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm'
            >
              ذخیره محصول
            </button>
            <button
              onClick={onClose}
              type='button'
              className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
            >
              انصراف
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modaleditproduct
