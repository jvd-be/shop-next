'use client'
import { useState } from 'react'
import { FaCheck, FaEdit, FaPlus, FaTrash } from 'react-icons/fa'
import Statusbadge from '../../statusbadgue/Statusbadgue'
import { UseNotification } from '@/components/hooks/UseNotification'
import Cardnotification from '@/components/modules/cardnotification/Cardnotification'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import Deletemodal from '@/components/modules/cart/deletemodal/Deletemodal'
export const popupPositions = [
  { value: 'home', label: 'خانه' },
  { value: 'cart', label: 'سبد خرید' },
  { value: 'wishlist', label: 'علاقه مندی ها' }
]
export default function Tabpopups ({
  popups,
  addPopup,
  setPopupList,
  updatePopup,
  deletePopup
}) {
  const { notification, showNotification } = UseNotification()

  const emptyPopup = {
    key: '',
    title: '',
    closable: true,
    backgroundType: 'color',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    buttonColor: '#2563eb',
    overlayOpacity: 30,
    description: '',
    buttonText: '',
    buttonLink: '',
    triggerType: 'delay',
    delay: 2000,
    isActive: true,
    onlyGuest: false,
    frequency: 'oncePerDay',
    deviceTarget: 'all',
    priority: 0,
    startDate: '',
    endDate: ''
  }

  const [imageFile, setImageFile] = useState(null)
  const [isCreate, setIsCreate] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedDeleteId, setSelectedDeleteId] = useState(null)
  const [currentPopup, setCurrentPopup] = useState({ ...emptyPopup })
  const startCreate = () => {
    setCurrentPopup({ ...emptyPopup })
    setIsCreate(true)
  }

  const handleChange = e => {
    const { name, value, checked, type } = e.target
    setCurrentPopup(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const startEdit = popup => {
    setCurrentPopup({
      ...emptyPopup,
      ...popup
    })

    setIsCreate(true)
  }

  const onSave = async () => {
    try {
      if (!currentPopup.key) {
        return showNotification('error', 'جایگاه پاپ‌آپ را انتخاب کنید')
      }

      if (!currentPopup.title?.trim()) {
        return showNotification('error', 'عنوان پاپ‌آپ الزامی است')
      }

      if (!currentPopup.backgroundType) {
        return showNotification('error', 'زمان شروع را مشخص کنید')
      }
      if (!currentPopup.startDate) {
        return showNotification('error', 'زمان پایان  را مشخص کنید')
      }
      if (!currentPopup.endDate) {
        return showNotification('error', 'نوع پس‌زمینه را مشخص کنید')
      }

      const formData = new FormData()

      Object.entries(currentPopup).forEach(([key, value]) => {
        if (key === 'image') return
        if (
          value === null ||
          value === undefined ||
          value === '' ||
          value === 'null' ||
          value === 'undefined'
        ) {
          return
        }

        formData.append(key, value)
      })

      if (imageFile) {
        formData.append('image', imageFile)
      }

      let res

      if (!currentPopup._id) {
        res = await addPopup(formData)

        if (res.ok) {
          const data = await res.json()
          setPopupList(prev => [...prev, data.popup])
          setIsCreate(false)
        }
      } else {
        res = await updatePopup(formData)
        const data = await res.json()
        setPopupList(prev =>
          prev.map(p => (p._id === data.popup._id ? data.popup : p))
        )
        setIsCreate(false)
      }

      if (!res) {
        return showNotification('error', 'پاسخی از سرور دریافت نشد')
      }

      if (res.ok) {
        showNotification('success', 'تغییرات با موفقیت انجام شد')
      } else {
        showNotification('error', 'مشکلی در ایجاد تغییرات به وجود آمد')
      }
    } catch (error) {
      console.error('SAVE ERROR:', error)
      showNotification('error', 'خطای سیستمی رخ داده است')
    }
  }
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
      const res = await deletePopup(selectedDeleteId)

      if (res.ok) {
        setPopupList(prev => prev.filter(p => p._id !== selectedDeleteId))
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
    <div className='space-y-6'>
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
        onCancel={closeDelete}
        title={'آیا از حذف پاپ آپ مطمئن هستید؟'}
        onConfirm={onDelete}
      />
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold  dark:text-gray-100'>
          مدیریت پاپ‌آپ‌ها
        </h2>

        <button
          onClick={() => {
            startCreate()
          }}
          className='flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg '
        >
          <FaPlus />
          ساخت پاپ‌آپ جدید
        </button>
      </div>

      <div className='space-y-3'>
        {popups.map(popup => (
          <div
            key={popup._id}
            className='flex items-center justify-between border rounded-lg p-4 bg-white dark:bg-gray-800 dark:text-gray-100'
          >
            <div className='flex flex-col'>
              <h3 className='font-medium'>{popup.title}</h3>
              <div className=' flex items-center '>
                <span className='text-sm text-gray-500 px-1.5'>
                  نوع نمایش: {popup.triggerType}
                </span>

                <Statusbadge status={popup.isActive ? 'فعال' : 'غیرفعال'} />
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <button
                onClick={() => startEdit(popup)}
                className='text-blue-500'
              >
                <FaEdit />
              </button>

              <button
                onClick={() => openDelete(popup._id)}
                className='text-red-500'
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}

        {popups.length === 0 && (
          <div className='text-center text-gray-500 py-10'>
            هنوز هیچ پاپ‌آپی ساخته نشده است
          </div>
        )}

        {isCreate && (
          <div
            onClick={() => setIsCreate(false)}
            className='fixed inset-0 bg-black/50 flex items-center justify-center z-20 p-4'
          >
            <div
              onClick={e => e.stopPropagation()}
              className='bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4'
            >
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-bold'>ساخت پاپ‌آپ</h3>
                <button
                  onClick={() => setIsCreate(false)}
                  className='text-gray-500 text-sm'
                >
                  بستن
                </button>
              </div>

              {/* key */}

              <select
                className='w-full p-2 border rounded-lg'
                name='key'
                value={currentPopup.key}
                onChange={handleChange}
              >
                <option value=''>انتخاب جایگاه پاپ‌آپ</option>

                {popupPositions.map((item, index) => (
                  <option key={index} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              {/* title */}
              <input
                type='text'
                name='title'
                value={currentPopup.title}
                onChange={handleChange}
                placeholder='عنوان'
                className='w-full p-2 border rounded-lg'
              />

              {/* description */}
              <textarea
                name='description'
                value={currentPopup.description || ''}
                onChange={handleChange}
                placeholder='توضیحات'
                className='w-full p-2 border rounded-lg'
              />

              {/* button text */}
              <input
                type='text'
                name='buttonText'
                value={currentPopup.buttonText || ''}
                onChange={handleChange}
                placeholder='متن دکمه'
                className='w-full p-2 border rounded-lg'
              />

              {/* button link */}
              <input
                type='text'
                name='buttonLink'
                value={currentPopup.buttonLink || ''}
                onChange={handleChange}
                placeholder='لینک دکمه'
                className='w-full p-2 border rounded-lg'
              />

              {/* trigger type */}
              <select
                name='triggerType'
                value={currentPopup.triggerType}
                onChange={handleChange}
                className='w-full p-2 border rounded-lg'
              >
                <option value=''>نوع نمایش را انتخاب کنید</option>
                <option value='instant'>نمایش فوری</option>
                <option value='delay'>نمایش با تأخیر</option>
                <option value='scroll'>نمایش با اسکرول</option>
                <option value='exitIntent'>نمایش هنگام خروج</option>
              </select>

              {/* delay */}
              {(currentPopup.triggerType === 'delay' ||
                currentPopup.triggerType === 'scroll') && (
                <input
                  type='number'
                  name='delay'
                  value={currentPopup.delay}
                  onChange={handleChange}
                  placeholder={
                    currentPopup.triggerType === 'delay'
                      ? 'زمان تأخیر (ms)'
                      : 'درصد اسکرول'
                  }
                  className='w-full p-2 border rounded-lg'
                />
              )}

              {/* background type */}
              <select
                name='backgroundType'
                value={currentPopup.backgroundType}
                onChange={handleChange}
                className='w-full p-2 border rounded-lg'
              >
                <option value=''>نوع پس‌زمینه</option>
                <option value='color'>رنگ</option>
                <option value='gradient'>گرادینت</option>
                <option value='image'>تصویر</option>
              </select>

              {/* background color */}
              {currentPopup.backgroundType === 'color' && (
                <div>
                  <label className='block mb-1 text-sm'>رنگ پس‌زمینه</label>
                  <input
                    type='color'
                    name='backgroundColor'
                    value={currentPopup.backgroundColor || '#ffffff'}
                    onChange={handleChange}
                    className='w-full h-12 border rounded-lg'
                  />
                </div>
              )}
              {currentPopup.backgroundType === 'gradient' && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block mb-1 text-sm'>
                      رنگ شروع گرادینت
                    </label>
                    <input
                      type='color'
                      name='gradientFrom'
                      value={currentPopup.gradientFrom || '#6366f1'}
                      onChange={handleChange}
                      className='w-full h-12 border rounded-lg'
                    />
                  </div>

                  <div>
                    <label className='block mb-1 text-sm'>
                      رنگ پایان گرادینت
                    </label>
                    <input
                      type='color'
                      name='gradientTo'
                      value={currentPopup.gradientTo || '#2563eb'}
                      onChange={handleChange}
                      className='w-full h-12 border rounded-lg'
                    />
                  </div>
                </div>
              )}

              {/* image */}
              {currentPopup.backgroundType === 'image' && (
                <div>
                  <label className='block mb-1 text-sm'>تصویر پاپ‌آپ</label>
                  <input
                    type='file'
                    accept='image/*'
                    name='image'
                    onChange={e => setImageFile(e.target.files?.[0] || null)}
                    className='w-full p-2 border rounded-lg'
                  />
                </div>
              )}

              {/* colors */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label className='block mb-1 text-sm'>رنگ متن</label>
                  <input
                    type='color'
                    name='textColor'
                    value={currentPopup.textColor || '#000000'}
                    onChange={handleChange}
                    className='w-full h-12 border rounded-lg'
                  />
                </div>

                <div>
                  <label className='block mb-1 text-sm'>رنگ دکمه</label>
                  <input
                    type='color'
                    name='buttonColor'
                    value={currentPopup.buttonColor || '#2563eb'}
                    onChange={handleChange}
                    className='w-full h-12 border rounded-lg'
                  />
                </div>

                <div>
                  <label className='block mb-1 text-sm'>شفافیت overlay </label>
                  <input
                    type='number'
                    name='overlayOpacity'
                    value={currentPopup.overlayOpacity}
                    onChange={handleChange}
                    placeholder='مثلاً 60'
                    className='w-full p-2 border rounded-lg'
                  />
                </div>
              </div>

              {/* frequency */}
              <select
                name='frequency'
                value={currentPopup.frequency}
                onChange={handleChange}
                className='w-full p-2 border rounded-lg'
              >
                <option value=''>فرکانس نمایش</option>
                <option value='always'>همیشه</option>
                <option value='once'>فقط یک بار</option>
                <option value='oncePerDay'>روزی یک بار</option>
              </select>

              {/* device target */}
              <select
                name='deviceTarget'
                value={currentPopup.deviceTarget}
                onChange={handleChange}
                className='w-full p-2 border rounded-lg'
              >
                <option value=''>دستگاه هدف</option>
                <option value='all'>همه</option>
                <option value='desktop'>دسکتاپ</option>
                <option value='mobile'>موبایل</option>
              </select>

              {/* priority */}
              <input
                type='number'
                name='priority'
                value={currentPopup.priority}
                onChange={handleChange}
                placeholder='اولویت'
                className='w-full p-2 border rounded-lg'
              />

              {/* dates */}

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <p>تاریخ شروع</p>
                <input
                  type='datetime-local'
                  name='startDate'
                  value={currentPopup.startDate}
                  onChange={handleChange}
                  className='w-full p-2 border rounded-lg'
                />
                <p>تاریخ اتمام</p>
                <input
                  type='datetime-local'
                  name='endDate'
                  value={currentPopup.endDate}
                  onChange={handleChange}
                  className='w-full p-2 border rounded-lg'
                />
              </div>

              {/* checkboxes */}
              <div className='flex flex-col gap-3'>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    name='isActive'
                    checked={!!currentPopup.isActive}
                    onChange={handleChange}
                  />
                  فعال باشد
                </label>

                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    name='onlyGuest'
                    checked={!!currentPopup.onlyGuest}
                    onChange={handleChange}
                  />
                  فقط برای مهمان‌ها
                </label>

                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    name='closable'
                    checked={!!currentPopup.closable}
                    onChange={handleChange}
                  />
                  قابل بستن باشد
                </label>
              </div>

              {/* actions */}
              <div className='flex gap-3 pt-4'>
                <button
                  onClick={() => setIsCreate(false)}
                  className='w-full border border-gray-300 py-2 rounded-lg'
                >
                  انصراف
                </button>

                <button
                  onClick={onSave}
                  className='w-full bg-blue-600 text-white py-2 rounded-lg'
                >
                  ذخیره
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
