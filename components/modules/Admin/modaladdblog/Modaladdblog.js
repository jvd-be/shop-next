'use client'

import { useState, useEffect } from 'react'
import { FaCheck, FaTrash } from 'react-icons/fa'
import { IoClose, IoAdd, IoImage } from 'react-icons/io5'
import Cardnotification from '../../cardnotification/Cardnotification'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { UseNotification } from '@/components/hooks/UseNotification'

export default function ModalAddBlog ({ isOpen, onClose, onAddBloged }) {
  const { notification, showNotification } = UseNotification()
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    author: '',
    coverImage: '',
    isActive: false
  })
  const [coverPreview, setCoverPreview] = useState(null)
  const [subImagesPreview, setSubImagesPreview] = useState({})

  const [body, setBody] = useState([
    {
      id: crypto.randomUUID(),
      subTitle: '',
      subImages: [],
      subDescription: ''
    }
  ])

  const handleChangeForm = e => {
    const { name, value, type, checked, files } = e.target

    if (type === 'file') {
      const file = files[0]

      if (!file) return

      if (coverPreview) {
        URL.revokeObjectURL(coverPreview)
      }

      const preview = URL.createObjectURL(file)

      setFormData(prev => ({
        ...prev,
        coverImage: file
      }))

      setCoverPreview(preview)

      return
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  useEffect(() => {
    return () => {
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview)
      }
    }
  }, [coverPreview])

  const handleChangeBody = (index, field, value) => {
  setBody(prev => {
    const updated = [...prev]

    updated[index] = {
      ...updated[index],
      [field]: value
    }

    return updated
  })
}

  const handleAddBody = () => {
    const newBody = {
      id: crypto.randomUUID(),
      subTitle: '',
      subImages: [],
      subDescription: ''
    }
    setBody([...body, newBody])
  }

  const handleDeleteBody = id => {
   setBody(prev => prev.filter(item => (item.id || item._id) !== id))

  }
  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      coverImage: null
    }))
    setCoverPreview(null)
  }
  const handleSectionImages = (index, files) => {
    const fileArray = Array.from(files)

    setBody(prev =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              subImages: fileArray
            }
          : item
      )
    )

    const previews = fileArray.map(file => URL.createObjectURL(file))

    setSubImagesPreview(prev => ({
      ...prev,
      [index]: previews
    }))
  }
  const handleRemoveSectionImage = (sectionIndex, imageIndex) => {
    // حذف فایل واقعی
    setBody(prev =>
      prev.map((section, i) => {
        if (i !== sectionIndex) return section

        return {
          ...section,
          subImages: section.subImages.filter((_, idx) => idx !== imageIndex)
        }
      })
    )

    setSubImagesPreview(prev => ({
      ...prev,
      [sectionIndex]: prev[sectionIndex].filter((_, idx) => idx !== imageIndex)
    }))
  }

  useEffect(() => {
    return () => {
      Object.values(subImagesPreview)
        .flat()
        .forEach(url => {
          URL.revokeObjectURL(url)
        })
    }
  }, [subImagesPreview])

  const handleSubmit = async () => {
    const fd = new FormData()

    fd.append('title', formData.title)
    fd.append('slug', formData.slug)
    fd.append('author', formData.author)
    fd.append('description', formData.description)
    fd.append('isActive', formData.isActive)

    if (formData.coverImage) {
      fd.append('coverImage', formData.coverImage)
    }

    // body بدون عکس
    const bodyWithoutImages = body.map(sec => ({
      subTitle: sec.subTitle,
      subDescription: sec.subDescription
    }))

    fd.append('body', JSON.stringify(bodyWithoutImages))

    body.forEach((section, i) => {
      section.subImages.forEach(file => {
        fd.append(`sectionImage${i}`, file)
      })
    })

    try {
      const res = await fetch('/api/blogs/add', {
        method: 'POST',
        body: fd
      })

      if (res.ok) {
        const data = await res.json()

        showNotification('success', 'بلاگ با موفقیت اضافه شد')
        if (onAddBloged && data?.blog) {
          onAddBloged(data.blog)
        }

        setFormData({
          title: '',
          slug: '',
          description: '',
          images: [],
          author: '',
          isActive: false
        })
        setBody([])
      } else {
        showNotification('error', 'خطا در اضافه شدن بلاگ')
      }
    } catch (error) {
      showNotification('error', 'خطا در ارتباط با سرور')
    }
  }

  if (!isOpen) return null
  return (
    <form
      onClick={() => onClose()}
      className='fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/80 bg-opacity-50 p-4'
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
        className='max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl'
      >
        {/* Header */}
        <div className='flex items-center justify-between border-b p-5'>
          <h2 className='text-2xl font-bold text-gray-800'>افزودن بلاگ</h2>

          <button
            type='button'
            onClick={() => onClose()}
            className='rounded-full p-2 transition hover:bg-gray-100'
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Body */}
        <div className='space-y-8 p-6'>
          {/* Main Info */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>
              عنوان بلاگ
            </label>

            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleChangeForm}
              placeholder='عنوان را وارد کنید...'
              className='w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-blue-600'
            />
          </div>

          <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>
                نام نویسنده
              </label>

              <input
                type='text'
                name='author'
                value={formData.author}
                onChange={handleChangeForm}
                placeholder='نام نویسنده را وارد کنید...'
                className='w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-blue-600'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>اسلاگ</label>

              <input
                type='text'
                value={formData.slug}
                placeholder='blog-slug'
                name='slug'
                onChange={handleChangeForm}
                className='w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-blue-600'
              />
            </div>
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-700'>
              توضیحات کوتاه
            </label>

            <textarea
              rows={4}
              name='description'
              value={formData.description}
              onChange={handleChangeForm}
              placeholder='توضیحات کوتاه بلاگ...'
              className='w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-blue-600'
            />
          </div>
          {coverPreview && (
            <div className='relative group'>
              <img
                src={coverPreview}
                className='w-full h-24 object-cover rounded-md border border-gray-300'
              />
              <button
                type='button'
                onClick={() => handleRemoveImage()}
                className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600'
                title='حذف تصویر'
              >
                <FaTrash className='h-4 w-4' />
              </button>
            </div>
          )}

          {/* Cover Image */}
          <div className='space-y-3'>
            <label className='text-sm font-medium text-gray-700'>
              تصویر کاور
            </label>

            <label className='flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 p-10 transition hover:border-blue-600'>
              <IoImage size={50} className='text-gray-500' />

              <span className='mt-3 text-sm text-gray-600'>
                برای آپلود کلیک کنید
              </span>

              <input
                type='file'
                name='coverImage'
                onChange={handleChangeForm}
                className='hidden'
              />
            </label>
          </div>

          {/* Sections */}
          {body.map((sec, index) => (
            <div key={sec.id} className='space-y-8'>
              <div className='rounded-2xl border border-gray-200 p-5'>
                <div className='mb-5 flex items-center justify-between'>
                  <h3 className='text-lg font-bold text-gray-800'>
                    سکشن {index + 1}
                  </h3>

                  <button
                    type='button'
                    onClick={() => {
                      handleDeleteBody(sec.id)
                    }}
                    className='rounded-lg bg-red-500 px-4 py-2 text-sm text-white transition hover:bg-red-600'
                  >
                    حذف سکشن
                  </button>
                </div>

                <div className='space-y-5'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      زیرعنوان
                    </label>

                    <input
                      type='text'
                      name='subTitle'
                      onChange={e =>
                        handleChangeBody(index, 'subTitle', e.target.value)
                      }
                      placeholder='زیرعنوان سکشن...'
                      className='w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-blue-600'
                    />
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      توضیحات سکشن
                    </label>

                    <textarea
                      rows={5}
                      name='subDescription'
                      onChange={e =>
                        handleChangeBody(
                          index,
                          'subDescription',
                          e.target.value
                        )
                      }
                      placeholder='متن سکشن...'
                      className='w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-blue-600'
                    />
                  </div>

                  <div className='space-y-3'>
                    {subImagesPreview[index]?.length > 0 && (
                      <div className='mt-4 flex flex-wrap gap-3'>
                        {subImagesPreview[index].map((img, imgIndex) => (
                          <div key={imgIndex} className='relative group'>
                            <img
                              src={img}
                              alt=''
                              className='h-24 w-24 rounded-lg border border-gray-300 object-cover'
                            />
                            <button
                              type='button'
                              onClick={() =>
                                handleRemoveSectionImage(index, imgIndex)
                              }
                              className='absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition group-hover:opacity-100'
                            >
                              <FaTrash className='h-3 w-3' />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <label className='text-sm font-medium text-gray-700'>
                      تصاویر سکشن
                    </label>

                    <label className='flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 p-8 transition hover:border-blue-600'>
                      <IoImage size={45} className='text-gray-500' />

                      <span className='mt-2 text-sm text-gray-600'>
                        آپلود تصاویر
                      </span>

                      <input
                        type='file'
                        name='subImages'
                        onChange={e =>
                          handleSectionImages(index, e.target.files)
                        }
                        multiple
                        className='hidden'
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            type='button'
            onClick={handleAddBody}
            className='flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700'
          >
            <IoAdd size={22} />
            افزودن سکشن جدید
          </button>

          {/* Status */}
          <div className='flex items-center gap-10'>
            <label className='flex items-center gap-3'>
              <input
                type='checkbox'
                name='isActive'
                checked={formData.isActive}
                onChange={handleChangeForm}
                className='h-5 w-5 rounded border-gray-300'
              />

              <span className='text-sm text-gray-700'>فعال باشد</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-end gap-3 border-t p-5'>
          <button
            type='button'
            onClick={() => onClose()}
            className='rounded-xl border border-gray-300 px-5 py-3 transition hover:bg-gray-100'
          >
            انصراف
          </button>

          <button
            onClick={handleSubmit}
            type='button'
            className='rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700'
          >
            ذخیره بلاگ
          </button>
        </div>
      </div>
    </form>
  )
}
