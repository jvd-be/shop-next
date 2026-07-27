import React from 'react'
import { FaTrashAlt } from 'react-icons/fa'
export default function Deletemodal ({
  onCancel,
  onConfirm,
  confirmDelete,
  desc,
  title,
  Icon = FaTrashAlt,
  textConfirmBtn = 'حذف'
}) {
  if (!confirmDelete) return null
  return (
    <div
      onClick={onCancel}
      className='fixed inset-0 bg-black/50 z-700 flex items-center justify-center p-4 animate-fadeIn'
    >
      <div
        onClick={e => e.stopPropagation()}
        className='bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scaleIn'
      >
        <div className='w-14 h-14 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4'>
          <Icon className='w-7 h-7 text-red-500' />
        </div>
        <h3 className='text-lg font-bold text-gray-900 dark:text-white text-center mb-2'>
          {title}
        </h3>
        <p className='text-gray-500 dark:text-gray-400 text-center mb-6'>
          {desc}
        </p>
        <div className='flex gap-3'>
          <button
            onClick={onCancel}
            className='flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-colors'
          >
            انصراف
          </button>
          <button
            onClick={() => onConfirm(confirmDelete)}
            className='flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors'
          >
            {textConfirmBtn}
          </button>
        </div>
      </div>
    </div>
  )
}
