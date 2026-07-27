import React from 'react'
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'
import Statusbadge from '../statusbadgue/Statusbadgue'

export default function Rowproductadmin ({
  id,
  totalQuantity,
  title,
  isActive,
  date,
  category,
  price,
  finalPrice,
  discount,
  isFeatured,
  image,
  showEye,
  handleRemoveProduct,
  handleEditModal
}) {
  const eyehandeler = id => {
    showEye(id)
  }

  const hasDiscount = Number(discount) > 0

  return (
    <tr className='dark:hover:bg-gray-700 hover:bg-gray-100 transition-colors group'>
      <td className='p-4'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-600 overflow-hidden shrink-0'>
            <img
              src={image}
              alt={title}
              className='w-full h-full object-cover'
            />
          </div>

          <span className='font-medium text-gray-900 dark:text-white text-sm'>
            {title}
          </span>
        </div>
      </td>

      <td className='p-4 text-sm text-gray-600 dark:text-gray-300'>
        {category}
      </td>

      {/* قیمت */}
      <td className='p-4'>
        {hasDiscount ? (
          <div className='flex flex-col text-sm'>
            <span className='line-through text-gray-400'>
              {price?.toLocaleString('fa-IR')} تومان
            </span>

            <span className='font-bold text-green-600'>
              {finalPrice?.toLocaleString('fa-IR')} تومان
            </span>
          </div>
        ) : (
          <span className='text-sm font-bold text-gray-900 dark:text-white'>
            {price?.toLocaleString('fa-IR')} تومان
          </span>
        )}
      </td>

      <td className='p-4'>
        <span
          className={`text-sm ${
            totalQuantity === 0
              ? 'text-red-500 font-bold'
              : 'text-gray-600 dark:text-gray-300'
          }`}
        >
          {totalQuantity === 0 ? 'ناموجود' : `${totalQuantity} عدد`}
        </span>
      </td>

      <td className='p-4'>
        <Statusbadge status={isActive} />
      </td>

      <td className='p-4'>
        <Statusbadge status={isFeatured} />
      </td>

      {/* درصد تخفیف */}
      <td className='p-4'>
        <span
          className={`text-sm ${
            discount === 0
              ? 'text-gray-400'
              : 'text-green-600 font-bold'
          }`}
        >
          {discount}%
        </span>
      </td>

      <td className='p-4 text-sm text-gray-500 dark:text-gray-400'>
        {new Date(date).toLocaleString('fa-IR')}
      </td>

      <td className='p-4'>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => eyehandeler(id)}
            className='p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors'
            title='مشاهده'
          >
            <FaEye />
          </button>

          <button
            onClick={() => handleEditModal(id)}
            className='p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors'
            title='ویرایش'
          >
            <FaEdit />
          </button>

          <button
            onClick={() => handleRemoveProduct(id)}
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
