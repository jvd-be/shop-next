'use client'
import { UseNotification } from '@/components/hooks/UseNotification'
import Cardnotification from '@/components/modules/cardnotification/Cardnotification'
import Deletemodal from '@/components/modules/cart/deletemodal/Deletemodal'
import React, { useState } from 'react'
import { FaPlus, FaTrash, FaEdit, FaImage, FaCheck } from 'react-icons/fa'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function Tabsliders ({
  sliders = [],
  addSlider,
  updateSlider,
  setSlidersList,
  deleteSlider
}) {
  const { notification, showNotification } = UseNotification()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedDeleteId, setSelectedDeleteId] = useState(null)
  const slideInitial = {
    title: '',
    subtitle: '',
    description: '',
    imageDesktop: '',
    imageMobile: '',
    overlay: false,
    overlayOpacity: 20,
    textPosition: 'center-left',
    textColor: '#ffffff',
    buttonText: '',
    buttonLink: '',
    openInNewTab: false,
    priority: 0,
    isActive: true,
    startDate: '',
    endDate: ''
  }

  const sliderInitial = {
    key: 'home-hero',
    title: '',
    slides: [],
    autoplay: true,
    autoplayDelay: 5000,
    loop: true,
    showNavigation: true,
    showPagination: true,
    draggable: true,
    pauseOnHover: true,
    animation: 'slide',
    mobileAspectRatio: '12/11',
    desktopAspectRatio: '999/260',
    isActive: true
  }

  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState(sliderInitial)

  const startCreate = () => {
    setForm(sliderInitial)
    setIsOpen(true)
  }
  const handleEdit = slider => {
    setForm(slider)
    setIsOpen(true)
  }

  const addSlide = () => {
    setForm(prev => ({
      ...prev,
      slides: [...prev.slides, { ...slideInitial }]
    }))
  }

  const handleSlideChange = (index, field, value) => {
    setForm(prev => {
      const updatedSlides = [...prev.slides]
      updatedSlides[index][field] = value
      return { ...prev, slides: updatedSlides }
    })
  }

  const onSave = async () => {
    try {
      const formData = new FormData()

      const sliderData = {
        ...form,
        slides: form.slides.map(slide => ({
          ...slide,
          imageDesktop:
            typeof slide.imageDesktop === 'string' ? slide.imageDesktop : null,
          imageMobile:
            typeof slide.imageMobile === 'string' ? slide.imageMobile : null
        }))
      }

      formData.append('data', JSON.stringify(sliderData))

      form.slides.forEach((slide, index) => {
        if (slide.imageDesktop instanceof File) {
          formData.append(`desktop_${index}`, slide.imageDesktop)
        }

        if (slide.imageMobile instanceof File) {
          formData.append(`mobile_${index}`, slide.imageMobile)
        }
      })

      if (form._id) {
        const result = await updateSlider(formData)
        const updatedSlider = result?.data || result?.slider || result

        if (!updatedSlider?._id) {
          throw new Error('Updated slider payload is invalid')
        }

        setSlidersList(prev =>
          prev.map(item => (item._id === form._id ? updatedSlider : item))
        )

        showNotification('success', 'اسلایدر با موفقیت بروزرسانی شد ✅')
      } else {
        const result = await addSlider(formData)
        const newSlider = result?.data

        if (!newSlider?._id) {
          console.log('Invalid create result:', result)
          throw new Error('Created slider payload is invalid')
        }

        setSlidersList(prev => [...prev, newSlider])

        showNotification('success', 'اسلایدر جدید اضافه شد ✅')
      }

      setIsOpen(false)
    } catch (error) {
      console.error('error', error)
      showNotification('error', 'خطا در ذخیره اسلایدر ❌')
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
      const res = await deleteSlider(selectedDeleteId)

      if (res.ok) {
        setSlidersList(prev => prev.filter(p => p._id !== selectedDeleteId))
        closeDelete()
        showNotification('success', 'تغییرات با موفقیت انجام شد')
      } else {
        showNotification('error', 'مشکلی در ایجاد تغییرات به وجود امد')
      }
    } catch (error) {
      showNotification('error', 'مشکلی در ایجاد تغییرات به وجود امد')
    }
  }
  console.table(
    sliders.map((slider, index) => ({
      index,
      _id: slider?._id,
      id: slider?.id,
      title: slider?.title
    }))
  )
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
        title={'آیا از حذف اسلایدر مطمئن هستید؟'}
        onConfirm={onDelete}
      />
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-bold dark:text-white'>مدیریت اسلایدر ها</h2>
        <button
          onClick={startCreate}
          className='flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition'
        >
          <FaPlus /> افزودن اسلایدر
        </button>
      </div>

      {/* List Sliders */}
      <div className='grid gap-4'>
        {sliders
          .filter(slider => slider?._id)
          .map(slider => (
            <div
              key={slider._id}
              className='flex items-center justify-between p-4 rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm'
            >
              <div>
                <div className='font-bold text-lg dark:text-white'>
                  {slider?.title || '-'}
                </div>
                <div className='text-sm text-blue-500 font-mono'>
                  {slider?.key}
                </div>
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={() => handleEdit(slider)}
                  className='p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg'
                >
                  <FaEdit size={20} />
                </button>
                <button
                  onClick={() => openDelete(slider._id)}
                  className='p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg'
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* ✅ Full Featured Modal */}
      {isOpen && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4'>
          <div className='bg-gray-50 dark:bg-gray-900 rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl'>
            <div className='p-6 border-b dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-800'>
              <h3 className='text-xl font-bold dark:text-white'>
                {form._id ? 'ویرایش اسلایدر' : 'ایجاد اسلایدر جدید'}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className='text-gray-400 hover:text-gray-600'
              >
                ✕
              </button>
            </div>

            <div className='p-6 overflow-y-auto space-y-8 custom-scrollbar'>
              {/* --- بخش اول: تنظیمات اصلی اسلایدر --- */}
              <section className='grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm'>
                <div className='md:col-span-1'>
                  <label className='block text-sm font-medium mb-1 dark:text-gray-300'>
                    کلید یکتا (Key)
                  </label>
                  <select
                    className='w-full border dark:bg-gray-700 dark:border-gray-600 p-2 rounded-lg'
                    value={form.key}
                    onChange={e => setForm({ ...form, key: e.target.value })}
                  >
                    <option value='home-hero'>Home Hero (اصلی)</option>
                    <option value='home-middle'>Home Middle</option>
                    <option value='category-top'>Category Top</option>
                  </select>
                </div>
                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium mb-1 dark:text-gray-300'>
                    عنوان مدیریتی
                  </label>
                  <input
                    className='w-full border dark:bg-gray-700 dark:border-gray-600 p-2 rounded-lg'
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder='مثلاً: اسلایدر جشنواره بهاره'
                  />
                </div>

                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={form.autoplay}
                    onChange={e =>
                      setForm({ ...form, autoplay: e.target.checked })
                    }
                  />{' '}
                  <span className='text-sm dark:text-gray-300'>پخش خودکار</span>
                </div>
                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={form.loop}
                    onChange={e => setForm({ ...form, loop: e.target.checked })}
                  />{' '}
                  <span className='text-sm dark:text-gray-300'>
                    تکرار (Loop)
                  </span>
                </div>
                <div>
                  <label className='text-xs dark:text-gray-400'>
                    سرعت جابجایی (ms)
                  </label>
                  <input
                    type='number'
                    className='w-full border dark:bg-gray-700 dark:border-gray-600 p-1 rounded mt-1'
                    value={form.autoplayDelay}
                    onChange={e =>
                      setForm({
                        ...form,
                        autoplayDelay: Number(e.target.value)
                      })
                    }
                  />
                </div>
              </section>

              {/* --- بخش دوم: مدیریت اسلایدها --- */}
              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <h4 className='text-lg font-bold flex items-center gap-2 dark:text-white'>
                    <FaImage className='text-blue-500' /> لیست اسلایدها
                  </h4>
                  <button
                    onClick={addSlide}
                    className='bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2'
                  >
                    <FaPlus /> افزودن اسلاید جدید
                  </button>
                </div>

                <div className='space-y-6'>
                  {form.slides.map((slide, index) => (
                    <div
                      key={index}
                      className='relative bg-white dark:bg-gray-800 p-5 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700'
                    >
                      <button
                        onClick={() =>
                          setForm(prev => ({
                            ...prev,
                            slides: prev.slides.filter((_, i) => i !== index)
                          }))
                        }
                        className='absolute -top-3 -left-3 bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition'
                      >
                        <FaTrash size={12} />
                      </button>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {/* فیلدهای متنی اسلاید */}
                        <div className='space-y-3'>
                          <input
                            className='w-full border dark:bg-gray-700 p-2 rounded shadow-sm text-sm'
                            placeholder='عنوان اسلاید'
                            value={slide?.title || ''}
                            onChange={e =>
                              handleSlideChange(index, 'title', e.target.value)
                            }
                          />
                          <input
                            className='w-full border dark:bg-gray-700 p-2 rounded shadow-sm text-sm'
                            placeholder='زیرعنوان (Subtitle)'
                            value={slide.subtitle || ''}
                            onChange={e =>
                              handleSlideChange(
                                index,
                                'subtitle',
                                e.target.value
                              )
                            }
                          />
                          <textarea
                            className='w-full border dark:bg-gray-700 p-2 rounded shadow-sm text-sm h-20'
                            placeholder='توضیحات کوتاه'
                            value={slide.description || ''}
                            onChange={e =>
                              handleSlideChange(
                                index,
                                'description',
                                e.target.value
                              )
                            }
                          />
                        </div>

                        {/* فیلدهای تصویر و استایل */}
                        <div className='space-y-3'>
                          <div className='flex gap-2'>
                            {/* تصویر دسکتاپ */}
                            <div className='flex-1'>
                              <span className='text-xs text-orange-400'>
                                تصویر دسکتاپ
                              </span>
                              <input
                                type='file'
                                accept='image/*'
                                className='w-full border dark:bg-gray-700 p-2 rounded text-sm'
                                onChange={e =>
                                  handleSlideChange(
                                    index,
                                    'imageDesktop',
                                    e.target.files?.[0] || null
                                  )
                                }
                              />

                              {/* Preview */}
                              {slide.imageDesktop && (
                                <img
                                  src={
                                    typeof slide.imageDesktop === 'string'
                                      ? slide.imageDesktop
                                      : URL.createObjectURL(slide.imageDesktop)
                                  }
                                  alt='desktop preview'
                                  className='mt-2 h-20 rounded object-cover'
                                />
                              )}
                            </div>

                            {/* تصویر موبایل */}
                            <div className='flex-1'>
                              <span className='text-xs text-orange-400'>
                                تصویر موبایل
                              </span>
                              <input
                                type='file'
                                accept='image/*'
                                className='w-full border dark:bg-gray-700 p-2 rounded text-sm'
                                onChange={e =>
                                  handleSlideChange(
                                    index,
                                    'imageMobile',
                                    e.target.files?.[0] || null
                                  )
                                }
                              />

                              {/* Preview */}
                              {slide.imageMobile && (
                                <img
                                  src={
                                    typeof slide.imageMobile === 'string'
                                      ? slide.imageMobile
                                      : URL.createObjectURL(slide.imageMobile)
                                  }
                                  alt='mobile preview'
                                  className='mt-2 h-20 rounded object-cover'
                                />
                              )}
                            </div>
                          </div>

                          <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                            <select
                              className='border dark:bg-gray-700 p-2 rounded text-sm'
                              value={slide.textPosition}
                              onChange={e =>
                                handleSlideChange(
                                  index,
                                  'textPosition',
                                  e.target.value
                                )
                              }
                            >
                              <option value='center'>مرکز</option>
                              <option value='center-left'>مرکز چپ</option>
                              <option value='center-right'>مرکز راست</option>
                              <option value='bottom-center'>پایین مرکز</option>
                            </select>

                            <input
                              type='color'
                              className='w-full h-10 rounded cursor-pointer'
                              value={slide.textColor}
                              onChange={e =>
                                handleSlideChange(
                                  index,
                                  'textColor',
                                  e.target.value
                                )
                              }
                              title='رنگ متن'
                            />

                            {/* overlay enable */}
                            <label className='flex items-center gap-2 text-xs'>
                              <input
                                type='checkbox'
                                checked={slide.overlay || false}
                                onChange={e =>
                                  handleSlideChange(
                                    index,
                                    'overlay',
                                    e.target.checked
                                  )
                                }
                              />
                              Overlay
                            </label>

                            {/* overlay opacity */}
                            <input
                              type='range'
                              min='0'
                              max='100'
                              value={slide.overlayOpacity ?? 20}
                              onChange={e =>
                                handleSlideChange(
                                  index,
                                  'overlayOpacity',
                                  Number(e.target.value)
                                )
                              }
                              className='flex-1'
                            />
                            <span className='text-xs w-8'>
                              {slide.overlayOpacity ?? 20}%
                            </span>
                          </div>
                        </div>

                        {/* بخش دکمه و لینک */}
                        <div className='md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 dark:border-gray-700'>
                          <input
                            className='border dark:bg-gray-700 p-2 rounded text-sm'
                            placeholder='متن دکمه'
                            value={slide.buttonText}
                            onChange={e =>
                              handleSlideChange(
                                index,
                                'buttonText',
                                e.target.value
                              )
                            }
                          />
                          <input
                            className='border dark:bg-gray-700 p-2 rounded text-sm'
                            placeholder='لینک دکمه (URL)'
                            value={slide.buttonLink}
                            onChange={e =>
                              handleSlideChange(
                                index,
                                'buttonLink',
                                e.target.value
                              )
                            }
                          />
                          <div className='flex items-center gap-2'>
                            <input
                              type='checkbox'
                              checked={slide.openInNewTab}
                              onChange={e =>
                                handleSlideChange(
                                  index,
                                  'openInNewTab',
                                  e.target.checked
                                )
                              }
                            />
                            <span className='text-xs dark:text-gray-400'>
                              باز شدن در تب جدید
                            </span>
                          </div>
                        </div>

                        {/* زمان‌بندی نمایش اسلاید */}
                        <div className='md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 dark:border-gray-700'>
                          <div>
                            <label className='text-xs dark:text-gray-400 block mb-1'>
                              تاریخ شروع نمایش
                            </label>
                            <input
                              type='datetime-local'
                              className='w-full border dark:bg-gray-700 p-2 rounded text-sm'
                              value={slide.startDate || ''}
                              onChange={e =>
                                handleSlideChange(
                                  index,
                                  'startDate',
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          <div>
                            <label className='text-xs dark:text-gray-400 block mb-1'>
                              تاریخ پایان نمایش
                            </label>
                            <input
                              type='datetime-local'
                              className='w-full border dark:bg-gray-700 p-2 rounded text-sm'
                              value={slide.endDate || ''}
                              onChange={e =>
                                handleSlideChange(
                                  index,
                                  'endDate',
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className='p-6 border-t dark:border-gray-800 bg-white dark:bg-gray-800 flex justify-end gap-3'>
              <button
                onClick={() => setIsOpen(false)}
                className='px-6 py-2 border dark:border-gray-600 dark:text-white rounded-xl hover:bg-gray-50 transition'
              >
                لغو
              </button>
              <button
                onClick={onSave}
                className='px-10 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg transition font-bold'
              >
                ذخیره نهایی اسلایدر
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
