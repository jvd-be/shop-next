'use client'
import {
  PieChart,
  ResponsiveContainer,
  Pie,
  Tooltip,
  Legend,
  Cell
} from 'recharts'
export default function Piechart ({ bestData }) {
  // رنگ‌بندی هماهنگ با تم بنفش/صورتی
  const COLORS = ['#8b5cf6', '#ec4899', '#f43f5e', '#6366f1']
const total=bestData.reduce((x,y)=>x+y.soldCount,0)
  return (
    <div className='bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100'>
      <h2 className='text-lg font-bold text-gray-800 dark:text-gray-50 mb-6 flex items-center gap-2'>
        <span className='w-2 h-6 bg-pink-500 rounded-full'></span>
        محبوب‌ترین‌ها
      </h2>
      <div className='h-60 w-full relative dark:text-gray-50'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={bestData}
              cx='50%'
              cy='50%'
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey='soldCount'
              nameKey="title"
              stroke='none'
              labelLine={false}
            >
              {bestData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              verticalAlign='bottom'
              height={36}
              iconType='circle'
              formatter={title => (
                <span className='text-sm dark:text-gray-50 text-gray-600 mr-2'>{title}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none'>
          <span className='text-2xl font-bold text-gray-800 block dark:text-gray-50'>{total}</span>
          <p className='text-xs text-gray-400 dark:text-gray-50'>قلم فروش</p>
        </div>
      </div>
    </div>
  )
}
