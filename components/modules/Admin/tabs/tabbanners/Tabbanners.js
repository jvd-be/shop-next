'use client'
import React, { useState } from 'react'
import { UseNotification } from '@/components/hooks/UseNotification'
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaCheck
} from 'react-icons/fa'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import Cardnotification from '@/components/modules/cardnotification/Cardnotification'
import Statusbadge from '../../statusbadgue/Statusbadgue'
import Deletemodal from '@/components/modules/cart/deletemodal/Deletemodal'
export const bannerPositions = [
  { value: 'Top-banner', label: 'تاپ بنر بالای سایت' },
  { value: 'Hero-banner', label: 'بنر اصلی صفحه اول' },
  { value: 'Promo-strip', label: 'نوار تبلیغاتی' },
  { value: 'Middle-banner', label: 'بنر وسط صفحه' },
  { value: 'Category-banner', label: 'بنر صفحه دسته‌بندی' },
  { value: 'Sidebar-banner', label: 'بنر سایدبار' },
  { value: 'Product-page-banner', label: 'بنر صفحه محصول' },
  { value: 'Cart-banner', label: 'بنر سبد خرید' },
  { value: 'Checkout-banner', label: 'بنر صفحه تسویه‌حساب' },
  { value: 'Footer-banner', label: 'بنر فوتر' }
]

