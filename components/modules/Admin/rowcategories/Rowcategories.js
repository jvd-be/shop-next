import React from 'react'
import { FaTshirt, FaEdit, FaTrash } from 'react-icons/fa'
import Statusbadge from '../statusbadgue/Statusbadgue'
export default function Rowcategories ({
  cat,
  parentName,
  openEditModal,
  toggleStatus
}) {


  return (
    <tr className='dark:hover:bg-gray-700 hover:bg-gray-100 ease-in duration-75 transition-colors'>
      <td className='p-4 flex items-center gap-3'>
        <div className='w-10 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-sm'>
          {cat.image ? (
            <img
              src={cat.image}
              alt={cat.name}
              className='w-full h-full object-cover'
            />
          ) : (
            <FaTshirt className='text-gray-400' />
          )}
        </div>
        <span className='font-medium text-gray-800 dark:text-gray-200'>
          {cat.name}
        </span>
      </td>
      <td className='p-4 text-gray-600 dark:text-gray-400 font-mono text-sm'>
        {cat.slug}
      </td>
      <td className='p-4'>
        {parentName !== '-' ? (
          <span className='text-gray-600 dark:text-gray-400 text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded'>
            {parentName}
          </span>
        ) : (
          <span className='text-gray-600 text-xs'>ریشه</span>
        )}
      </td>

      <td className='p-4'>
        <button onClick={() => toggleStatus(cat._id)}>
          <Statusbadge status={cat.isActive ? 'فعال' : 'غیرفعال'} />
        </button>
      </td>
      <td className='p-4'>
        <div className='flex justify-center gap-2'>
          <button
            onClick={() => openEditModal(cat)}
            className='p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors'
            title='ویرایش'
          >
            <FaEdit />
          </button>
        </div>
      </td>
    </tr>
  )
}
