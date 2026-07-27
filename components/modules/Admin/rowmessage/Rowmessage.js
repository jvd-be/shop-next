import React from 'react'
import { FaReply } from 'react-icons/fa'
import { formatDate } from '@/components/utils/helper'
import Avatar from '../../avatar/Avatar'

export default function Rowmessage ({
  msg,
  openMessageModal,
  handleStatusChange
}) {
  const displayStatus = msg.displayStatus || msg.status

  const statusStyles = {
    open: {
      label: 'باز',
      className:
        'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700'
    },
    unread: {
      label: 'خوانده نشده',
      className:
        'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700'
    },
    answered: {
      label: 'پاسخ داده شده',
      className:
        'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
    },
    closed: {
      label: 'بسته شده',
      className:
        'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
    }
  }

  const currentStatusStyle = statusStyles[displayStatus] || statusStyles.open

  return (
    <tr
      className={`dark:hover:bg-gray-700 hover:bg-gray-100 transition-colors ${
        displayStatus === 'unread'
          ? 'bg-indigo-50/50 dark:bg-indigo-900/10'
          : ''
      }`}
    >
      <td className='p-4 flex items-center gap-3'>
        <Avatar user={msg.user} />
        <h3>{msg?.user?.name || msg.user?.phone || 'کاربر نامشخص'}</h3>
      </td>

      <td className='p-4'>
        <div className='font-medium text-gray-800 dark:text-gray-200'>
          {msg?.category?.title || 'بدون دسته‌بندی'}
        </div>
      </td>

      <td className='p-4'>
        <div className='text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs'>
          {msg.lastMessage}
        </div>
      </td>

      <td className='p-4 text-gray-600 dark:text-gray-400 text-sm whitespace-nowrap'>
        {formatDate(msg.createdAt)}
      </td>

      <td className='p-4'>
        <select
          className={`
    flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-lg border
    outline-none cursor-pointer transition-all duration-200
    hover:shadow-sm focus:ring-2 focus:ring-offset-1
    ${currentStatusStyle.className}
  `}
          value={displayStatus}
          onChange={e => handleStatusChange(msg._id, e.target.value)}
        >
          <option value='open'>🔵 باز</option>
          <option value='unread'>🟠 خوانده نشده</option>
          <option value='answered'>🟢 پاسخ داده شده</option>
          <option value='closed'>⚫ بسته شده</option>
        </select>
      </td>

      <td className='p-4'>
        <div className='flex justify-center gap-2'>
          <button
            onClick={() => openMessageModal(msg)}
            className='p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors'
            title='مشاهده پیام و پاسخ'
          >
            <FaReply />
          </button>
        </div>
      </td>
    </tr>
  )
}
