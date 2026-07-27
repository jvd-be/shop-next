import React from 'react'

export default function Orderslist() {
  return (
   <div className="overflow-x-auto">
      <table className="w-full text-sm text-right">
        <thead className="bg-gray-100 text-gray-700 uppercase">
          <tr>
            <th className="px-4 py-3">کد سفارش</th>
            <th className="px-4 py-3">مبلغ</th>
            <th className="px-4 py-3">وضعیت</th>
            <th className="px-4 py-3">تاریخ</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          <tr>
            <td className="px-4 py-3 font-medium">#ORD-12345</td>
            <td className="px-4 py-3">۵۰۰,۰۰۰ تومان</td>
            <td className="px-4 py-3"><span className="bg-green-100 text-green-700 px-2 py-1 rounded">تکمیل شده</span></td>
            <td className="px-4 py-3">۱۴۰۲/۰۳/۱۲</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
