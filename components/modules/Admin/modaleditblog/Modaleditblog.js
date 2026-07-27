import React, { useEffect, useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { FaCheck, FaTrash } from 'react-icons/fa'
import { IoClose, IoAdd, IoImage } from 'react-icons/io5'
import Cardnotification from '../../cardnotification/Cardnotification'
import { UseNotification } from '@/components/hooks/UseNotification'

export default function Modaleditblog ({ isOpen, onClose, post, onEditBloged }) {
  const { notification, showNotification } = UseNotification()

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    slug: '',
    description: '',
    coverImage: '',
    isActive: false
  })

  const [body, setBody] = useState([])
  const [coverPreview, setCoverPreview] = useState('')
  const [subImagesPreview, setSubImagesPreview] = useState([])

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        author: post.author || '',
        slug: post.slug || '',
        description: post.description || '',
        coverImage: post.coverImage || '',
        isActive: post.isActive || false
      })
      setCoverPreview(post.coverImage)
      setBody(post.body)

      const preView = (post.body || []).map(sec => sec.subImages || [])
      setSubImagesPreview(preView)
    }
  }, [post])

  const handleAddBody = () => {
    const newBody = {
      id: crypto.randomUUID(),
      subTitle: '',
      subDescription: '',
      subImages: []
    }

    setBody(prev => [...prev, newBody])
  }
  const handleDeleteBody = id => {
    setBody(prev => prev.filter(item => item.id !== id))
  }

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target

    if (type === 'file') {
      const file = files[0]

      if (file) {
        setFormData(prev => ({ ...prev, coverImage: file }))
        setCoverPreview(URL.createObjectURL(file))
      }
      return
    }

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }))
      return
    }

    setFormData(prev => ({ ...prev, [name]: value }))
  }
  const handleRemoveImage = () => {
    setCoverPreview('')
    setFormData(prev => ({ ...prev, coverImage: '' }))
  }

  const handleChangeBody = (index, feild, value) => {
    setBody(prev => {
      const updated = { ...prev }
      updated[index] = {
        ...updated,
        [feild]: value
      }
      return updated
    })
  }
  const handleSectionImages = (index, files) => {
    const fileArray = Array.from(files)

    setBody(prev => {
      const updated = [...prev]

      updated[index].subImages = [
        ...(updated[index].subImages || []),
        ...fileArray
      ]

      return updated
    })

    const previews = fileArray.map(file => URL.createObjectURL(file))

    setSubImagesPreview(prev => {
      const updated = [...prev]

      updated[index] = [...(updated[index] || []), ...previews]

      return updated
    })
  }

  const handleRemoveSectionImage = (sectionIndex, imageIndex) => {
    setBody(prev => {
      const updated = [...prev]

      updated[sectionIndex].subImages.splice(imageIndex, 1)

      return updated
    })

    setSubImagesPreview(prev => {
      const updated = [...prev]

      updated[sectionIndex].splice(imageIndex, 1)

      return updated
    })
  }

  const handleSubmit = async () => {
    try {
      const FD = new FormData()

      FD.append('title', formData.title)
      FD.append('slug', formData.slug)
      FD.append('author', formData.author)
      FD.append('description', formData.description)
      FD.append('isActive', formData.isActive ? 'true' : 'false')
      FD.append('id', post._id)
      // cover image
      if (formData.coverImage instanceof File) {
        FD.append('coverImage', formData.coverImage)
      }

      const bodyData = body.map((sec, index) => ({
        subTitle: sec.subTitle,
        subDescription: sec.subDescription,

        // فقط عکس های قدیمی (URL)
        oldImages: (sec.subImages || []).filter(img => typeof img === 'string'),

        index
      }))

      FD.append('body', JSON.stringify(bodyData))

      // ارسال عکس های جدید
      body.forEach((section, i) => {
        ;(section.subImages || []).forEach(file => {
          if (file instanceof File) {
            FD.append(`sectionImage${i}`, file)
          }
        })
      })

      // ارسال به API
      const res = await fetch(`/api/blogs/edit`, {
        method: 'PUT',
        body: FD
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'خطا در ویرایش بلاگ')
      }

      showNotification('success', 'بلاگ با موفقیت ادیت شد')

      if (onEditBloged && data?.blog) {
        onEditBloged(data.blog)
      }

   setTimeout(() => {
  onClose()
}, 3000)
    } catch (err) {
      showNotification('error', err.message)
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
              onChange={handleChange}
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
                onChange={handleChange}
                placeholder='نام نویسنده را وارد کنید...'
                className='w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-blue-600'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>اسلاگ</label>

              <input
                type='text'
                placeholder='blog-slug'
                name='slug'
                value={formData.slug}
                onChange={handleChange}
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
              onChange={handleChange}
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
                onChange={handleChange}
                className='hidden'
              />
            </label>
          </div>

          {/* Sections */}
          {body.map((sec, index) => (
            <div key={sec._id || index} className='space-y-8'>
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
                      value={sec.subTitle}
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
                      value={sec.subDescription}
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
                onChange={handleChange}
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
