import { FaCheck } from 'react-icons/fa'
export default function Features ({ features }) {
  return (
    <div className='grid grid-cols-2 gap-2 lg:gap-3'>
      {features.map((feature, index) => (
        <div
          key={index}
          className='flex items-center gap-2 text-xs lg:text-sm text-gray-600 dark:text-gray-400'
        >
          <FaCheck className='w-4 h-4 text-green-500 dark:text-green-400 shrink-0' />
          <span className='truncate'>{feature}</span>
        </div>
      ))}
    </div>
  )
}
