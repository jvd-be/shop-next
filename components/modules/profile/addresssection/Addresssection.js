import React from 'react'
import Addressform from '../addressform/Addressform'
import { FiPlus, FiHome } from 'react-icons/fi'
import Addresscard from '../../aboutus/addrescard/Addrescard'
export default function Addresssection ({
  addresses,
  showAddressForm,
  setShowAddressForm,
  handleAddAddress,
  handleShowDelete,
  handleSetDefault
}) {
  return (
    <div className='space-y-4'>
      {showAddressForm ? (
        <Addressform
          onSubmit={handleAddAddress}
          onCancel={() => setShowAddressForm(false)}
        />
      ) : (
        <button
          onClick={() => setShowAddressForm(true)}
          className='w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex flex-col items-center justify-center gap-2 group'
        >
          <div className='bg-gray-100 dark:bg-gray-700 p-3 rounded-full group-hover:bg-blue-50 transition-colors'>
            <FiPlus size={24} />
          </div>
          <span className='font-medium'>افزودن آدرس جدید</span>
        </button>
      )}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {addresses.map((addr, index) => (
          <Addresscard
            key={addr._id || index}
            address={addr}
            onSetDefault={handleSetDefault}
            onDelete={handleShowDelete}
            Icon={FiHome}
          />
        ))}
      </div>
    </div>
  )
}
