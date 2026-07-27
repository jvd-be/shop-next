"use client"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

// نمونه‌ی ساختار داده — با دیتای واقعی جایگزین کنید (تعداد کاربران ثبت‌نام‌شده در هر ماه)
const sampleData = [
  { name: 'فروردین', 'کاربران جدید': 90 },
  { name: 'اردیبهشت', 'کاربران جدید': 110 },
  { name: 'خرداد', 'کاربران جدید': 100 },
  { name: 'تیر', 'کاربران جدید': 125 },
  { name: 'مرداد', 'کاربران جدید': 160 },
  { name: 'شهریور', 'کاربران جدید': 140 }
]

const formatCount = (value) => `${new Intl.NumberFormat('fa-IR').format(value)} نفر`

function CustomTooltip ({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null

  return (
    <div className='bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg p-4 text-right'>
      <p className='font-bold text-gray-800 dark:text-white mb-1'>{label}</p>
      <span className='font-bold text-indigo-600 dark:text-indigo-400' dir='ltr'>
        {formatCount(payload[0].value)}
      </span>
    </div>
  )
}

// نقطه‌ی سفارشی روی خط: اگه نسبت به ماه قبل رشد داشته باشه سبز، اگه افت داشته باشه قرمز
function CustomDot (props) {
  const { cx, cy, index, payload, dataArray } = props

  if (index === 0) {
    return <circle cx={cx} cy={cy} r={5} fill='#6366f1' stroke='#fff' strokeWidth={2} />
  }

  const prevValue = dataArray[index - 1]['کاربران جدید']
  const currentValue = payload['کاربران جدید']
  const isUp = currentValue >= prevValue

  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill={isUp ? '#22c55e' : '#ef4444'}
      stroke='#fff'
      strokeWidth={2}
    />
  )
}

export default function Userschart ({ usersData  }) {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 lg:p-8'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='font-bold text-gray-800 dark:text-white'>
          روند کاربران جدید ماهانه
        </h3>
        <span className='text-xs text-gray-400 dark:text-gray-500 font-medium'>
          تغییر نسبت به ماه قبل
        </span>
      </div>

      <div dir='ltr' className='w-full h-80'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={usersData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
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
              tickFormatter={(value) => new Intl.NumberFormat('fa-IR', { notation: 'compact' }).format(value)}
              orientation='right'
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }} />
            <Line
              type='monotone'
              dataKey='کاربران جدید'
              stroke='#6366f1'
              strokeWidth={2.5}
              dot={(props) => <CustomDot key={props.index} {...props} dataArray={usersData} />}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
