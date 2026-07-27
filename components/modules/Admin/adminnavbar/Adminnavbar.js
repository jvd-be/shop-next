import React from 'react'
import { FaSearch } from 'react-icons/fa'

export default function Adminnavbar ({
  handleSortChange,
  sortBy,
  searchValue,
  handleSearchChange,
  existing,
  setExisting,
  sortOptions,
  toggleBtn
}) {
  return (
    <div className='bg-white dark:bg-gray-800 p-4 mb-5 rounded-xl shadow-sm grid grid-rows-2 gap-4  items-center'>
      <div className='relative  w-full '>
        <FaSearch className='absolute right-3 top-3 text-gray-400' />
        <input
          type='text'
          value={searchValue}
          onChange={e => handleSearchChange(e.target.value)}
          placeholder='جستجو کنید...'
          className='w-full pl-4 pr-10 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all'
        />
      </div>

      <div className='flex flex-wrap gap-6 w-full  '>
        {toggleBtn ? (
          <div className='flex items-center gap-3'>
            <span className='text-sm font-medium text-gray-700'>
              {existing ? 'فقط موجود ها' : ''}
            </span>

            <button
              onClick={() => {
                setExisting(!existing)
              }}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 ${
                existing ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                  existing ? '-translate-x-1' : '-translate-x-8'
                }`}
              />
            </button>
          </div>
        ) : null}

        {sortOptions.map((item, index) => (
          <button
            key={index}
            onClick={() => handleSortChange(item.value)}
            className={`flex gap-1 items-center text-sm cursor-pointer ${
              sortBy === item.value
                ? 'text-blue-600 scale-105 dark:text-blue-100'
                : ''
            }`}
          >
            <span>{item.label}</span>
            <item.icon className='hidden md:inline-block' />
          </button>
        ))}
      </div>

    </div>
  )
}
