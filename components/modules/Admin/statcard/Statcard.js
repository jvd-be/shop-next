import { FiTrendingDown, FiTrendingUp } from "react-icons/fi"

const shadowMap = {
  'bg-blue-500': 'shadow-blue-500/20',
  'bg-emerald-500': 'shadow-emerald-500/20',
  'bg-purple-500': 'shadow-purple-500/20',
  'bg-amber-500': 'shadow-amber-500/20',
  'bg-red-500': 'shadow-red-500/20',
}

export default function Statcard ({ title, value, unit, icon, trend, isPositive, color }) {
  return (
    <div className='bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group'>
      <div className='flex justify-between items-start mb-4'>
        <div>
          <p className='text-gray-500 dark:text-gray-50 text-sm font-medium mb-1'>{title}</p>
          <div className='flex items-baseline gap-1'>
            <h3 className='text-2xl font-bold dark:text-gray-50 text-gray-800'>{value}</h3>
            <span className='text-sm font-normal dark:text-gray-50 text-gray-400'>{unit}</span>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${color} shadow-lg ${shadowMap[color] || ''} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <div className='flex items-center text-sm border-t border-gray-50 pt-3'>
        <span className={`flex items-center font-bold ${isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
          {isPositive ? (
            <FiTrendingUp className='w-4 h-4 ml-1' />
          ) : (
            <FiTrendingDown className='w-4 h-4 ml-1' />
          )}
          {trend}
        </span>
        <span className='text-gray-400 mr-2 text-xs dark:text-gray-50'>نسبت به ماه قبل</span>
      </div>
    </div>
  )
}