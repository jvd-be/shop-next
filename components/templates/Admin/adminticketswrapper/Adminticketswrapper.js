'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  FaCheck,
  FaSortAmountDown,
  FaSortAmountUp,
  FaQuestionCircle,
  FaReply,
  FaEnvelopeOpenText,
  FaLock
} from 'react-icons/fa'
import Pagenationadminproduct from '@/components/modules/Admin/pagenationadminproduct/Pagenationadminproduct'
import Headeradmin from '@/components/modules/Admin/headeradmin/Headeradmin'
import Rowmessage from '@/components/modules/Admin/rowmessage/Rowmessage'
import Modalmessage from '@/components/modules/Admin/modalmessage/Modalmessage'
import Cardnotification from '@/components/modules/cardnotification/Cardnotification'
import { UseNotification } from '@/components/hooks/UseNotification'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import UsePagination from '@/components/hooks/UsePagination'
import Productadminnavbar from '@/components/modules/Admin/adminnavbar/Adminnavbar'

export default function Adminticketswrapper ({ ticketsList = [] }) {
  const [tickets, setTickets] = useState(ticketsList)

  const { showNotification, notification } = UseNotification()
  const [searchValue, setSearchValue] = useState('')
  const [sortBy, setSortBy] = useState('none')
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)

  const getMessageId = message => {
    return message?._id || message?.id
  }

  const getLastMessage = ticket => {
    return ticket?.messages?.[ticket.messages.length - 1]
  }
const getTicketDisplayStatus = ticket => {
  const lastMessage = getLastMessage(ticket)

  if (ticket.status === 'closed') {
    return 'closed'
  }

  if (lastMessage?.senderRole === 'ADMIN') {
    return 'answered'
  }

  return ticket.status
}


  const markAsRead = id => {
    setTickets(prev =>
      prev.map(msg =>
        getMessageId(msg) === id ? { ...msg, status: 'read' } : msg
      )
    )
  }
  useEffect(() => {
    setTickets(ticketsList)
  }, [ticketsList])

  const openMessageModal = message => {
    setSelectedMessage(message)

    if (message.status === 'unread') {
      markAsRead(getMessageId(message))
    }

    setIsMessageModalOpen(true)
  }

  const closeMessageModal = () => {
    setIsMessageModalOpen(false)
    setSelectedMessage(null)
  }

  const ticketSortOptions = [
    { label: 'جدیدترین', value: 'newest', icon: FaSortAmountDown },
    { label: 'قدیمی‌ترین', value: 'oldest', icon: FaSortAmountUp },
    { label: 'بدون پاسخ', value: 'unanswered', icon: FaQuestionCircle },
    { label: 'پاسخ داده شده', value: 'answered', icon: FaReply },
    { label: 'تیکت‌های بسته نشده', value: 'unread', icon: FaEnvelopeOpenText },
    { label: 'تیکت‌های بسته', value: 'closed', icon: FaLock }
  ]

  const handleStatusChange = async (id, status) => {
    const res = await fetch(`/api/ticket/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    })

    if (!res.ok) {
      showNotification('error', 'مشکلی در تغییر وضعیت به وجود آمد')
      return
    }
    const data = await res.json().catch(() => null)

    showNotification('success', 'تغییرات انجام پذیرفت')

    setTickets(prev =>
      prev.map(t => (t._id === id ? { ...t, status: data.ticket.status } : t))
    )
  }


  const searchedTickets = useMemo(() => {
    if (!searchValue) return tickets

    const search = searchValue.toLowerCase().trim()

    return tickets.filter(t => {

      const phone = String(t.user?.phone || '')
      const name = t.user?.name?.toLowerCase() || ''
      const lastMessage =
        t.messages?.[t.messages.length - 1]?.message?.toLowerCase() || ''

      return (
  
        phone.includes(search) ||
        name.includes(search) ||
        lastMessage.includes(search)
      )
    })
  }, [tickets, searchValue])

  const sortedTickets = useMemo(() => {
    const currentTickets = [...searchedTickets]

    if (sortBy === 'newest') {
      return currentTickets.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    }

    if (sortBy === 'oldest') {
      return currentTickets.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    }

    if (sortBy === 'unanswered') {
      return currentTickets.filter(
        t => !t.messages?.some(m => m.senderRole === 'ADMIN')
      )
    }



 if (sortBy === 'answered') {
  return currentTickets.filter(t => {
    const lastMessage = getLastMessage(t)
    return t.status !== 'closed' && lastMessage?.senderRole === 'ADMIN'
  })
}


    if (sortBy === 'unread') {
      return currentTickets.filter(t => t.status === 'unread')
    }

    if (sortBy === 'closed') {
      return currentTickets.filter(t => t.status === 'closed')
    }

    return currentTickets
  }, [searchedTickets, sortBy])

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    indexOfFirstItem,
    indexOfLastItem,
    currentItems
  } = UsePagination(sortedTickets)

  return (
    <div className='p-6 bg-gray-50 dark:bg-gray-900 min-h-screen'>
      <Headeradmin
        excelactive={true}
        title={' مدیریت پیام‌ها'}
        desc={'مشاهده پیام های کاربران و پاسخ دادن و حذف'}
      />

      <Productadminnavbar
        sortOptions={ticketSortOptions}
        searchValue={searchValue}
        handleSearchChange={setSearchValue}
        sortBy={sortBy}
        handleSortChange={setSortBy}
      />

      <Cardnotification
        show={notification.show}
        title={notification.title}
        color={notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
        Icon={
          notification.type === 'success' ? FaCheck : HiOutlineExclamationCircle
        }
      />

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-100 dark:border-gray-700'>
        <div className='overflow-x-auto'>
          <table className='w-full text-right'>
            <thead className='bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm uppercase'>
              <tr>
                <th className='p-4'>فرستنده</th>
                <th className='p-4'>موضوع</th>
                <th className='p-4'>پیام</th>
                <th className='p-4'>تاریخ</th>
                <th className='p-4'>وضعیت</th>
                <th className='p-4 text-center'>عملیات</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-100 dark:divide-gray-700'>
              {currentItems.length > 0 ? (
                currentItems.map(msg => (
                  <Rowmessage
                    key={msg._id}
                    msg={{
                      ...msg,
                      displayStatus: getTicketDisplayStatus(msg)
                    }}
                    openMessageModal={openMessageModal}
                    handleStatusChange={handleStatusChange}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan='6'
                    className='p-8 text-center text-gray-500 dark:text-gray-400'
                  >
                    پیامی یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className='p-4 border-t border-gray-100 dark:border-gray-700'>
          <Pagenationadminproduct
            allProducts={totalItems}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            indexOfFirstProduct={indexOfFirstItem}
            indexOfLastProduct={indexOfLastItem}
            name='تیکت ها'
          />
        </div>
      </div>

      {isMessageModalOpen && selectedMessage && (
        <Modalmessage
          selectedMessage={selectedMessage}
          closeMessageModal={closeMessageModal}
          markAsRead={markAsRead}
        />
      )}
    </div>
  )
}
