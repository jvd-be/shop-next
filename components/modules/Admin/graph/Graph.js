'use client'
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
} from 'recharts'

// تولتیپ سفارشی با پشتیبانی از دارک‌مود
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">{label}</p>
        <p className="text-sm text-purple-600 dark:text-purple-400">
          فروش: {payload[0].value.toLocaleString('fa-IR')} تومان
        </p>
        {payload[0].payload.orders && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            تعداد سفارش: {payload[0].payload.orders.toLocaleString('fa-IR')}
          </p>
        )}
      </div>
    )
  }
  return null
}

export default function Graph({ revenueData }) {
  return (
    <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-50 flex items-center gap-2">
          <span className="w-2 h-6 bg-purple-600 rounded-full"></span>
          روند فروش ماهانه
        </h2>
   
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={revenueData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6b7280' }}
            />

            <YAxis
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                value >= 1000000
                  ? `${(value / 1000000).toLocaleString('fa-IR')}M`
                  : `${(value / 1000).toLocaleString('fa-IR')}k`
              }
              tick={{ fill: '#6b7280' }}
            />

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              className="dark:stroke-gray-700"
              vertical={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#8b5cf6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}