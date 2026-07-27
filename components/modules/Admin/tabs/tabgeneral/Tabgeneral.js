'use client'

import { UseNotification } from '@/components/hooks/UseNotification'
import Cardnotification from '@/components/modules/cardnotification/Cardnotification'
import React, { useEffect, useState } from 'react'
import { FaCheck, FaSave } from 'react-icons/fa'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function Tabgeneral ({
  generalSeo,
  setGeneralSeoList,
  updateGeneralSeo
}) {
  const { notification, showNotification } = UseNotification()

  const [siteLogoPreview, setSiteLogoPreview] = useState(null)
  const [faviconPreview, setFaviconPreview] = useState(null)
  const [ogPreview, setOgPreview] = useState(null)

  const handleGeneralChange = e => {
    const { name, value, type, checked } = e.target

    setGeneralSeoList(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleGeneralFileChange = e => {
    const { name, files } = e.target

    if (!files?.length) return

    setGeneralSeoList(prev => ({
      ...prev,
      [name]: files[0]
    }))
  }

  const onSave = async () => {
    try {
      const formData = new FormData()

      Object.entries(generalSeo).forEach(([key, value]) => {
        if (value === undefined || value === null) return

        formData.append(key, value)
      })

      const res = await updateGeneralSeo(formData)

      if (res?.ok) {
        showNotification('success', 'تنظیمات با موفقیت ذخیره شد')
      } else {
        showNotification('error', 'خطا در ذخیره تنظیمات')
      }
    } catch (error) {
      console.error(error)

      showNotification('error', 'ارتباط با سرور برقرار نشد')
    }
  }

  useEffect(() => {
    let logoUrl
    let faviconUrl
    let ogUrl

    if (generalSeo.siteLogo instanceof File) {
      logoUrl = URL.createObjectURL(generalSeo.siteLogo)
      setSiteLogoPreview(logoUrl)
    } else {
      setSiteLogoPreview(generalSeo.siteLogo || null)
    }

    if (generalSeo.favicon instanceof File) {
      faviconUrl = URL.createObjectURL(generalSeo.favicon)
      setFaviconPreview(faviconUrl)
    } else {
      setFaviconPreview(generalSeo.favicon || null)
    }

    if (generalSeo.defaultOgImage instanceof File) {
      ogUrl = URL.createObjectURL(generalSeo.defaultOgImage)
      setOgPreview(ogUrl)
    } else {
      setOgPreview(generalSeo.defaultOgImage || null)
    }

    return () => {
      if (logoUrl) URL.revokeObjectURL(logoUrl)
      if (faviconUrl) URL.revokeObjectURL(faviconUrl)
      if (ogUrl) URL.revokeObjectURL(ogUrl)
    }
  }, [generalSeo.siteLogo, generalSeo.favicon, generalSeo.defaultOgImage])

  return (
    <div className='space-y-6'>
      <Cardnotification
        show={notification.show}
        title={notification.title}
        color={notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
        Icon={
          notification.type === 'success' ? FaCheck : HiOutlineExclamationCircle
        }
      />

      <div>
        <label className='block text-sm font-medium mb-2 dark:text-gray-100'>نام سایت</label>

        <input
          type='text'
          name='siteName'
          value={generalSeo.siteName || ''}
          onChange={handleGeneralChange}
          className='w-full p-3 border rounded-lg dark:text-gray-100'
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-2 dark:text-gray-100'>توضیحات سایت</label>

        <textarea
          name='siteDescription'
          value={generalSeo.siteDescription || ''}
          onChange={handleGeneralChange}
          rows={4}
          className='w-full p-3 border rounded-lg dark:text-gray-100'
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-2 dark:text-gray-100'>آدرس سایت</label>

        <input
          type='url'
          name='siteUrl'
          value={generalSeo.siteUrl || ''}
          onChange={handleGeneralChange}
          className='w-full p-3 border rounded-lg dark:text-gray-100'
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-2 dark:text-gray-100'>لوگو</label>

        <input className='dark:text-gray-100' type='file' name='siteLogo' onChange={handleGeneralFileChange} />

        {siteLogoPreview && <img src={siteLogoPreview} className='w-24 mt-3 dark:text-gray-100' />}
      </div>

      <div>
        <label className='block text-sm font-medium mb-2 dark:text-gray-100'>favicon</label>

        <input    className='dark:text-gray-100' type='file' name='favicon' onChange={handleGeneralFileChange} />

        {faviconPreview && <img src={faviconPreview} className='w-16 mt-3' />}
      </div>

      <div>
        <label className='block text-sm font-medium mb-2 dark:text-gray-100'>OG Image</label>

        <input
          type='file'
          name='defaultOgImage'
          onChange={handleGeneralFileChange}
          className='dark:text-gray-100'
        />

        {ogPreview && <img src={ogPreview} className='w-64 mt-3 dark:text-gray-100' />}
      </div>

      <div className='flex justify-between items-center border p-4 rounded-lg dark:text-gray-100'>
        <span>حالت تعمیرات</span>

        <input
          type='checkbox'
          name='maintenanceMode'
          checked={generalSeo.maintenanceMode || false}
          onChange={handleGeneralChange}
          className='dark:text-gray-100'
        />
      </div>

      <div className='flex justify-end'>
        <button
          onClick={onSave}
          className='flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg'
        >
          <FaSave />
          ذخیره تنظیمات
        </button>
      </div>
    </div>
  )
}
