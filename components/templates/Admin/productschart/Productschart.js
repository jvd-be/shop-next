"use client"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'
import { FaArrowTrendUp ,FaArrowTrendDown,FaMinus } from 'react-icons/fa6'
// نمونه‌ی ساختار داده — این آرایه رو با دیتای واقعی خودتون (از API یا props) جایگزین کنید
// هر آیتم یعنی یک بازه (مثلاً یک ماه) با تعداد محصولات در همون بازه
const sampleData = [
  { name: 'فروردین', 'تعداد محصولات': 18 },
  { name: 'اردیبهشت', 'تعداد محصولات': 22 },
  { name: 'خرداد', 'تعداد محصولات': 20 },
  { name: 'تیر', 'تعداد محصولات': 26 },
  { name: 'مرداد', 'تعداد محصولات': 31 },
  { name: 'شهریور', 'تعداد محصولات': 35 }
]

const formatCount = (value) => new Intl.NumberFormat('fa-IR').format(value)

function CustomTooltip ({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null

  return (
    <div className='bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg p-4 text-right'>
      <p className='font-bold text-gray-800 dark:text-white mb-1'>{label}</p>
      <p className='font-bold text-blue-500 text-sm' dir='ltr'>
        {formatCount(payload[0].value)} محصول
      </p>
    </div>
  )
}

export default function Productschart ({ data  }) {
  const first = data[0]?.['تعداد محصولات'] ?? 0
  const last = data[data.length - 1]?.['تعداد محصولات'] ?? 0
  const diff = last - first
  const percent = first !== 0 ? Math.round((diff / first) * 100) : 0

  const trend = diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat'
  const trendColor =
    trend === 'up' ? '#16a34a' : trend === 'down' ? '#dc2626' : '#9ca3af'
  const trendBg =
    trend === 'up'
      ? 'bg-green-50 dark:bg-green-500/10'
      : trend === 'down'
        ? 'bg-red-50 dark:bg-red-500/10'
        : 'bg-gray-50 dark:bg-gray-500/10'
  const TrendIcon = trend === 'up' ? FaArrowTrendUp : trend === 'down' ? FaArrowTrendDown : FaMinus
  const trendLabel =
    trend === 'up' ? 'روند رو به رشد' : trend === 'down' ? 'روند نزولی' : 'بدون تغییر'

  return (
    <div className='bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 lg:p-8'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h3 className='font-bold text-gray-800 dark:text-white'>
            روند تعداد محصولات
          </h3>
          <span className='text-xs text-gray-400 dark:text-gray-500 font-medium'>
            بر اساس بازه‌ی زمانی
          </span>
        </div>

        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${trendBg}`}>
          <TrendIcon size={16} color={trendColor} />
          <span className='text-xs font-bold' style={{ color: trendColor }} dir='ltr'>
            {diff > 0 ? '+' : ''}{formatCount(percent)}٪
          </span>
        </div>
      </div>

      <p className='text-xs text-gray-400 dark:text-gray-500 mb-4'>{trendLabel}</p>

      <div dir='ltr' className='w-full h-72'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' vertical={false} />
            <XAxis
              dataKey='name'
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
              reversed
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => new Intl.NumberFormat('fa-IR').format(value)}
              orientation='right'
              allowDecimals={false}
            />
            <ReferenceLine y={first} stroke='#e5e7eb' strokeDasharray='4 4' />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb' }} />
            <Line
              type='monotone'
              dataKey='تعداد محصولات'
              stroke={trendColor}
              strokeWidth={3}
              dot={{ r: 4, fill: trendColor, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}