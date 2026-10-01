import React from 'react'
import { FaDownload, FaPlus } from 'react-icons/fa6'
export default function Headeradmin ({
  excelactive,
  title,
  addbtn,
  btncontent,
  desc,
  handleOpenModal,
  exportToExcel,
  excelData,
  excelHeaders,
  excelFilename = 'export.csv'
}) {
  return (
    <div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4'>
      <div>
        <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
          {title}
        </h1>
        <p className='text-sm text-gray-500 dark:text-gray-400'>{desc}</p>
      </div>
      <div className='flex gap-2'>
        {excelactive ? (
          <button
            onClick={() =>
              exportToExcel({
                data: excelData,
                headers: excelHeaders,
                filename: excelFilename
              })
            }
            className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md'
          >
            <FaDownload />
            <span>خروجی اکسل</span>
          </button>
        ) : null}
        {addbtn ? (
          <button
            onClick={handleOpenModal}
            className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md'
          >
            <FaPlus />
            <span>{btncontent}</span>
          </button>
        ) : null}
      </div>
    </div>
  )
}
