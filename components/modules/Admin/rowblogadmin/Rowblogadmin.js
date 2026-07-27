import React, { useEffect, useState } from 'react'
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaUser,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa'
import Image from 'next/image'
export default function Rowblogadmin ({
  post,
  handleOpenViewBlogModal,
  handleRemoveBlog,
  handleOpenEditBlogModal
}) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <tr className='w-11/12 mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 opacity-50'>
        {/* این بخش شبیه به اسلایدر پیش از لود است تا پرش ایجاد نشود */}
        <td className='aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse'></td>
        <td className='aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse'></td>
        <td className='hidden md:block aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse'></td>
        <td className='hidden md:block aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse'></td>
      </tr>
    )
  }
  return (
    <tr
      key={post.id}
      className='dark:hover:bg-gray-700 hover:bg-gray-100 transition-colors group'
    >
      <td className='p-4'>
        <div className='flex flex-col'>
          <span className='font-medium text-gray-900 dark:text-white text-sm mb-1'>
            {post.title}
          </span>
          <span className='text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-xs'>
            {post.author}
          </span>
        </div>
      </td>
      <td className='p-4 text-sm text-gray-500 aspect-video dark:text-gray-400'>
        <Image
          alt='cover-image'
          src={post.coverImage}
          width={100}
          height={100}
          quality={50}
        />
      </td>
      <td className='p-4'>
        <div className='flex items-center gap-2'>
          <FaUser className='text-gray-400 w-3 h-3' />
          <span className='text-sm text-gray-700 dark:text-gray-300'>
            {post.author}
          </span>
        </div>
      </td>

      <td className='p-4'>
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
            post.isActive
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
          }`}
        >
          {post.isActive ? (
            <FaCheckCircle className='w-3 h-3' />
          ) : (
            <FaClock className='w-3 h-3' />
          )}
          {post.isActive ? 'منتشر شده' : 'پیش‌نویس'}
        </span>
      </td>

      <td className='p-4 text-sm text-gray-500 dark:text-gray-400'>
        {new Date(post.updatedAt).toLocaleString('fa-IR')}
      </td>

      <td className='p-4'>
        <div className='flex items-center gap-2  transition-opacity'>
          <button
            onClick={() => handleOpenViewBlogModal(post._id)}
            className='p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors'
            title='مشاهده در سایت'
          >
            <FaEye />
          </button>
          <button
            onClick={() => handleOpenEditBlogModal(post._id)}
            className='p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors'
            title='ویرایش'
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleRemoveBlog(post._id)}
            className='p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors'
            title='حذف'
          >
            <FaTrash />
          </button>
        </div>
      </td>
    </tr>
  )
}
