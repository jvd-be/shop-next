'use client'
import React, { useState } from 'react'
import { FaCheck, FaExclamation } from 'react-icons/fa'
import Headeradmin from '@/components/modules/Admin/headeradmin/Headeradmin'
import Cartnotification from '@/components/modules/cardnotification/Cardnotification'
import Tabs from '@/components/modules/Admin/tabs/Tabs'

export default function Adminsettingswrapper ({discounts,shippings,banners,popups,sliders,contacts,socials,generalSeo}) {
  const [tabName, setTabName] = useState('')
  const [showCartNotification, setShowCartNotification] = useState(false)
  const [err, setErr] = useState(false)
  // --- تابع ذخیره ---
  const handleSave = name => {
    setTabName(name)
    setShowCartNotification(true)
    setTimeout(() => {
      setShowCartNotification(false)
    }, 2000)
    setErr(true)
    setTimeout(() => {
      setErr(false)
    }, 2000)
  }

  const getTabTitle = tab => {
    switch (tab) {
      case 'general':
        return 'عمومی'
      case 'social':
        return 'شبکه‌های اجتماعی'
      case 'contact':
        return 'اطلاعات تماس'
      case 'banners':
        return 'بنرها و اسلایدر'
      case 'shipping':
        return 'هزینه ارسال'
      case 'discounts':
        return 'کدهای تخفیف'
      default:
        return ''
    }
  }

  return (
    <div className='p-6 bg-gray-50 dark:bg-gray-900 min-h-screen'>
      {/* هدر صفحه */}

      <Headeradmin
        title={' تنظیمات سایت'}
        desc={'مدیریت تنظیمات کلی، بنرها، ارسال و تخفیف‌ها'}
      />
      {/* پیام‌های موفقیت یا خطا */}
      {
        <Cartnotification
          title={`تغییرات تنظیمات ${getTabTitle(tabName)} ذخیره ${
            err ? 'نشد' : 'شد'
          }`}
          show={showCartNotification}
          Icon={err ? FaExclamation : FaCheck}
          color={`${err ? 'bg-red-600' : 'bg-green-600'}`}
        />
      }
      {/* تب‌های تنظیمات */}
      <Tabs handleSave={handleSave} discounts={discounts} shippings={shippings} banners={banners} popups={popups} sliders={sliders} contacts={contacts} socials={socials} generalSeo={generalSeo} />
    </div>
  )
}
