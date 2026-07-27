'use client'

import React, { useEffect, useRef, useState } from 'react'
import { FaTimes, FaReply, FaEnvelope } from 'react-icons/fa'
import { formatDate } from '@/components/utils/helper'

export default function Modalmessage ({
  closeMessageModal,
  selectedMessage,
  markAsRead
}) {
  const [messages, setMessages] = useState(selectedMessage?.messages || [])
  const [replyText, setReplyText] = useState('')
  const [loading, setLoading] = useState(false)

  const messagesEndRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    })
  }, [messages])

  const sendReply = async () => {
    const cleanText = replyText.trim()

    if (!cleanText || loading) return

    try {
      setLoading(true)

      const res = await fetch('/api/ticket/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ticketId: selectedMessage._id,
          message: cleanText
        })
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data?.message || 'خطا در ارسال پیام')
      }

      const newMessage = data?.message || data?.data

      if (newMessage) {
        setMessages(prev => [...prev, newMessage])
      } else {
        setMessages(prev => [
          ...prev,
          {
            _id: `${Date.now()}-admin-local-message`,
            senderRole: 'ADMIN',
            message: cleanText,
            createdAt: new Date().toISOString()
          }
        ])
      }

      setReplyText('')
    } catch (err) {
      console.error(err)
      alert(err?.message || 'ارسال پیام با خطا مواجه شد')
    } finally {
      setLoading(false)
    }
  }

  const handleBackdropClick = () => {
    closeMessageModal()
  }

  const handleModalClick = event => {
    event.stopPropagation()
  }

  return (
    <div
      onClick={handleBackdropClick}
      className='fixed inset-0 bg-neutral-900/80 flex items-center justify-center z-50 p-3 sm:p-4'
    >
      <div
        onClick={handleModalClick}
        className='bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col relative overflow-hidden'
      >
        {/* CLOSE BUTTON */}
        <button
          type='button'
          onClick={closeMessageModal}
          className='absolute top-4 left-4 z-10 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'
        >
          <FaTimes size={18} />
        </button>

        {/* HEADER */}
        <div className='shrink-0 p-5 sm:p-6 border-b border-gray-100 dark:border-gray-700'>
          <div className='flex items-start gap-4 pl-10'>
            <img
              src={selectedMessage?.user?.avatar || '/images/default-avatar.png'}
              alt={selectedMessage?.user?.name || 'user'}
              className='w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shrink-0'
            />

            <div className='flex-1 min-w-0'>
              <h3 className='font-bold text-base sm:text-lg text-gray-900 dark:text-white truncate'>
                {selectedMessage?.user?.name || 'کاربر'}
              </h3>

              <p className='text-xs sm:text-sm text-gray-500 mt-0.5 truncate'>
                {selectedMessage?.user?.phone || '---'}
              </p>

              <p className='text-[11px] text-gray-400 mt-1'>
                {selectedMessage?.createdAt
                  ? formatDate(selectedMessage.createdAt)
                  : '---'}
              </p>
            </div>

            <button
              type='button'
              onClick={() => markAsRead(selectedMessage._id)}
              className='shrink-0 text-[11px] sm:text-xs px-3 py-1.5 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors'
            >
              خوانده شد
            </button>
          </div>

          {/* SUBJECT */}
          <div className='mt-5 border border-gray-100 dark:border-gray-700 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
            <div className='flex items-center gap-2 font-bold mb-2 text-sm text-gray-800 dark:text-gray-100'>
              <FaEnvelope className='shrink-0' />
              <span className='truncate'>
                {selectedMessage?.subject || 'بدون عنوان'}
              </span>
            </div>

            <div className='text-xs text-gray-500 dark:text-gray-300'>
              دسته بندی: {selectedMessage?.category?.title || '---'}
            </div>
          </div>
        </div>

        {/* MESSAGES - ONLY THIS PART SCROLLS */}
        <div className='flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3 bg-gray-50/60 dark:bg-gray-900/30 custom-scrollbar'>
          {messages?.length > 0 ? (
            messages.map((msg, index) => {
              const role = String(msg?.senderRole || '').toUpperCase()
              const isUser = role === 'USER'

              return (
                <div
                  key={msg?._id || `${msg?.createdAt}-${index}`}
                  className={`flex w-full ${
                    isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-7 shadow-sm ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-br-sm'
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-sm border border-gray-100 dark:border-gray-600'
                    }`}
                  >
                    <div
                      className={`text-[10px] mb-1 font-bold ${
                        isUser
                          ? 'text-indigo-100'
                          : 'text-gray-400 dark:text-gray-300'
                      }`}
                    >
                      {isUser ? msg?.sender?.name || 'کاربر' : 'پشتیبانی'}
                    </div>

                    <p className='whitespace-pre-wrap break-words'>
                      {msg?.message}
                    </p>

                    <div
                      className={`text-[10px] mt-1.5 ${
                        isUser
                          ? 'text-indigo-100/80'
                          : 'text-gray-400 dark:text-gray-300'
                      }`}
                    >
                      {msg?.createdAt ? formatDate(msg.createdAt) : ''}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className='h-full min-h-40 flex items-center justify-center'>
              <p className='text-xs text-gray-400'>
                هنوز پیامی برای این تیکت ثبت نشده است.
              </p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* REPLY BOX */}
        <div className='shrink-0 border-t border-gray-100 dark:border-gray-700 p-4 sm:p-5 bg-white dark:bg-gray-800'>
          <textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder='پاسخ خود را بنویسید...'
            className='w-full resize-none border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-sm text-gray-800 dark:text-gray-100 dark:bg-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-7'
            rows={3}
            disabled={loading}
          />

          <div className='flex justify-end mt-3'>
            <button
              type='button'
              onClick={sendReply}
              disabled={loading || !replyText.trim()}
              className='flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <FaReply />
              {loading ? 'در حال ارسال...' : 'ارسال پاسخ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
