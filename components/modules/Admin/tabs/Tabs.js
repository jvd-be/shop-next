import { useState } from 'react'
import {
  FaGlobe,
  FaShareAlt,
  FaEnvelope,
  FaImage,
  FaShippingFast,
  FaTags
} from 'react-icons/fa'
import Tabgeneral from '@/components/modules/Admin/tabs/tabgeneral/Tabgeneral'
import Tabsocial from '@/components/modules/Admin/tabs/tabsocial/Tabsocial'
import Tabcontact from '@/components/modules/Admin/tabs/tabcontact/Tabcontact'
import Tabbanners from '@/components/modules/Admin/tabs/tabbanners/Tabbanners'
import Tabshipping from '@/components/modules/Admin/tabs/tabshipping/Tabshipping'
import Tabdiscounts from '@/components/modules/Admin/tabs/tabdiscounts/Tabdiscounts'
import Tabpopups from './tabpopups/Tabpopups'
import Tabsliders from './tabsliders/Tabsliders'
import { TfiLayoutSlider } from 'react-icons/tfi'
import { LuPanelBottomOpen } from 'react-icons/lu'

const initialGeneralSettings = {
  siteName: 'فروشگاه اینترنتی من',
  siteDescription: 'بهترین فروشگاه آنلاین برای خرید پوشاک و لوازم جانبی',
  metaKeywords: 'پوشاک, لباس, شال, روسری, کفش',
  siteUrl: 'https://myshop.com',
  adminEmail: 'admin@myshop.com'
}

