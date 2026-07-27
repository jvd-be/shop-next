'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { formatDate } from '@/components/utils/helper'
import Cardnotification from '../../cardnotification/Cardnotification'
import { UseNotification } from '@/components/hooks/UseNotification'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { FaCheck } from 'react-icons/fa'
import Deletemodal from '../../cart/deletemodal/Deletemodal'
export default function TicketCard ({ ticket, getStatusBadge }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [sendLoading, setSendLoading] = useState(false)
  const [closeLoading, setCloseLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [localStatus, setLocalStatus] = useState(ticket?.status || 'open')
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const { notification, showNotification } = UseNotification()
  const ticketId = ticket?._id

  const dateFa = ticket?.createdAt
    ? new Date(ticket.createdAt).toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    : '---'

  const fallbackMessages = useMemo(() => {
    const initialMessages = []

    if (ticket?.message) {
      initialMessages.push({
        _id: `${ticket?._id}-user-message`,
        senderRole: 'USER',
        message: ticket.message,
        createdAt: ticket.createdAt
      })
    }

    if (ticket?.response) {
      initialMessages.push({
        _id: `${ticket?._id}-admin-response`,
        senderRole: 'ADMIN',
        message: ticket.response,
        createdAt: ticket.updatedAt || ticket.createdAt
      })
    }

    return initialMessages
  }, [ticket])

  const normalizedTicketMessages = useMemo(() => {
    if (!Array.isArray(ticket?.messages) || ticket.messages.length === 0) {
      return fallbackMessages
    }

    return ticket.messages.map(message => ({
      ...message,
      senderRole: String(message?.senderRole || '').toUpperCase()
    }))
  }, [ticket, fallbackMessages])

  const hasAdminReply = useMemo(() => {
    return messages.some(message => {
      const role = String(message?.senderRole || '').toUpperCase()
      return role === 'ADMIN'
    })
  }, [messages])

  const isClosed = localStatus === 'closed'

  const previewMessage =
    ticket?.lastMessage || ticket?.message || ticket?.response || '—'

  useEffect(() => {
    setMessages(normalizedTicketMessages)
  }, [normalizedTicketMessages])

  useEffect(() => {
    setLocalStatus(ticket?.status || 'open')
  }, [ticket?.status])

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.touchAction = 'auto'
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.touchAction = 'auto'
    }
  }, [isModalOpen])

  const handleSendMessage = async () => {
    const trimmedMessage = newMessage.trim()

    if (!trimmedMessage) {
      setErrorMessage('متن پیام نمی‌تواند خالی باشد.')
      return
    }

    if (!ticketId) {
      setErrorMessage('شناسه تیکت معتبر نیست.')
      return
    }

    if (isClosed) {
      setErrorMessage('این تیکت بسته شده و امکان ارسال پیام جدید وجود ندارد.')
      return
    }

    if (!hasAdminReply) {
      setErrorMessage(
        'تا زمانی که ادمین پاسخ نداده، امکان ارسال سوال جدید وجود ندارد.'
      )
      return
    }

    try {
      setErrorMessage('')
      setSendLoading(true)

      const response = await fetch('/api/ticket/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ticketId,
          message: trimmedMessage
        })
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (response.status === 401) {
          showNotification(
            'error',
            'برای ارسال پیام باید وارد حساب کاربری شوید.'
          )
        } else if (response.status === 403) {
          showNotification(
            'error',
            result?.message || 'شما اجازه ارسال پیام برای این تیکت را ندارید.'
          )
        } else if (response.status === 404) {
          showNotification('error', 'تیکت مورد نظر پیدا نشد.')
        } else if (response.status === 409) {
          showNotification('error', 'این تیکت بسته شده است.')
        } else {
          showNotification('error', result?.message || 'خطا در ارسال پیام')
        }

        return
      }

      const returnedMessage =
        result?.data && typeof result.data === 'object'
          ? result.data
          : result?.message && typeof result.message === 'object'
          ? result.message
          : null

      const userMessage = {
        _id:
          returnedMessage?._id ||
          returnedMessage?.id ||
          `${Date.now()}-local-user-message`,
        ticket: returnedMessage?.ticket || ticketId,
        sender: returnedMessage?.sender,
        senderRole: 'USER',
        message: returnedMessage?.message || trimmedMessage,
        createdAt: returnedMessage?.createdAt || new Date().toISOString(),
        updatedAt: returnedMessage?.updatedAt
      }

      setMessages(prev => [...prev, userMessage])
      showNotification(
        'success',
        'پیام شما با موفقیت ارسال شد از صبر و شکیبایی شما ممنونیم'
      )
      setNewMessage('')
    } catch (error) {
      showNotification('error', 'مشکل در اتصال به سرور')
    } finally {
      setSendLoading(false)
    }
  }

  const openDeleteModal = () => {
    if (isClosed || closeLoading) return
    setIsDeleteOpen(true)
  }

  const closeDelete = () => {
    if (closeLoading) return
    setIsDeleteOpen(false)
  }

  const confirmRemove = async () => {
    await handleCloseTicket()
  }

  const handleCloseTicket = async () => {
    if (!ticketId) {
      showNotification('error', 'شناسه تیکت معتبر نیست.')
      return
    }

    if (isClosed) return

    try {
      setCloseLoading(true)
      const response = await fetch('/api/ticket/close', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ticketId
        })
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (response.status === 401) {
          showNotification(
            'error',
            'برای بستن تیکت باید وارد حساب کاربری شوید.'
          )
        } else if (response.status === 403) {
          showNotification('error', 'شما اجازه بستن این تیکت را ندارید.')
        } else if (response.status === 404) {
          showNotification('error', 'تیکت مورد نظر پیدا نشد.')
        } else {
          showNotification('error', result?.message || 'خطا در بستن تیکت')
        }

        return
      }

      setLocalStatus('closed')
      setIsDeleteOpen(false)

      showNotification('success', 'تیکت با موفقیت بسته شد.')
    } catch (error) {
      showNotification('error', 'مشکل در اتصال به سرور')
    } finally {
      setCloseLoading(false)
    }
  }

  return (
    <>
      {/* --- Card View --- */}
      <div className='w-full min-w-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full overflow-hidden'>
        <Cardnotification
          show={notification.show}
          title={notification.title}
          color={
            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }
          Icon={
            notification.type === 'success'
              ? FaCheck
              : HiOutlineExclamationCircle
          }
        />

        <Deletemodal
          title={'بستن تیکت'}
          desc={'آیا از بستن تیکت اطمینان دارید؟'}
          onConfirm={confirmRemove}
          confirmDelete={isDeleteOpen}
          onCancel={closeDelete}
          textConfirmBtn={'بستن'}
        />
        <div className='flex justify-between items-start gap-3 w-full min-w-0 mb-3'>
          <div className='min-w-0 flex-1'>
            <h3 className='font-bold text-gray-900 dark:text-white text-xs sm:text-sm md:text-base truncate leading-snug'>
              {ticket?.category?.title || 'تیکت پشتیبانی'}
            </h3>

            <div className='flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-[10px] sm:text-xs text-gray-400'>
              <span className='whitespace-nowrap'>{dateFa}</span>
              <span className='hidden xs:inline text-gray-300'>•</span>
              <span className='font-mono text-[9px] sm:text-[11px] truncate max-w-20 xs:max-w-none'>
                #{String(ticket?._id || '').slice(-6)}
              </span>
            </div>
          </div>

          <div className='shrink-0 min-w-0 max-w-25'>
            {getStatusBadge?.(localStatus)}
          </div>
        </div>

        <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed flex-1 break-words'>
          {previewMessage}
        </p>

        <button
          type='button'
          onClick={() => {
            setErrorMessage('')
            setIsModalOpen(true)
          }}
          className='w-full mt-4 text-[10px] sm:text-xs font-bold bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 sm:py-2.5 rounded-xl transition-colors border border-gray-100/50 dark:border-gray-600/50'
        >
          مشاهده و پیگیری
        </button>
      </div>

      {/* --- Modal View --- */}
      {isModalOpen && (
        <div className='fixed inset-0 z-600 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-[2px]'>
          <div className='bg-white dark:bg-gray-900 w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col'>
            {/* Header */}
            <div className='flex justify-between items-center p-3 sm:p-4 border-b border-gray-50 dark:border-gray-700'>
              <div className='min-w-0 flex-1 pl-2'>
                <h2 className='font-black text-sm sm:text-base md:text-lg text-gray-900 dark:text-white truncate'>
                  جزئیات تیکت
                </h2>

                <div className='flex items-center gap-2 mt-1'>
                  <p className='text-[10px] text-gray-400 truncate'>
                    {ticket?.category?.title || 'تیکت پشتیبانی'}
                  </p>

                  <span className='text-[10px] text-gray-300'>•</span>

                  <span className='text-[10px] text-gray-400 font-mono'>
                    #{String(ticket?._id || '').slice(-6)}
                  </span>
                </div>
              </div>

              <button
                type='button'
                onClick={() => setIsModalOpen(false)}
                className='w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors'
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div
              className='p-5 sm:p-6 overflow-y-auto overscroll-contain space-y-4
custom-scrollbar min-w-0 flex-1'
            >
              {messages.length > 0 ? (
                messages.map(message => {
                  const role = String(message?.senderRole || '').toUpperCase()
                  const isUser = role === 'USER'

                  return (
                    <div
                      key={
                        message?._id ||
                        `${message?.createdAt}-${message?.message}`
                      }
                      className={`flex w-full ${
                        isUser ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      <div className='max-w-[85%] space-y-1'>
                        {/* header */}
                        <div
                          className={`flex items-center gap-2 text-[10px] text-gray-400 ${
                            isUser ? 'justify-start' : 'justify-end'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isUser ? 'bg-blue-500' : 'bg-emerald-500'
                            }`}
                          />

                          <span className='font-bold'>
                            {isUser ? 'پیام شما' : 'پاسخ پشتیبانی'}
                          </span>

                          {message?.createdAt && (
                            <span>{formatDate(message.createdAt)}</span>
                          )}
                        </div>

                        {/* bubble */}
                        <div
                          className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-7 wrap-break-word ${
                            isUser
                              ? 'bg-blue-500 text-white rounded-br-none'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'
                          }`}
                        >
                          {message?.message}
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className='bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-200 dark:border-gray-700 p-5 rounded-2xl text-center min-w-0'>
                  <p className='text-xs text-gray-400'>
                    هنوز پیامی برای این تیکت ثبت نشده است.
                  </p>
                </div>
              )}

              {!hasAdminReply && !isClosed && (
                <div className='bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/40 p-4 rounded-2xl text-center'>
                  <p className='text-xs text-amber-700 dark:text-amber-300 font-bold'>
                    در انتظار پاسخ ادمین
                  </p>
                  <p className='text-[11px] text-amber-600/80 dark:text-amber-300/80 mt-1 leading-6'>
                    بعد از پاسخ پشتیبانی، می‌توانید در همین تیکت سوال بعدی خود
                    را ارسال کنید.
                  </p>
                </div>
              )}

              {isClosed && (
                <div className='bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/40 p-4 rounded-2xl text-center'>
                  <p className='text-xs text-red-600 dark:text-red-300 font-bold'>
                    این تیکت بسته شده است
                  </p>
                  <p className='text-[11px] text-red-500/80 dark:text-red-300/80 mt-1 leading-6'>
                    برای ادامه، باید یک تیکت جدید ثبت کنید.
                  </p>
                </div>
              )}

              {errorMessage && (
                <div className='bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/40 p-3 rounded-xl'>
                  <p className='text-xs text-red-600 dark:text-red-300 leading-6'>
                    {errorMessage}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className='p-4 sm:p-6 bg-gray-50/50 dark:bg-gray-900/50 mt-auto shrink-0 border-t border-gray-100 dark:border-gray-700'>
              {!isClosed && hasAdminReply && (
                <div className='space-y-2 mb-2'>
                  <textarea
                    value={newMessage}
                    onChange={event => setNewMessage(event.target.value)}
                    rows='3'
                    placeholder='اگر سوال دیگری دارید، اینجا بنویسید...'
                    className='w-full resize-none bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-1 text-xs sm:text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-7'
                  />

                  <button
                    type='button'
                    onClick={handleSendMessage}
                    disabled={sendLoading || !newMessage.trim()}
                    className='w-full bg-blue-600 text-white py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-100 dark:shadow-none hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {sendLoading ? 'در حال ارسال...' : 'ارسال سوال جدید'}
                  </button>
                </div>
              )}

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {!isClosed && (
                  <button
                    type='button'
                    onClick={openDeleteModal}
                    disabled={closeLoading}
                    className='w-full bg-red-500 text-white py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-red-100 dark:shadow-none hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {closeLoading ? 'در حال بستن...' : 'بستن تیکت'}
                  </button>
                )}

                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className={`w-full bg-gray-900 dark:bg-blue-600 text-white py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-gray-200 dark:shadow-none hover:opacity-90 active:scale-[0.98] transition-all ${
                    isClosed ? 'sm:col-span-2' : ''
                  }`}
                >
                  متوجه شدم
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
