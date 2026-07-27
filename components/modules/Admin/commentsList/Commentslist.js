import React from 'react'

export default function Commentslist() {
  return (
   <div className="space-y-4">
      {[1, 2].map((item) => (
        <div key={item} className="p-4 border rounded-lg bg-gray-50">
          <div className="flex justify-between mb-2">
            <span className="font-bold text-blue-600">بلاگ: آموزش برنامه نویسی</span>
            <span className="text-xs text-gray-400">۲ ساعت پیش</span>
          </div>
          <p className="text-gray-700">این یک متن نمونه برای کامنت کاربر است که در اینجا نمایش داده می‌شود.</p>
        </div>
      ))}
    </div>
  )
}
