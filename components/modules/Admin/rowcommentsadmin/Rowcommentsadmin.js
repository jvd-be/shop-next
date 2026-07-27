import React from 'react'
import { FaUser, FaTrash, FaBoxOpen, FaReply } from 'react-icons/fa'
import { formatDate } from '@/components/utils/helper'
export default function Rowcommentsadmin ({
  renderStars,
  handleStatusChange,
  comment,
  handleReplay
}) {
  return (
    <tr
      key={comment._id}
      className='transition-colors dark:hover:bg-gray-700 hover:bg-gray-200 ease-in duration-75 '
    >
      <td className='p-4'>
        <div className='flex items-center gap-2'>
          <FaUser className='text-gray-400' />
          <div>
            <span className='block font-medium text-gray-800 dark:text-gray-200'>
              {comment?.user?.name || comment?.user?.phone || 'کاربر نامشخص'}
            </span>
            <span className='text-xs text-gray-500 dark:text-gray-400'>
              {comment.userEmail}
            </span>
          </div>
        </div>
      </td>
      <td className='p-4'>
        <div className='flex items-center gap-2 text-gray-700 dark:text-gray-300'>
          <FaBoxOpen className='text-gray-400 text-xs' />
          <span className='text-sm'>
            {comment?.product?.title || 'محصول نامشخص'}
          </span>
        </div>
      </td>
      <td className='p-4'>{renderStars(comment.rating)}</td>
      <td className='p-4 text-gray-600 dark:text-gray-400 text-sm max-w-xs line-clamp-2'>
        {comment.comment || 'بدون متن'}
      </td>
      <td className='p-4 text-gray-600 dark:text-gray-400 text-sm whitespace-nowrap'>
        {formatDate(comment.updatedAt)}
      </td>
      <td className='p-4'>
        <button
          type='button'
          onClick={() => handleStatusChange(comment._id, !comment.isApproved)}
          className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
            comment.isApproved
              ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
              : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
          }`}
        >
          {comment.isApproved ? 'منتشر شده' : 'منتشر نشده'}
        </button>
      </td>
      <td className='p-4'>
        <div className='flex justify-center gap-2'>
          <button
            onClick={() => handleReplay(comment._id)}
            className='p-2 flex items-center justify-center text-blue-600 hover:bg-rose-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors'
            title='پاسخ'
          >
            <span className='text-xs mb-4'>
              {comment?.adminReply ? 'ویرایش پاسخ' : 'پاسخ به کامنت'}
            </span>
            <FaReply />
          </button>
        </div>
      </td>
    </tr>
  )
}
