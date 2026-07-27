import React from 'react'
import { FaTimes } from 'react-icons/fa'

function Sizeguide({ sizeGuide, setShowSizeGuide }) {
  return (
    <div
      className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'
      onClick={() => setShowSizeGuide(false)}
    >
      <div
        className='bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl'
        onClick={e => e.stopPropagation()}
      >
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-bold text-gray-900 dark:text-white'>
            راهنمای سایز
          </h2>
          <button
            onClick={() => setShowSizeGuide(false)}
            className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
          >
            <FaTimes className='w-5 h-5 text-gray-500' />
          </button>
        </div>

        <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
          تمام اندازه‌ها بر حسب سانتی‌متر هستند
        </p>

        <table className='w-full text-sm'>
          <thead>
            <tr className='bg-gray-100 dark:bg-gray-700'>
              {sizeGuide.header.map((h, i) => (
                <th
                  key={i}
                  className='py-3 px-2 text-gray-700 dark:text-gray-200 font-medium'
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sizeGuide.rows.map((row, i) => (
              <tr
                key={i}
                className='border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'
              >
                <td className='py-3 px-2 text-center font-medium text-blue-600 dark:text-blue-400'>
                  {row.size}
                </td>
                <td className='py-3 px-2 text-center text-gray-700 dark:text-gray-300'>
                  {row.chest}
                </td>
                <td className='py-3 px-2 text-center text-gray-700 dark:text-gray-300'>
                  {row.length}
                </td>
                <td className='py-3 px-2 text-center text-gray-700 dark:text-gray-300'>
                  {row.waist}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className='text-xs text-gray-500 dark:text-gray-400 mt-4 text-center'>
          در صورت شک بین دو سایز، سایز بزرگ‌تر را انتخاب کنید
        </p>
      </div>
    </div>
  )
}

export default Sizeguide