export default function Tabs ({
  handleSave,
  discounts,
  shippings,
  banners,
  popups,
  sliders,
  contacts,
  socials,
  generalSeo
}) {
  const [activeTab, setActiveTab] = useState('general')
  const [bannerList, setBannerList] = useState(banners || [])
  const [popupList, setPopupList] = useState(popups || [])
  const [slidersList, setSlidersList] = useState(sliders || [])
  const [contactsList, setContactsList] = useState(contacts || [])
  const [socialsList, setSocialsList] = useState(socials.items || [])
  const [generalSeoList, setGeneralSeoList] = useState(generalSeo[0] || [])

  const [shippingSettings, setShippingSettings] = useState({
    fullThreshold: shippings.fullThreshold,
    halfThreshold: shippings.halfThreshold,
    freeThreshold: shippings.freeThreshold,
    fullShippingCost: shippings.fullShippingCost,
    halfShippingCost: shippings.halfShippingCost,
    freeShippingCost: shippings.freeShippingCost || 0
  })
  const [discountSettings, setDiscountSettings] = useState(discounts || [])

  const handleGeneralChange = e => {
    const { name, value } = e.target
    setGeneralSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleSocialChange = e => {
    const { name, value } = e.target
    setSocialSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleContactChange = e => {
    const { name, value } = e.target
    setContactSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleShippingChange = e => {
    const { name, value } = e.target

    setShippingSettings(prev => ({ ...prev, [name]: value }))
  }

  // --- توابع مدیریت کدهای تخفیف ---
  const addDiscount = async data => {
    try {
      const res = await fetch('/api/discount/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.message)
      }

      return result.discount
    } catch (err) {
      console.error(err)
      alert('خطا در ایجاد کد تخفیف')

      return null
    }
  }

  /* -------------------------------
     UPDATE DISCOUNT
  --------------------------------*/

  const updateDiscount = async (id, data) => {
    try {
      const res = await fetch('/api/discount/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          ...data
        })
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.message)
      }

      return result.discount
    } catch (err) {
      console.error(err)
      alert('خطا در بروزرسانی تخفیف')

      return null
    }
  }

  /* -------------------------------
     DELETE DISCOUNT
  --------------------------------*/

  const deleteDiscount = async id => {
    try {
      const res = await fetch('/api/discount/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'خطا در حذف')
      }

      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  /* -------------------------------
     TOGGLE STATUS
  --------------------------------*/

  const toggleDiscountActive = async id => {
    const target = discountSettings.find(d => String(d._id) === String(id))

    if (!target) return

    try {
      const res = await fetch('/api/discount/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          status: !target.status
        })
      })

      const result = await res.json()

      setDiscountSettings(prev =>
        prev.map(d => (String(d._id) === String(id) ? result.discount : d))
      )
    } catch (err) {
      console.error(err)
      alert('خطا در تغییر وضعیت')
    }
  }

  const tabsName = [
    {
      title: 'عمومی',
      Icon: FaGlobe,
      name: 'general'
    },
    {
      title: 'شبکه‌های اجتماعی',
      Icon: FaShareAlt,
      name: 'social'
    },
    {
      title: 'تماس',
      Icon: FaEnvelope,
      name: 'contact'
    },
    {
      title: 'بنرها',
      Icon: FaImage,
      name: 'banners'
    },
    {
      title: 'پاپ آپ ها',
      Icon: LuPanelBottomOpen,
      name: 'popups'
    },
    {
      title: 'اسلایدر ها',
      Icon: TfiLayoutSlider,
      name: 'sliders'
    },
    {
      title: 'ارسال',
      Icon: FaShippingFast,
      name: 'shipping'
    },
    {
      title: 'تخفیف‌ها',
      Icon: FaTags,
      name: 'discounts'
    }
  ]

  const addShippingRules = async () => {
    const res = await fetch('/api/shipping/edit', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(shippingSettings)
    })

    return res
  }

  const addBanner = async formData => {
    const res = await fetch('/api/banners/add', {
      method: 'POST',
      body: formData
    })

    return res
  }

  const updateBanner = async formData => {
    const res = await fetch('/api/banners/update', {
      method: 'PUT',
      body: formData
    })

    return res
  }

  const deleteBanner = async id => {
    const res = await fetch('/api/banners/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })

    return res
  }

  const addPopup = async formData => {
    const res = fetch('/api/popups/add', {
      method: 'POST',
      body: formData
    })
    return res
  }
  const updatePopup = async formData => {
    const res = fetch('/api/popups/update', {
      method: 'PUT',
      body: formData
    })
    return res
  }
  const deletePopup = async id => {
    const res = fetch('/api/popups/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    return res
  }

const addSlider = async formData => {
  const res = await fetch('/api/sliders/add', {
    method: 'POST',
    body: formData
  })

  const result = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(
      result?.errors?.join?.(', ') ||
        result?.message ||
        'خطا در ایجاد اسلایدر'
    )
  }

  return result
}

  const updateSlider = async formData => {
    const res = await fetch('/api/sliders/update', {
      method: 'PUT',
      body: formData
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Update failed')
    }

    return data
  }

  const deleteSlider = async id => {
    const res = fetch('/api/sliders/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    return res
  }

  const updateContacts = async contactData => {
    const res = await fetch('/api/contacts/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mobilePhone: contactData.mobilePhone,
        email: contactData.email,
        storePhone: contactData?.storePhone
      })
    })

    return res
  }
  const updateSocials = async socials => {
    console.log('Sending socials:', socials)

    const res = await fetch(`/api/socials/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: socials })
    })

    return res
  }

  const updateGeneralSeo = async generalSeo => {
    try {
      const res = await fetch('/api/generalseo/update', {
        method: 'PUT',
        body: generalSeo
      })

      return res
    } catch (error) {
      console.error('updateGeneralSeo error:', error)
    }
  }

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-100 dark:border-gray-700 overflow-hidden'>
      <div className='flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto scrollbar-hide'>
        {tabsName.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(item.name)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === item.name
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            <item.Icon />
            <span>{item.title}</span>
          </button>
        ))}
      </div>

      {/* محتوای تب‌ها */}
      <div className='p-6'>
        {/* تب تنظیمات عمومی */}
        {activeTab === 'general' && (
          <Tabgeneral
            generalSeo={generalSeoList}
            setGeneralSeoList={setGeneralSeoList}
            updateGeneralSeo={updateGeneralSeo}
          />
        )}

        {/* تب شبکه‌های اجتماعی */}
        {activeTab === 'social' && (
          <Tabsocial
            socials={socialsList}
            setSocialsList={setSocialsList}
            updateSocials={updateSocials}
          />
        )}

        {/* تب اطلاعات تماس */}
        {activeTab === 'contact' && (
          <Tabcontact
            updateContacts={updateContacts}
            contacts={contactsList}
            setContactsList={setContactsList}
          />
        )}

        {/* تب بنرها و اسلایدر */}
        {activeTab === 'banners' && (
          <Tabbanners
            banners={bannerList}
            setBanners={setBannerList}
            addBanner={addBanner}
            updateBanner={updateBanner}
            deleteBanner={deleteBanner}
          />
        )}
        {activeTab === 'popups' && (
          <Tabpopups
            popups={popupList}
            setPopupList={setPopupList}
            addPopup={addPopup}
            updatePopup={updatePopup}
            deletePopup={deletePopup}
          />
        )}
        {activeTab === 'sliders' && (
          <Tabsliders
            addSlider={addSlider}
            sliders={slidersList}
            setSlidersList={setSlidersList}
            updateSlider={updateSlider}
            deleteSlider={deleteSlider}
          />
        )}

        {/* تب هزینه ارسال */}
        {activeTab === 'shipping' && (
          <Tabshipping
            handleSave={addShippingRules}
            shippingSettings={shippingSettings}
            handleShippingChange={handleShippingChange}
          />
        )}

        {/* تب کدهای تخفیف */}
        {activeTab === 'discounts' && (
          <Tabdiscounts
            discountSettings={discountSettings}
            setDiscountSettings={setDiscountSettings}
            addDiscount={addDiscount}
            updateDiscount={updateDiscount}
            deleteDiscount={deleteDiscount}
            toggleDiscountActive={toggleDiscountActive}
          />
        )}
      </div>
    </div>
  )
}
