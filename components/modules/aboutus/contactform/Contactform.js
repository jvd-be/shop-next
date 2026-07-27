'use client'
import React, { useState } from 'react'
import Cartnotification from '../../cardnotification/Cardnotification'
import { FaCheck } from 'react-icons/fa'

export default function Contactform() {
  const [showNotification, setShowNotification] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'نام و نام خانوادگی الزامی است'
    if (!formData.email.trim()) {
      newErrors.email = 'ایمیل الزامی است'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'فرمت ایمیل صحیح نیست'
    }
    if (!formData.subject.trim()) newErrors.subject = 'موضوع الزامی است'
    if (!formData.message.trim()) newErrors.message = 'پیام الزامی است'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSendMessage = e => {
    e.preventDefault()
    if (!validate()) return
    
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 2000)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <>
      {showNotification && (
        <Cartnotification
          color='bg-green-500'
          title='پیام شما با موفقیت ارسال شد'
          Icon={FaCheck}
        />
      )}
      
      <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 shadow-sm'>
        <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-6'>
          ارسال پیام
        </h3>
        <form onSubmit={handleSendMessage} className='space-y-4'>
          {/* Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              نام و نام خانوادگی
            </label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.name
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder='نام خود را وارد کنید'
            />
            {errors.name && (
              <p className='text-red-500 text-xs mt-1'>{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              ایمیل
            </label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.email
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder='example@email.com'
            />
            {errors.email && (
              <p className='text-red-500 text-xs mt-1'>{errors.email}</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              موضوع
            </label>
            <input
              type='text'
              name='subject'
              value={formData.subject}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.subject
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder='موضوع پیام'
            />
            {errors.subject && (
              <p className='text-red-500 text-xs mt-1'>{errors.subject}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              پیام
            </label>
            <textarea
              name='message'
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors ${
                errors.message
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder='پیام خود را بنویسید...'
            />
            {errors.message && (
              <p className='text-red-500 text-xs mt-1'>{errors.message}</p>
            )}
          </div>

          <button
            type='submit'
            className='w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition-colors'
          >
            ارسال پیام
          </button>
        </form>
      </div>
    </>
  )
}