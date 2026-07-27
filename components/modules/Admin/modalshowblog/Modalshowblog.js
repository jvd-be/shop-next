import React from 'react'
import { IoClose } from 'react-icons/io5'
export default function Modalshowblog ({ onClose, isOpen, post }) {
  if (!isOpen) return null


  return (
    <form
      onClick={() => onClose()}
      className='fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/80 bg-opacity-50 p-4'
    >
      <div
        onClick={e => e.stopPropagation()}
        className='max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl'
      >
        {/* Header */}
        <div className='flex items-center justify-between border-b p-5'>
          <h2 className='text-2xl font-bold text-gray-800'>مشاهده بلاگ</h2>

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
              readOnly
              defaultValue={post.title}
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
                defaultValue={post.author}
                readOnly
                placeholder='نام نویسنده را وارد کنید...'
                className='w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-blue-600'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>اسلاگ</label>

              <input
                type='text'
                defaultValue={post.slug}
                readOnly
                placeholder='blog-slug'
                name='slug'
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
              defaultValue={post.description}
              readOnly
              placeholder='توضیحات کوتاه بلاگ...'
              className='w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-blue-600'
            />
          </div>
          {post.coverImage && (
            <div className=''>
              <img
                src={post.coverImage}
                className='w-full h-24 object-cover rounded-md border border-gray-300'
              />
              <label className='text-sm font-medium text-gray-700'>
                تصویر کاور
              </label>
            </div>
          )}

    


          {/* Sections */}
          {post.body.map((sec, index) => (
            <div key={sec._id} className='space-y-8'>
              <div className='rounded-2xl border border-gray-200 p-5'>
                <div className='mb-5 flex items-center justify-between'>
                  <h3 className='text-lg font-bold text-gray-800'>
                    سکشن {index + 1}
                  </h3>

             
                </div>

                <div className='space-y-5'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      زیرعنوان
                    </label>

                    <input
                      type='text'
                      name='subTitle'
                      readOnly
                          defaultValue={sec.subTitle}
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
                      placeholder='متن سکشن...'
                       readOnly
                          defaultValue={sec.subDescription}
                      className='w-full rounded-xl border border-gray-300 p-3 outline-none transition focus:border-blue-600'
                    />
                  </div>

                  <div className='space-y-3'>
                    {sec.subImages?.length > 0 && (
                      <div className='mt-4 flex flex-wrap gap-3'>
                        {sec.subImages.map((img, imgIndex) => (
                          <div key={imgIndex} className='relative group'>
                            <img
                              src={img}
                              alt=''
                              className='h-24 w-24 rounded-lg border border-gray-300 object-cover'
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <label className='text-sm font-medium text-gray-700'>
                      تصاویر سکشن
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Status */}
          <div className='flex items-center gap-10'>
            <label className='flex items-center gap-3'>
              <input
                type='checkbox'
                readOnly
                name='isActive'
                checked={post.isActive}
                className='h-5 w-5 rounded border-gray-300'
              />

              <span className='text-sm text-gray-700'>فعال باشد</span>
            </label>
          </div>
        </div>
      </div>
    </form>
  )
}
