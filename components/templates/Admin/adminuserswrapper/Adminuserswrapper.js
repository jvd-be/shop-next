'use client'

import React, { useState, useMemo } from 'react'
import {
  FaList,
  FaUserCheck,
  FaUserTimes,
  FaUserShield,
  FaCheck,
  FaSortAmountDown,
  FaCalendarAlt,
  FaBan
} from 'react-icons/fa'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import Pagenationadminproduct from '@/components/modules/Admin/pagenationadminproduct/Pagenationadminproduct'
import Headeradmin from '@/components/modules/Admin/headeradmin/Headeradmin'
import Adminnavbar from '@/components/modules/Admin/adminnavbar/Adminnavbar'
import Rowusers from '@/components/modules/Admin/rowusers/Rowusers'
import Modaluserdetails from '@/components/modules/Admin/modaluserdetails/Modaluserdetails'
import UsePagination from '@/components/hooks/UsePagination'
import UseCrudActions from '@/components/hooks/UseCrudActions'
import { findById } from '@/components/utils/helper'
import { UseNotification } from '@/components/hooks/UseNotification'
import Cardnotification from '@/components/modules/cardnotification/Cardnotification'
const userSortOptions = [
  {
    label: 'همه',
    value: 'none',

    icon: FaList
  },
  {
    label: 'جدیدترین کاربران',
    value: 'newest',

    icon: FaSortAmountDown
  },
  {
    label: 'قدیمی ترین کاربران',
    value: 'oldest',

    icon: FaCalendarAlt
  },
  {
    label: 'کاربران فعال',
    value: 'active',

    icon: FaUserCheck
  },
  {
    label: 'کاربران غیرفعال',
    value: 'not_active',

    icon: FaUserTimes
  },
  {
    label: 'ادمین ها',
    value: 'admin',

    icon: FaUserShield
  },

  {
    label: 'کاربران بن شده',
    value: 'banned',

    icon: FaBan
  }
]

export default function Adminuserswrapper ({ initialUsers,adminRole }) {
  const { selectedItem, isViewOpen, openView, closeView } = UseCrudActions()
  const { showNotification, notification } = UseNotification()
  const [users, setUsers] = useState(initialUsers)
  const [sortBy, setSortBy] = useState('none')
  const [searchValue, setSearchValue] = useState('')

  const searchedUsers = useMemo(() => {
    if (!searchValue) return users

    const lowerCaseSearch = searchValue.toLocaleLowerCase().trim()

    return users.filter(
      user =>
        user.name?.toLowerCase().includes(lowerCaseSearch) ||
        user.phone?.toLowerCase().includes(lowerCaseSearch)
    )
  }, [searchValue, users])

  const sortedAndFilteredUsers = useMemo(() => {
    const currentUsers = [...searchedUsers]

    if (sortBy === 'newest') {
      currentUsers.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
    } else if (sortBy === 'oldest') {
      currentUsers.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      })
    } else if (sortBy === 'admin') {
      return currentUsers.filter(user => user.role === 'ADMIN')
    } else if (sortBy === 'banned') {
      return currentUsers.filter(user => user.isBanned === true)
    } else if (sortBy === 'not_active') {
      return currentUsers.filter(user => user.isActive === false)
    } else if (sortBy === 'active') {
      return currentUsers.filter(user => user.isActive === true)
    }

    return currentUsers
  }, [users, sortBy, searchValue, searchedUsers])

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    indexOfFirstItem,
    indexOfLastItem,
    currentItems
  } = UsePagination(sortedAndFilteredUsers)

  const handleSearchChange = value => {
    setSearchValue(value)
  }
  const handleSortChange = value => {
    setSortBy(value)
  }

  const handleShowUser = id => {
    const user = findById(users, id)
    openView(user)
  }

  const handleToggleStatus = async id => {
    try {
      const res = await fetch('/api/user/edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      if (res.ok) {
        showNotification('success', 'وضعیت با موفقیت تغییر کرد')
        setUsers(prev =>
          prev.map(user =>
            user._id === id ? { ...user, isActive: !user.isActive } : user
          )
        )
      } else {
        showNotification('error', 'خطایی در تغییر وضعیت رخ داده است')
      }
    } catch (error) {
      showNotification('error', 'خطا در ارتباط با سرور')
    }
  }

  const handleToggleBan = async id => {
    try {
      const res = await fetch('/api/user/ban', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      if (res.ok) {
        showNotification('success', 'وضعیت با موفقیت تغییر کرد')
        setUsers(prev =>
          prev.map(user =>
            user._id === id ? { ...user, isBanned: !user.isBanned } : user
          )
        )
      } else {
        showNotification('error', 'خطایی در تغییر وضعیت رخ داده است')
      }
    } catch (error) {
      showNotification('error', 'خطا در ارتباط با سرور')
    }
  }
  return (
    <div className='p-6 bg-gray-50 dark:bg-gray-900 min-h-screen'>
      {/* هدر صفحه */}

      <Headeradmin
        excelactive={true}
        addbtn={true}
        title={'مدیریت کاربران'}
        desc={
          'مدیریت کاربران اضافه کردن و بن کردن و ارتقا به ادمین سایت و بررسی کاربران '
        }
        btncontent={'افزودن کاربر جدید'}
      />

      <Adminnavbar
        filterActive={true}
        searchValue={searchValue}
        sortOptions={userSortOptions}
        handleSearchChange={handleSearchChange}
        handleSortChange={handleSortChange}
        sortBy={sortBy}
      />

      <Cardnotification
        show={notification.show}
        title={notification.title}
        color={notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
        Icon={
          notification.type === 'success' ? FaCheck : HiOutlineExclamationCircle
        }
      />
      {/* جدول کاربران */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-100 dark:border-gray-700'>
        <div className='overflow-x-auto'>
          <table className='w-full text-right'>
            <thead className='bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm uppercase'>
              <tr>
                <th className='p-4'>کاربر</th>
                <th className='p-4'>تلفن</th>
                <th className='p-4'>ایمیل</th>
                <th className='p-4'>نقش</th>
                <th className='p-4'>وضعیت</th>
                <th className='p-4'>مسدود</th>
                <th className='p-4 text-center'>عملیات</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100 dark:divide-gray-700'>
              {currentItems?.length > 0 ? (
                currentItems?.map((user, index) => (
                  <Rowusers
                    user={user}
                    adminRole={adminRole}
                    key={user._id || index}
                    isActive={user.isActive ? 'فعال' : 'غیرفعال'}
                    handleShowUser={handleShowUser}
                    handleToggleStatus={handleToggleStatus}
                    handleToggleBan={handleToggleBan}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan='6'
                    className='p-8 text-center text-gray-500 dark:text-gray-400'
                  >
                    کاربری یافت نشد.
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
            name='کاربر'
          />
        </div>
      </div>

      <Modaluserdetails
        isOpen={isViewOpen}
        adminRole={adminRole}
        selectedUser={selectedItem}
        onClose={closeView}
      />
    </div>
  )
}
