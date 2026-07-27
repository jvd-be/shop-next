'use client'
import Adminlayout from '@/components/templates/Admin/adminlayout/Adminlayout'
import React from 'react'
import { FaUsers, FaBox, FaFileAlt, FaChartBar } from 'react-icons/fa'
import Statcard from '@/components/modules/Admin/statcard/Statcard'
import { calculateTrend } from '@/components/utils/helper'
import Userschart from '../userchart/Userchart'
import Productschart from '../productschart/Productschart'

export default function Adminmainpagewrapper ({
  userCount,
  lastMonthUserCount,
  productsCount,
  lastMonthProductsCount,
  articleCount,
  lastMonthArticleCount,
  orderCount,
  lastMonthOrderCount,
  usersData
}) {
  const userTrend = calculateTrend(userCount, lastMonthUserCount)
  const productsTrend = calculateTrend(productsCount, lastMonthProductsCount)
  const articleTrend = calculateTrend(articleCount, lastMonthArticleCount)
  const orderTrend = calculateTrend(orderCount, lastMonthOrderCount)

  // دیتای واقعی محصولات برای نمودار روند: ماه گذشته در مقابل این ماه
  const productsChartData = [
    { name: 'ماه گذشته', 'تعداد محصولات': lastMonthProductsCount },
    { name: 'این ماه', 'تعداد محصولات': productsCount }
  ]

  return (
    <Adminlayout>
      <div className='space-y-6'>
        <div className='bg-linear-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg'>
          <h1 className='text-2xl font-bold mb-2'>سلام، مدیر عزیز! 👋</h1>
          <p className='opacity-90'>
            وضعیت سایت امروز را بررسی کنید. همه چیز طبق برنامه پیش می‌رود.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <Statcard
            title='کل کاربران'
            value={userCount}
            icon={<FaUsers />}
            color='bg-blue-500'
            trend={userTrend.trend}
            isPositive={userTrend.isPositive}
            unit={'نفر'}
          />

          <Statcard
            title='محصولات فعال'
            value={productsCount}
            icon={<FaBox />}
            color='bg-emerald-500'
            trend={productsTrend.trend}
            isPositive={productsTrend.isPositive}
            unit={'محصول'}
          />

          <Statcard
            title='مقالات منتشر شده'
            value={articleCount}
            icon={<FaFileAlt />}
            color='bg-purple-500'
            trend={articleTrend.trend}
            isPositive={articleTrend.isPositive}
            unit={'مقاله'}
          />

          <Statcard
            title='کل سفارش‌ها'
            value={orderCount}
            icon={<FaChartBar />}
            color='bg-amber-500'
            trend={orderTrend.trend}
            isPositive={orderTrend.isPositive}
            unit={'سفارش'}
          />
        </div>

        <div className='grid grid-cols-2 gap-x-3'>
          <Productschart data={productsChartData} />
          <Userschart usersData={usersData} />
        </div>
      </div>
    </Adminlayout>
  )
}