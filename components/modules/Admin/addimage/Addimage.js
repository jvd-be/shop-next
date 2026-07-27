import React from 'react'
import { HiOutlinePhotograph,HiOutlineTrash } from 'react-icons/hi'
export default function Addimage({handleInputChange,imageUrls,handleRemoveImage}) {
  return (
<>
{imageUrls.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={url} 
                          alt={`preview-${index}`} 
                          className="w-full h-24 object-cover rounded-md border border-gray-300"
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          title="حذف تصویر"
                        >
                          <HiOutlineTrash className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

  <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  <span className='flex items-center gap-2'>
                    <HiOutlinePhotograph className='text-gray-400' /> تصاویر
                    محصول
                  </span>
                </label>
                <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors cursor-pointer'>
                  <div className='space-y-1 text-center'>
                    <HiOutlinePhotograph className='mx-auto h-12 w-12 text-gray-400' />
                    <div className='flex text-sm text-gray-600'>
                      <label
                        htmlFor='images'
                        className='relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none'
                      >
                        <span>آپلود فایل</span>
                        <input
                          id='images'
                          name='images'
                          type='file'
                          onChange={handleInputChange}
                          className='sr-only'
                          multiple
                        />
                      </label>
                      <p className='pl-1'>یا کشیدن و رها کردن</p>
                    </div>
                    <p className='text-xs text-gray-500'>
                      PNG, JPG, GIF تا 10MB
                    </p>
                  </div>
                </div>
              </div>
</>
    
  )
}
