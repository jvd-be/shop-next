import { FaStar } from 'react-icons/fa'

export default function Starrating({ rating, size = 'w-4 h-4' }) {
  return (
    <div className='flex items-center gap-0.5'>
      {[1, 2, 3, 4, 5].map(star => (
        <FaStar
          key={star}
          className={`${size} ${
            star <= rating
              ? 'text-yellow-400'
              : 'text-gray-300 dark:text-gray-600'
          }`}
        />
      ))}
    </div>
  )
}