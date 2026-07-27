'use client'
import React, { useState } from 'react'
import { FiUsers, FiDollarSign } from 'react-icons/fi'
import { FaShirt } from 'react-icons/fa6'
import Statcard from '@/components/modules/Admin/statcard/Statcard'
import Headeradmin from '@/components/modules/Admin/headeradmin/Headeradmin'
import Rowstats from '@/components/modules/Admin/rowstats/Rowstats'
import Charts from '@/components/templates/charts/Charts'
import Orderdetailsmodal from '../orderdetailsmodal/Orderdetailsmodal'
import Pagenationadminproduct from '@/components/modules/Admin/pagenationadminproduct/Pagenationadminproduct'
import UsePagination from '@/components/hooks/UsePagination'
import { toJalaali } from 'jalaali-js'

export default function Adminstatswrapper ({
  orders,
  newCustomers,
  openOrders,
  bestSels,
  salesData
}) {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const totalPaid = orders
    .filter(c => c.isPaid === true)
    .reduce((x, y) => x + y.itemsTotal, 0)

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    indexOfFirstItem,
    indexOfLastItem,
    currentItems
  } = UsePagination(orders)

  const bestData = bestSels.map(({ title, soldCount }) => ({
    title,
    soldCount
  }))

const months = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند"
]

const result = {}

salesData.forEach(order => {
  const j = toJalaali(new Date(order.createdAt))

  const key = `${j.jy}-${j.jm}`

  if (!result[key]) {
    result[key] = {
      name: months[j.jm - 1],
      revenue: 0,
      orders: 0
    }
  }

  result[key].revenue += order.itemsTotal
  result[key].orders += 1
})

const sales = Object.values(result)


  return (
    <>
      <div
        className='min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 font-vazir'
        dir='rtl'
      >
        <div className='p-4 border-t border-gray-100 dark:border-gray-700'></div>
        <Headeradmin
          addbtn={false}
          title={'  مدیریت مقالات'}
          excelactiv={false}
          desc={'مشاهده و بررسی نمودار ها و خرید و فروش'}
        />

        {/* کارت‌های آمار */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10'>
          <Statcard
            title='کل فروش'
            value={totalPaid.toLocaleString()}
            unit='تومان'
            icon={<FiDollarSign className='w-6 h-6 text-white' />}
            trend='+۱۵.۳٪'
            isPositive={true}
            color='bg-purple-600'
          />
          <Statcard
            title='مشتریان جدید'
            value={newCustomers}
            unit='نفر'
            icon={<FiUsers className='w-6 h-6 text-white' />}
            trend='+۸.۱٪'
            isPositive={true}
            color='bg-pink-500'
          />
          <Statcard
            title='سفارشات باز'
            value={openOrders}
            unit='سفارش'
            icon={<FaShirt className='w-6 h-6 text-white' />}
            trend='-۴.۲٪'
            isPositive={false}
            color='bg-indigo-500'
          />
        </div>

        {/* بخش نمودارها */}
        <Charts bestData={bestData} revenueData={sales} />
        {/* جدول آخرین سفارشات */}
        <div className='bg-gray-50 dark:bg-gray-900 dark:text-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-lg font-bold text-gray-800 flex items-center gap-2 dark:text-gray-50'>
              <span className='w-2 h-6 bg-emerald-500 rounded-full '></span>
              آخرین سفارشات
            </h2>
            <button className='text-purple-600 hover:text-purple-800 text-sm font-medium px-4 py-2 hover:bg-purple-50 rounded-lg transition border border-transparent hover:border-purple-100'>
              مشاهده همه
            </button>
          </div>

          <div className='overflow-x-auto rounded-xl border border-gray-100 bg-gray-50 dark:bg-gray-900'>
            <table className='w-full text-right'>
              <thead>
                <tr className='dark:bg-gray-800 text-gray-700 dark:text-gray-50 text-sm'>
                  <th className='py-4 px-6 font-semibold'>مشتری</th>
                  <th className='py-4 px-6 font-semibold'>شماره</th>
                  <th className='py-4 px-6 font-semibold'>محصول</th>
                  <th className='py-4 px-6 font-semibold'>مبلغ</th>
                  <th className='py-4 px-6 font-semibold'>شهر</th>
                  <th className='py-4 px-6 font-semibold'>وضعیت</th>
                  <th className='py-4 px-6 font-semibold'>نمایش</th>
                  <th className='py-4 px-6 font-semibold'>تاریخ</th>
                </tr>
              </thead>
              <tbody className='text-sm text-gray-700 divide-y bg-gray-50 dark:bg-gray-900 divide-gray-50'>
                {currentItems.map(transaction => (
                  <Rowstats
                    key={transaction._id}
                    transaction={transaction}
                    setSelectedOrder={setSelectedOrder}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <Orderdetailsmodal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        </div>
      </div>
      <Pagenationadminproduct
        allProducts={totalItems}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        indexOfFirstProduct={indexOfFirstItem}
        indexOfLastProduct={indexOfLastItem}
        name='سفارشات'
      />
    </>
  )
}
