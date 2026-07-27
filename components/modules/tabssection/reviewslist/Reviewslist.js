import React from 'react'
import Starrating from '@/components/modules/starrating/Starrating'
import { FaStar } from 'react-icons/fa'
import Avatar from '../../avatar/Avatar'
import { ImReply } from 'react-icons/im'

export default function Reviewslist ({ reviews }) {


  return (
    <div className='space-y-4'>
      {reviews.length !== 0 ? (
        reviews.map(review => (
          <div
            key={review._id}
            className='border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0'
          >
            <div className='flex items-center gap-3 mb-2'>
              <Avatar user={review.user} size={40} />
              <div>
                <p className='font-medium text-gray-900 dark:text-white text-sm'>
                  {review.user.name}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  {review.date}
                </p>
              </div>
              <div className='mr-auto'>
                <Starrating rating={review.rating} />
              </div>
            </div>
            <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed'>
              {review.comment}
            </p>

            {review?.adminReply?.text && (
              <div className='mt-4 pl-4 border-l-4 border-blue-500 bg-gray-50 dark:bg-gray-800/50 rounded-r-xl py-3'>
                <div className='flex items-center gap-2 text-sm'>
                 <ImReply className='text-blue-500 ' />
                  <span className='font-semibold text-gray-700 dark:text-gray-200'>
                    پاسخ ادمین:
                  </span>
                </div>
                <p
                  className='text-gray-600 dark:text-gray-300 mt-1 leading-relaxed'
                  dir='rtl'
                >
                  {review.adminReply.text}
                </p>
              </div>
            )}
          </div>
        ))
      ) : (
        // ==================== Beautiful Empty State ====================
        <div className='bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-3xl py-16 px-8 text-center'>
          <div className='flex flex-col items-center justify-center'>
            {/* Icon Container */}
            <div className='relative mb-8'>
              <div className='w-32 h-32 bg-linear-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-3xl flex items-center justify-center'>
                <FaStar className='fa-solid fa-star text-7xl text-amber-400 dark:text-amber-500' />
              </div>
              <div className='absolute -top-3 -right-3 bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-lg'>
                <i className='fa-solid fa-comment-dots text-4xl text-gray-400 dark:text-gray-500'></i>
              </div>
            </div>

            {/* Text Content */}
            <h3 className='text-2xl font-semibold text-gray-900 dark:text-white mb-3'>
              هنوز نظری ثبت نشده
            </h3>

            <p className='text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed'>
              اولین نفری باشید که نظر خود را در مورد این محصول ثبت می‌کنید
            </p>

            <div className='mt-10 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-3'>
              <div className='flex-1 h-px bg-gray-200 dark:bg-gray-700'></div>
              نظرات واقعی مشتریان
              <div className='flex-1 h-px bg-gray-200 dark:bg-gray-700'></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
