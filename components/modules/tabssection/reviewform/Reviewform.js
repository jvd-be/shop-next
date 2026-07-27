'use client'
import React from 'react'
import { FaStar } from 'react-icons/fa'

export default function Reviewform ({
  name,
  newReview,
  setNewReview,
  handleSubmitReview
}) {
  const { rating, commentBody } = newReview

  return (
    <form
      onSubmit={handleSubmitReview}
      className='bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 lg:p-6 space-y-4'
    >
      <div>
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
          نام شما
        </label>

        <input
          dir='ltr'
          type='text'
          value={name}
          readOnly
          className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
          امتیاز
        </label>

        <div className='flex gap-1'>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type='button'
              onClick={() =>
                setNewReview(prev => ({
                  ...prev,
                  rating: star
                }))
              }
              className='p-1 hover:scale-110 transition-transform'
            >
              <FaStar
                className={`w-4 h-4 ${
                  star <= rating
                    ? 'text-yellow-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
          نظر شما
        </label>

        <textarea
          value={commentBody}
          onChange={e =>
            setNewReview(prev => ({
              ...prev,
              commentBody: e.target.value
            }))
          }
          className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
          rows={4}
          placeholder='تجربه خرید خود را بنویسید...'
          required
        />
      </div>

      <button
        type='submit'
        className='w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors'
      >
        ثبت نظر
      </button>
    </form>
  )
}