export default function Tabbanners ({
  banners,
  setBanners,
  addBanner,
  updateBanner,
  deleteBanner
}) {
  const [imageFile, setImageFile] = useState(null)
  const [mobileImageFile, setMobileImageFile] = useState(null)
  const { notification, showNotification } = UseNotification()
  const emptyBanner = {
    key: '',
    title: '',
    subtitle: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    variant: 'wide',
    height: '',
    backgroundType: 'color',
    image: '',
    mobileImage: '',
    bgColor: '#dc2626',
    gradientFrom: '',
    gradientTo: '',
    textColor: '#ffffff',
    overlay: false,
    overlayColor: 'rgba(0,0,0,.3)',
    isActive: true,
    startDate: '',
    endDate: ''
  }

  const [editing, setEditing] = useState(false)
  const [currentBanner, setCurrentBanner] = useState({ ...emptyBanner })

  const startCreate = () => {
    setCurrentBanner({ ...emptyBanner })
    setEditing(true)
  }
  const startEdit = banner => {
    setCurrentBanner({
      ...emptyBanner,
      ...banner
    })
    setEditing(true)
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setCurrentBanner(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const onSave = async () => {
    try {
      const formData = new FormData()

      Object.entries(currentBanner).forEach(([key, value]) => {
        if (key === 'image' || key === 'mobileImage') return

        if (value !== null && value !== undefined) {
          formData.append(key, value)
        }
      })

      if (imageFile) {
        formData.append('image', imageFile)
      }

      if (mobileImageFile) {
        formData.append('mobileImage', mobileImageFile)
      }

      let res = null

      if (currentBanner._id) {
        res = await updateBanner(formData)
      } else {
        res = await addBanner(formData)
      }

      if (currentBanner._id) {
        const data = await res.json()

        setBanners(prev =>
          prev.map(banner =>
            banner._id === data.banner._id ? data.banner : banner
          )
        )
      } else {
        const data = await res.json()
        setBanners(prev => [data.banner, ...prev])
      }
      setEditing(false)
      setCurrentBanner({ ...emptyBanner })
      setImageFile(null)
      setMobileImageFile(null)
      if (res.ok) {
        showNotification('success', 'تغییرات با موفقیت انجام شد')
      } else {
        showNotification('error', 'مشکلی در ایجاد تغییرات به وجود امد')
      }
    } catch (error) {
      console.error(error)
      showNotification('error', 'خطای سرور')
    }
  }

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedDeleteId, setSelectedDeleteId] = useState(null)

  const openDelete = id => {
    setSelectedDeleteId(id)
    setIsDeleteOpen(true)
  }
  const closeDelete = () => {
    setSelectedDeleteId(null)
    setIsDeleteOpen(false)
  }

  const onDelete = async () => {
    if (!selectedDeleteId) return null
    try {
      const res = await deleteBanner(selectedDeleteId)

      if (res.ok) {
        setBanners(prev => prev.filter(b => b._id !== selectedDeleteId))
        closeDelete()
        showNotification('success', 'تغییرات با موفقیت انجام شد')
      } else {
        showNotification('error', 'مشکلی در ایجاد تغییرات به وجود امد')
      }
    } catch (error) {
      showNotification('error', 'مشکلی در ایجاد تغییرات به وجود امد')
    }
  }
  return (
    <div className='space-y-6 '>
      {/* header */}
      <div className='flex justify-between items-center '>
        <h2 className='text-xl font-bold dark:text-white'>مدیریت بنرها</h2>

        <button
          onClick={startCreate}
          className='flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg'
        >
          <FaPlus />
          افزودن بنر
        </button>
      </div>
      <Cardnotification
        show={notification.show}
        title={notification.title}
        color={notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
        Icon={
          notification.type === 'success' ? FaCheck : HiOutlineExclamationCircle
        }
      />
      <Deletemodal
        confirmDelete={isDeleteOpen}
        desc={'آیا از حذف بنر مطمئن هستید؟'}
        title={'حذف بنر'}
        onCancel={closeDelete}
        onConfirm={onDelete}
      />
      {/* banner list */}
      <div className='space-y-3'>
        {banners.map(banner => (
          <div
            key={banner?._id}
            className='flex items-center justify-between border rounded-lg p-4 bg-white dark:bg-gray-800 dark:text-gray-100'
          >
            <div>
              <h3 className='font-semibold dark:text-white'>{banner?.title}</h3>

              <p className='text-sm text-gray-500'>
                variant: {banner?.variant} |{' '}
                <Statusbadge status={banner?.isActive ? 'فعال' : 'غیرفعال'} />
              </p>
            </div>

            <div className='flex gap-3'>
              <button
                onClick={() => startEdit(banner)}
                className='text-blue-500'
              >
                <FaEdit />
              </button>

              <button
                onClick={() => openDelete(banner?._id)}
                className='text-red-500'
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* modal */}
      {editing && (
        <div
          onClick={e => {
            setEditing(false)
          }}
          className='fixed inset-0 bg-black/50 flex items-center justify-center z-10 '
        >
          <div
            onClick={e => e.stopPropagation()}
            className='bg-white h-screen overflow-y-scroll dark:bg-gray-800 p-6 rounded-xl w-full max-w-2xl space-y-4'
          >
            <div className='flex justify-between items-center '>
              <h3 className='text-lg font-bold dark:text-white'>تنظیم بنر</h3>

              <button onClick={() => setEditing(false)}>
                <FaTimes />
              </button>
            </div>

            {/* key */}
            <select
              name='key'
              value={currentBanner.key}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            >
              <option value=''>انتخاب جایگاه بنر</option>
              {bannerPositions.map(item => {
                const isUsedByAnotherBanner = banners.some(
                  b => b.key === item.value && b._id !== currentBanner._id
                )

                return (
                  <option
                    key={item.value}
                    value={item.value}
                    disabled={isUsedByAnotherBanner}
                  >
                    {item.label}
                  </option>
                )
              })}
            </select>

            {/* title */}
            <input
              name='title'
              value={currentBanner.title}
              onChange={handleChange}
              placeholder='title'
              className='w-full p-2 border rounded'
            />

            {/* subtitle */}
            <input
              name='subtitle'
              value={currentBanner.subtitle}
              onChange={handleChange}
              placeholder='subtitle'
              className='w-full p-2 border rounded'
            />

            {/* description */}
            <textarea
              name='description'
              value={currentBanner.description}
              onChange={handleChange}
              placeholder='description'
              className='w-full p-2 border rounded'
            />

            {/* variant */}
            <select
              name='variant'
              value={currentBanner.variant}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            >
              <option value='hero'>hero</option>
              <option value='wide'>wide</option>
              <option value='compact'>compact</option>
              <option value='card'>card</option>
            </select>
            <input
              name='height'
              value={currentBanner.height}
              onChange={handleChange}
              placeholder='height'
              className='w-full p-2 border rounded'
            />
            {/* background type */}
            <select
              name='backgroundType'
              value={currentBanner.backgroundType}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            >
              <option value='color'>color</option>
              <option value='gradient'>gradient</option>
              <option value='image'>image</option>
            </select>

            {/* dynamic fields */}

            {currentBanner.backgroundType === 'color' && (
              <input
                type='color'
                name='bgColor'
                value={currentBanner?.bgColor || '#dc2626'}
                onChange={handleChange}
              />
            )}

            {currentBanner.backgroundType === 'gradient' && (
              <div className='flex gap-2'>
                <input
                  type='color'
                  name='gradientFrom'
                  value={currentBanner.gradientFrom}
                  onChange={handleChange}
                />
                <input
                  type='color'
                  name='gradientTo'
                  value={currentBanner.gradientTo}
                  onChange={handleChange}
                />
              </div>
            )}
            {currentBanner.image && (
              <img src={currentBanner.image} className='w-40 rounded' />
            )}
            {currentBanner.backgroundType === 'image' && (
              <>
                <input
                  type='file'
                  accept='image/*'
                  onChange={e => setImageFile(e.target.files[0])}
                />

                <input
                  type='file'
                  accept='image/*'
                  onChange={e => setMobileImageFile(e.target.files[0])}
                />
              </>
            )}

            {/* button */}
            <input
              name='buttonText'
              value={currentBanner.buttonText}
              onChange={handleChange}
              placeholder='button text'
              className='w-full p-2 border rounded'
            />

            <input
              name='buttonLink'
              value={currentBanner.buttonLink}
              onChange={handleChange}
              placeholder='button link'
              className='w-full p-2 border rounded'
            />

            {/* active */}
            <label className='flex gap-2 items-center'>
              <input
                type='checkbox'
                name='isActive'
                checked={currentBanner.isActive}
                onChange={handleChange}
              />
              فعال
            </label>

            {/* dates */}
            <input
              type='datetime-local'
              name='startDate'
              value={currentBanner.startDate}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />

            <input
              type='datetime-local'
              name='endDate'
              value={currentBanner.endDate}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />

            {/* save */}
            <button
              onClick={onSave}
              className='w-full bg-blue-600 text-white py-2 rounded-lg flex justify-center gap-2'
            >
              <FaSave />
              ذخیره
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
