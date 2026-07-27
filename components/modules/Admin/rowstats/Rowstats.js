import React from 'react'
import Statusbadge from '../statusbadgue/Statusbadgue'
import { FaEye } from 'react-icons/fa'

export default function Rowstats ({ transaction, setSelectedOrder }) {
  const statusMap = {
    PROCESSING: 'در حال آماده‌سازی',
    SHIPPED: 'ارسال شده'
  }
  const trueAddress = transaction.user.addresses.filter(
    i => i.isDefault === true
  )

  return (
    <tr className='hover:bg-purple-50/30 transition-colors bg-gray-50 dark:bg-gray-900'>
      <td className='py-4 px-6 font-medium text-gray-900 dark:text-gray-50'>
        {transaction.user.name || transaction.user.phone}
      </td>

      <td className='py-4 px-6 text-gray-600 dark:text-gray-50'>
        {transaction.user.phone}
      </td>

      <td className='py-4 px-6'>
        {transaction.items.map(item => (
          <div key={item._id} className='mb-2'>
            <div>{item.product.title}</div>
            <div className='text-xs text-gray-500'>
              رنگ: {item.colorName} | سایز: {item.size} | تعداد: {item.quantity}{' '}
              عدد
            </div>
          </div>
        ))}
      </td>

      <td className='py-4 px-6 font-mono font-medium text-gray-800 dark:text-gray-50'>
        {transaction.totalAmount.toLocaleString('fa-IR')}
        <span className='text-xs mr-1 text-gray-400'> تومان</span>
      </td>
      <td className='py-4 px-6 font-mono font-medium text-gray-800 dark:text-gray-50'>
        {trueAddress[0].city}
      </td>

      <td className='py-4 px-6'>
        <Statusbadge
          status={
            transaction.status === 'PROCESSING'
              ? 'در حال پردازش'
              : transaction.status === 'CANCELLED'
              ? 'لغو شده'
              : 'ارسال شده'
          }
        />
      </td>
      <td className='py-4 px-6'>
        <button
          onClick={() => {
            setSelectedOrder(transaction)
          }}
        >
          <FaEye className='text-blue-500 hover:text-blue-700 ' />
        </button>
      </td>

      <td className='py-4 px-6 text-gray-500 dark:text-gray-50'>
        {new Date(transaction.createdAt).toLocaleDateString('fa-IR')}
      </td>
    </tr>
  )
}
