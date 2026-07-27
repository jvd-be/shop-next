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
const Modaladdproduct = ({ isOpen, onClose, categories, onProductAdded }) => {
  // مدیریت واریانت‌ها
  const [variants, setVariants] = useState([])
  const [stock, setStock] = useState(0)
  const [notification, setNotification] = useState({
    show: false,
    type: 'success',
    title: ''
  })

  // مدیریت فرم اصلی
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    images: [], 
    price: '',
    discount: '',
    totalQuantity: '',
    isActive: false,
    isFeatured: false,
    category: '' // دسته‌بندی اینجا مدیریت می‌شود
  })

  // افزودن واریانت جدید
  const handleAddVariants = () => {
    const newVariants = {
      id: Date.now(),
      color: '',
      colorName: '',
      size: '',
      quantity: ''
    }
    setVariants([...variants, newVariants])
  }
  const [imageUrls, setImageUrls] = useState([])

  const handleRemoveImage = indexToRemove => {
    const newImages = formData.images.filter(
      (_, index) => index !== indexToRemove
    )

    setFormData(prev => ({
      ...prev,
      images: newImages
    }))
  }

  useEffect(() => {
    if (formData.images && formData.images.length > 0) {
      const urls = formData.images.map(file => URL.createObjectURL(file))
      setImageUrls(urls)
    } else {
      setImageUrls([])
    }

    return () => {
      imageUrls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [formData.images])
  // تغییر در ورودی‌های اصلی فرم
  const handleInputChange = e => {
    const { name, value, type, checked, files } = e.target

    if (name === 'images') {
      if (files) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...Array.from(files)]
        }))
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleVariantsChange = (index, field, value) => {
    const updatedVariants = [...variants]
    updatedVariants[index][field] = value
    setVariants(updatedVariants)
    setStock(
      variants
        .map(item => {
          return item.quantity
        })
        .reduce((x, y) => Number(x) + Number(y), 0)
    )
  }

  useEffect(()=>{
    setStock(
      variants
        .map(item => {
          return item.quantity
        })
        .reduce((x, y) => Number(x) + Number(y), 0)
    )
  },[variants])

  const handleRemoveVariant = id => {
    setVariants(variants.filter(variant => variant.id !== id))
  }

  const handleSubmit = async () => {
    const finalData = {
      ...formData,
      variants: variants,
      isActive: formData.isActive,
      isFeatured: formData.isFeatured
    }

    const formDataToSend = new FormData()

    formDataToSend.append('title', finalData.title)
    formDataToSend.append('slug', finalData.slug)
    formDataToSend.append('description', finalData.description)
    formDataToSend.append('price', finalData.price)
    formDataToSend.append('discount', finalData.discount)
    formDataToSend.append('totalQuantity', stock)
    formDataToSend.append('category', finalData.category)

    formDataToSend.append('isActive', finalData.isActive.toString())
    formDataToSend.append('isFeatured', finalData.isFeatured.toString())

    formDataToSend.append('variants', JSON.stringify(finalData.variants))

    finalData.images.forEach(file => {
      formDataToSend.append('images', file)
    })
    try {
      const res = await fetch('/api/products/add', {
        method: 'POST',
        body: formDataToSend
      })

      if (res.ok) {
        const data = await res.json()

        setNotification({
          show: true,
          type: 'success',
          title: 'محصول با موفقیت اضافه شد'
        })
        setStock(0)
        if (onProductAdded && data?.product) {
          onProductAdded(data.product)
        }

        setTimeout(() => {
          setNotification(prev => ({ ...prev, show: false }))
          onClose()
        }, 3000)

        setFormData({
          title: '',
          slug: '',
          description: '',
          images: [],
          price: '',
          discount: '',
          totalQuantity: '',
          isActive: false,
          isFeatured: false,
          category: ''
        })
        setVariants([])
      } else {
        setNotification({
          show: true,
          type: 'error',
          title: 'خطا در اضافه شدن محصول'
        })

        setTimeout(() => {
          setNotification(prev => ({ ...prev, show: false }))
        }, 3000)
      }
    } catch (error) {
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
                افزودن محصول جدید
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
                  onChange={handleInputChange}
                  value={formData.title}
                  name='title'
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
                  value={formData.slug}
                  onChange={handleInputChange}
                  name='slug'
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
                  onChange={handleInputChange}
                  rows={4}
                  value={formData.description}
                  name='description'
                  className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border'
                  placeholder='توضیحات کامل محصول را اینجا بنویسید...'
                  required
                />
              </div>
              {/* تصاویر */}
              <Addimage
                imageUrls={imageUrls}
                handleRemoveImage={handleRemoveImage}
                handleInputChange={handleInputChange}
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
                  value={formData.category}
                  onChange={handleInputChange}
                  className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border'
                  required
                >
                  <option value=''>انتخاب دسته‌بندی...</option>
                  {categories.map((cat, index) => (
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
                    name='price'
                    value={
                      formData.price
                        ? Number(formData.price).toLocaleString('en-US')
                        : ''
                    }
                    onChange={e =>
                      handleNumberInput({
                        e,
                        field: 'price',
                        setFormData,
                        isPrice: true
                      })
                    }
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
                      handleNumberInput({
                        e,
                        field: 'discount',
                        setFormData
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
                  onChange={handleInputChange}
                  value={stock}
                  readOnly
                  type='number'
                  name='totalQuantity'
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
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      id='isActive'
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
                      checked={formData.isFeatured}
                      id='isFeatured'
                      name='isFeatured'
                      type='checkbox'
                      onChange={handleInputChange}
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
                    onClick={handleAddVariants}
                    className='text-sm text-blue-600 hover:text-blue-500 font-medium'
                  >
                    + افزودن واریانت
                  </button>
                </div>
                {variants.map((item, index) => (
                  <div
                    key={item.id}
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
                        value={item.colorName}
                        name='colorName'
                        placeholder='قرمز'
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
                        onClick={() => handleRemoveVariant(item.id)}
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

export default Modaladdproduct
