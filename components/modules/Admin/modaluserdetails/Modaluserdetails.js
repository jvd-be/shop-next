import React, { useState } from 'react'
import Orderslist from '../orderslist/Orderslist'
import Ticketslist from '../ticketslist/Ticketslist'
import Commentslist from '../commentsList/Commentslist'

const Modaluserdetails = ({ isOpen, selectedUser, onClose, adminRole }) => {
  const [activeTab, setActiveTab] = useState('orders') // orders, comments, tickets

  const tabs = [
    { id: 'orders', label: 'خریدها' },
    { id: 'comments', label: 'کامنت‌ها' },
    { id: 'tickets', label: 'تیکت‌ها' }
  ]
  if (!isOpen) return null
  const maskPhone = phone => {
    if (!phone || phone.length < 8) return phone

    const start = phone.slice(0, 4)
    const end = phone.slice(-4)
    return `${start}****${end}`
  }
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/80 bg-opacity-50 p-4'>
      <div className='bg-white rounded-xl w-3/4 max-h-[80vh] flex flex-col p-6 shadow-2xl'>
        {/* هدر مدال */}
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold ltr'>
            جزئیات کاربر:{' '}
            {selectedUser.name || adminRole === 'SUPER_ADMIN'
              ? selectedUser.phone
              : maskPhone(selectedUser.phone)}
          </h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-red-500 font-bold'
          >
            بستن
          </button>
        </div>

        {/* تب‌ها */}
        <div className='flex gap-2 border-b mb-4'>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium transition ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* محتوای تب‌ها */}
        <div className='overflow-y-auto flex-1'>
          {activeTab === 'orders' && <Orderslist userId={selectedUser._id} />}
          {activeTab === 'comments' && (
            <Commentslist userId={selectedUser._id} />
          )}
          {activeTab === 'tickets' && <Ticketslist userId={selectedUser._id} />}
        </div>
      </div>
    </div>
  )
}

export default Modaluserdetails
