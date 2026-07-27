'use client'
import { useState } from 'react'
import {
  FiPlus,
  FiAlertCircle,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiLoader
} from 'react-icons/fi'
import TicketCard from '../ticketcard/Ticketcard'

export default function TicketsSection ({
  subjectsTicket = [],
  tickets = [],
  formData,
  setFormData,
  handleAddTicket,
  isFormOpen,
  setIsFormOpen
}) {

  const [loading, setLoading] = useState(false)

  const toggleForm = () => {
    if (loading) return
    setIsFormOpen(prev => !prev)
  }

  const onSubmit = async event => {
    event.preventDefault()

    if (loading) return

    try {
      setLoading(true)

      const success = await handleAddTicket(formData)

      if (success) {
        setIsFormOpen(false)
      }
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = status => {
    const base =
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ' +
      'shadow-sm shadow-black/5 select-none whitespace-nowrap'

    switch (status) {
      case 'open':
        return (
          <span
            className={
              base +
              ' bg-sky-50 text-sky-700 border-sky-200/70 ' +
              'dark:bg-sky-900/25 dark:text-sky-300 dark:border-sky-700/50'
            }
          >
            <FiAlertCircle className='text-[12px]' />
            باز
          </span>
        )

      case 'pending':
        return (
          <span
            className={
              base +
              ' bg-amber-50 text-amber-700 border-amber-200/70 ' +
              'dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700/50'
            }
          >
            <FiLoader className='text-[12px]' />
            در انتظار
          </span>
        )

      case 'closed':
        return (
          <span
            className={
              base +
              ' bg-emerald-50 text-emerald-700 border-emerald-200/70 ' +
              'dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700/50'
            }
          >
            <FiCheckCircle className='text-[12px]' />
            بسته شد
          </span>
        )

      default:
        return (
          <span
            className={
              base +
              ' bg-zinc-50 text-zinc-700 border-zinc-200/70 ' +
              'dark:bg-zinc-900/30 dark:text-zinc-300 dark:border-zinc-700/50'
            }
          >
            <FiClock className='text-[12px]' />
            نامشخص
          </span>
        )
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h3 className='font-semibold text-balance md:font-bold md:text-base'>
          تیکت‌های پشتیبانی
        </h3>

        <button
          type='button'
          onClick={toggleForm}
          disabled={loading}
          className='bg-blue-600 text-white px-2 md:px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-60'
        >
          {isFormOpen ? <FiXCircle size={20} /> : <FiPlus size={20} />}
          {isFormOpen ? 'انصراف' : 'تیکت جدید'}
        </button>
      </div>

      {isFormOpen && (
        <form
          onSubmit={onSubmit}
          className='bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4'
        >
          <div>
            <label className='block text-sm mb-2 text-gray-600 dark:text-gray-400'>
              موضوع تیکت
            </label>

            <select
              value={formData.category || ''}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  category: e.target.value
                }))
              }
              className='w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500'
              required
            >
              <option value='' disabled>
                انتخاب موضوع تیکت
              </option>

              {subjectsTicket.map(subject => (
                <option key={subject._id} value={subject._id}>
                  {subject.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm mb-2 text-gray-600 dark:text-gray-400'>
              شرح درخواست
            </label>

            <textarea
              rows='4'
              value={formData.message || ''}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  message: e.target.value
                }))
              }
              className='w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500'
              placeholder='شرح درخواست خود را بنویسید...'
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-orange-600 dark:bg-blue-600 text-white py-3 rounded-xl font-bold disabled:opacity-50'
          >
            {loading ? 'در حال ارسال...' : 'ارسال تیکت'}
          </button>
        </form>
      )}

      <div className='grid gap-4 md:grid-cols-2'>
        {tickets.length > 0 ? (
          tickets.map((ticket, index) =>
            ticket ? (
              <TicketCard
                key={ticket._id || index}
                ticket={ticket}
                getStatusBadge={getStatusBadge}
              />
            ) : null
          )
        ) : (
          <div className='col-span-full text-center text-gray-500 dark:text-gray-400 text-sm py-6 border border-dashed rounded-xl'>
            هنوز تیکتی ثبت نشده است
          </div>
        )}
      </div>
    </div>
  )
}
