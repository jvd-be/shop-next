'use client'

import React, { useState, useMemo } from 'react'
import {
  FaStar,
  FaUserTimes,
  FaSortAmountUp,
  FaCheck
} from 'react-icons/fa'
import { FaX } from 'react-icons/fa6'
import Pagenationadminproduct from '@/components/modules/Admin/pagenationadminproduct/Pagenationadminproduct'
import Headeradmin from '@/components/modules/Admin/headeradmin/Headeradmin'
import Rowcommentsadmin from '@/components/modules/Admin/rowcommentsadmin/Rowcommentsadmin'
import UsePagination from '@/components/hooks/UsePagination'
import { UseNotification } from '@/components/hooks/UseNotification'
import Cardnotification from '@/components/modules/cardnotification/Cardnotification'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import Modalreplay from '@/components/modules/Admin/modalreplay/Modalreplay'
import UseCrudActions from '@/components/hooks/UseCrudActions'
import Adminnavbar from '@/components/modules/Admin/adminnavbar/Adminnavbar'

export default function Admincommentswrapper ({ commentsList }) {
  const [comments, setComments] = useState(commentsList)
  const { showNotification, notification } = UseNotification()
  const [searchValue, setSearchValue] = useState('')
  const [sortBy, setSortBy] = useState('none')
  const { selectedItem, isViewOpen, openView, closeView } = UseCrudActions()


  const handleSearchChange = value => {
    setSearchValue(value)
  }

const searchedComment = useMemo(() => {
  if (!searchValue) return comments

  const search = searchValue.toLowerCase().trim()

  return comments.filter(c => {
    const commentText = c.comment?.toLowerCase() || ''
    const phone = String(c.user?.phone || '')
    const name = c.user?.name?.toLowerCase() || ''
    const productTitle = c.product?.title?.toLowerCase() || ''

    return (
      commentText.includes(search) ||
      phone.includes(search) ||
      name.includes(search) ||
      productTitle.includes(search)
    )
  })
}, [comments, searchValue])



  const sortComments = useMemo(() => {
    const currentComments = [...searchedComment]

    if (sortBy === 'newest') {
      return currentComments.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    } else if (sortBy === 'nonAnswer') {
      return currentComments.filter(c => !c.adminReply?.text)
    } else if (sortBy === 'reject') {
      return currentComments.filter(c => c.isApproved === false)
    } else {
      return currentComments
    }
  }, [sortBy, comments, searchedComment, searchValue])
  
  const handleSortChange = sort => {
    setSortBy(sort)
  }
  const handleReplay = id => {
    openView(id)
  }
  const handleStatusChange = async id => {
    try {
      const res = await fetch('/api/review/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      })

      const data = await res.json()
      if (!res.ok) {
        showNotification('error', data.message || 'خطا در تغییر وضعیت نظر')
        return
      }
      showNotification(
        'success',
        data.message || 'تغییر وضعیت با موفقیت انجام شد'
      )
      setComments(prev =>
        prev.map(comment =>
          comment._id === id
            ? {
                ...comment,
                isApproved: data.comment.isApproved
              }
            : comment
        )
      )
    } catch (error) {
      showNotification('error', error.message || 'خطا در تغییر وضعیت نظر')
    }
  }

  const renderStars = rating => {
    return (
      <div className='flex gap-1'>
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`text-sm ${
              index < rating
                ? 'text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    )
  }

  const sortOptions = [
    { label: 'بدون پاسخ ها', value: 'nonAnswer', icon: FaUserTimes },
    {
      label: 'جدیدترین ',
      value: 'newest',
      icon: FaSortAmountUp
    },
    {
      label: 'تایید نشده ها ',
      value: 'reject',
      icon: FaX
    }
  ]

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    indexOfFirstItem,
    indexOfLastItem,
    currentItems
  } = UsePagination(sortComments)
  return (
    <div className='p-6 bg-gray-50 dark:bg-gray-900 min-h-screen'>
      {/* هدر صفحه */}
      <Headeradmin
        title={'مدیریت نظر کاربران'}
        excelactive={true}
        desc={'مشاهده کامنت ها و نظرات کاربران و تایید و رد کامنت ها'}
      />
      <Cardnotification
        show={notification.show}
        title={notification.title}
        color={notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
        Icon={
          notification.type === 'success' ? FaCheck : HiOutlineExclamationCircle
        }
      />

      <Modalreplay
        key={selectedItem}
        isOpen={isViewOpen}
        onClose={closeView}
        comment={comments.find(c => c._id === selectedItem)}
        onReply={updatedComment => {
          setComments(prev =>
            prev.map(c => (c._id === updatedComment._id ? updatedComment : c))
          )
        }}
      />

      {/* باکس جستجو و فیلتر */}
      <Adminnavbar
        sortOptions={sortOptions}
        searchValue={searchValue}
        handleSearchChange={handleSearchChange}
        sortBy={sortBy}
        handleSortChange={handleSortChange}
      />
      {/* جدول نظرات */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-100 dark:border-gray-700'>
        <div className='overflow-x-auto'>
          <table className='w-full text-right'>
            <thead className='bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm uppercase'>
              <tr>
                <th className='p-4'>کاربر</th>
                <th className='p-4'>محصول</th>
                <th className='p-4'>امتیاز</th>
                <th className='p-4'>نظر</th>
                <th className='p-4'>تاریخ</th>
                <th className='p-4'>وضعیت</th>
                <th className='p-4 text-center'>عملیات</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100 dark:divide-gray-700'>
              {currentItems.length > 0 ? (
                currentItems.map(comment => (
                  <Rowcommentsadmin
                    key={comment._id}
                    renderStars={renderStars}
                    comment={comment}
                    handleStatusChange={handleStatusChange}
                    handleReplay={handleReplay}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan='7'
                    className='p-8 text-center text-gray-500 dark:text-gray-400'
                  >
                    نظری یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* بخش پیجینیشن */}
        <div className='p-4 border-t border-gray-100 dark:border-gray-700'>
          <Pagenationadminproduct
            allProducts={totalItems}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            indexOfFirstProduct={indexOfFirstItem}
            indexOfLastProduct={indexOfLastItem}
            name='نظرات'
          />
        </div>
      </div>
    </div>
  )
}
