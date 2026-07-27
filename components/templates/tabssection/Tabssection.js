'use client'
import React, { useState } from 'react'
import Descriptionsection from '@/components/modules/tabssection/descriptionsection/Descriptionsection'
import Reviewslist from '@/components/modules/tabssection/reviewslist/Reviewslist'
import Reviewform from '@/components/modules/tabssection/reviewform/Reviewform'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function Tabssection ({
  tabs,
  description,
  product,
  reviews,
  setReviews,
  user
}) {
  const [newReview, setNewReview] = useState({
 
    commentBody: '',
    rating: 5
  })

  const pathname = usePathname()


  const [activeTab, setActiveTab] = useState('description')
  const [showReviewForm, setShowReviewForm] = useState(false)

 const handleSubmitReview = async e => {
  e.preventDefault()

  if (!newReview.commentBody) return
console.log(product._id, newReview)

  try {
    const res = await fetch('/api/review/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: product._id,
        rating: newReview.rating,
        commentBody: newReview.commentBody
      })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || 'خطا در ثبت نظر')
      return
    }

    setReviews(prev => [data.review, ...prev])

    // ✅ ریست فرم
    setNewReview({
      commentBody: '',
      rating: 5
    })

    setShowReviewForm(false)

  } catch (error) {
    console.error(error)
    alert('خطا در ارتباط با سرور')
  }
}

  return (
    <div className='mt-6 mb-24 md:mb-0 lg:mt-10 bg-white dark:bg-gray-800 rounded-xl lg:rounded-2xl shadow-sm overflow-hidden transition-colors'>
      {/* Tabs Navigation */}
      <div className='flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto'>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-25 py-3 lg:py-4 px-4 lg:px-6 text-sm lg:text-base text-center font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className='p-4 lg:p-6'>
        {/* توضیحات */}
        {activeTab === 'description' && (
          <Descriptionsection description={description} />
        )}

        {/* نظرات */}
        {}
        {activeTab === 'reviews' && (
          <div className='space-y-6'>
            {/* Add Review Button */}
            <div className='flex justify-between items-center'>
              <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                نظرات کاربران
              </h3>
              {user ? (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className='px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm rounded-lg transition-colors'
                >
                  {showReviewForm ? 'انصراف' : 'ثبت نظر'}
                </button>
              ) : (
                <Link
                  className='px-4 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm rounded-lg transition-colors'
                  href={`/login?redirect=${encodeURIComponent(pathname)}`}
                >
                  برای ثبت نظر لطفا ثبت نام کنید
                </Link>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <Reviewform
                name={
                  user?.name
                    ? user.name
                    : user?.phone
                    ? ` کاربر:${user.phone.slice(0, 2)}*****${user.phone.slice(
                        -4
                      )}`
                    : 'کاربر'
                }
                handleSubmitReview={handleSubmitReview}
                setNewReview={setNewReview}
                newReview={newReview}
              />
            )}

            {/* لیست نظرات */}
            <Reviewslist reviews={reviews} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Tabssection
