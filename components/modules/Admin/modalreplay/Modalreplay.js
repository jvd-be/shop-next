'use client'
import { useState,useEffect } from 'react'
import Cardnotification from '../../cardnotification/Cardnotification'
import { FaCheck } from 'react-icons/fa'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { UseNotification } from '@/components/hooks/UseNotification'

export default function Modalreplay ({ isOpen, onClose, comment, onReply }) {
const [replyText, setReplyText] = useState('')

useEffect(() => {
  if (comment?.adminReply?.text) {
    setReplyText(comment.adminReply.text)
  } else {
    setReplyText('')
  }
}, [comment])
  const { showNotification, notification } = UseNotification()
  if (!isOpen) return null

  const handleSubmit = async e => {
    e.preventDefault()

    if (!replyText.trim()) return

    try {
      const res = await fetch('/api/review/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          commentId: comment._id,
          reply: replyText
        })
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
      onReply(data.comment)
      setReplyText('')
      setTimeout(() => {
        onClose()
      }, 3000)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <Cardnotification
        show={notification.show}
        title={notification.title}
        color={notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
        Icon={
          notification.type === 'success' ? FaCheck : HiOutlineExclamationCircle
        }
      />
      <div className='bg-white dark:bg-zinc-900 rounded-lg w-105 p-6 shadow-lg'>
        <h3 className='text-lg font-semibold mb-4'>پاسخ به کامنت</h3>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            rows={4}
            placeholder='پاسخ خود را بنویسید...'
            className='border rounded-md p-2 text-sm dark:bg-zinc-800'
          />

          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-3 py-1 text-sm rounded-md bg-gray-200 dark:bg-zinc-700'
            >
              انصراف
            </button>

            <button
              type='submit'
              className='px-3 py-1 text-sm rounded-md bg-blue-600 text-white'
            >
              ارسال پاسخ
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
