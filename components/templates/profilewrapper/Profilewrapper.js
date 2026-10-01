'use client'

import Customfetch from '@/components/utils/CustomeFetch'
import Sidebaritem from '@/components/modules/profile/sidebarItem/SidebarItem'
import TicketsSection from '@/components/modules/profile/ticketsection/Ticketsection'
import React, { useState, useEffect } from 'react'
import {
  FiShoppingBag,
  FiHeart,
  FiMapPin,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiCheck,
  FiSend
} from 'react-icons/fi'
import Ordersection from '@/components/modules/profile/ordersection/Ordersection'
import Wishlistsection from '@/components/modules/profile/wishlistSection/Wishlistsection'
import Addresssection from '@/components/modules/profile/addresssection/Addresssection'
import Settingsection from '@/components/modules/profile/settingsection/Settingsection'
import { UseNotification } from '@/components/hooks/UseNotification'
import Cardnotification from '@/components/modules/cardnotification/Cardnotification'
import { HiOutlineExclamation } from 'react-icons/hi'
import Deletemodal from '@/components/modules/cart/deletemodal/Deletemodal'
import { useDevice } from '@/components/utils/helper'
import { useHeight } from '@/components/utils/navHeightContext'

const Profilewrapper = ({
  user,
  orders,
  categoryTicket,
  ticketsData,
  popups
}) => {
  const { notification, showNotification } = UseNotification()
  const [activeTab, setActiveTab] = useState('orders')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [tickets, setTickets] = useState(ticketsData || [])
  const [wishlist, setWishlist] = useState(user?.wishlist || [])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(user)
  const [addresses, setAddresses] = useState(user?.addresses || [])

  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const [formData, setFormData] = useState({
    category: categoryTicket?.[0]?._id || '',
    message: ''
  })

  const isMobile = useDevice()
  const { mobileNavHeight, desktopNavHeight } = useHeight()

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'

      document.body.style.touchAction = 'none'
    } else {
      document.body.style.overflow = 'unset'
      document.body.style.touchAction = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.touchAction = 'unset'
    }
  }, [isMobileMenuOpen])

  const handleTabChange = tab => {
    setActiveTab(tab)
    setIsMobileMenuOpen(false)
  }

  const handleAddAddress = async newAddress => {
    setShowAddressForm(false)
    try {
      let response = await Customfetch('/api/user/address/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress)
      })

      if (response.ok) {
        const data = await response.json()
        setAddresses(
          data.addresses ||
            (data.newAddress ? [data.newAddress, ...addresses] : addresses)
        )
        showNotification('success', 'آدرس شما با موفقیت ثبت شد.')
      } else {
        showNotification('error', 'خطا در ثبت آدرس')
      }
    } catch (error) {
      showNotification('error', 'مشکل در اتصال')
    }
  }

  const handleShowDelete = id => {
    setSelectedAddress(id)
    setConfirmDelete(true)
  }

  const handleDeleteAddress = async () => {
    if (!selectedAddress) return

    const previousAddresses = [...addresses]

    setAddresses(prev =>
      prev.filter(addr => String(addr._id) !== String(selectedAddress))
    )

    try {
      const response = await Customfetch('/api/user/address/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addressId: selectedAddress })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.addresses) {
          setAddresses(data.addresses)
        }
        showNotification('success', 'حذف آدرس با موفقیت انجام شد')
      } else {
        setAddresses(previousAddresses)
        const errorData = await response.json().catch(() => ({}))
        showNotification(
          'error',
          errorData.message || 'مشکلی در حذف آدرس پیش آمده است'
        )
      }
    } catch (error) {
      setAddresses(previousAddresses)
      showNotification('error', 'مشکل در اتصال')
    } finally {
      setConfirmDelete(false)
      setSelectedAddress(null)
    }
  }

  const closeDeleteModalHandeler = () => {
    setConfirmDelete(false)
  }

  const handleSetDefault = async addressId => {
    const previousAddresses = [...addresses]
    try {
      const response = await Customfetch('/api/user/address/set-default', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ addressId })
      })

      if (response.ok) {
        const data = await response.json()
        setAddresses(data.addresses)
        showNotification('success', 'آدرس پیش فرض با موفقیت تغییر کرد')
      } else {
        showNotification('error', 'مشکلی در تغییر آدرس پیش فرض پیش آمده است')
        setAddresses(previousAddresses)
      }
    } catch (error) {
      showNotification('error', 'مشکلی در تغییر آدرس پیش فرض پیش آمده است')
      setAddresses(previousAddresses)
    }
  }

  // بروزرسانی مشخصات کاربر (نام و آواتار جدید)
  const handleEditSetting = async updatedUser => {
    if (updatedUser) {
      setCurrentUser(prev => ({
        ...prev,
        name: updatedUser.name,
        avatar: updatedUser.avatar
      }))
      showNotification('success', 'مشخصات حساب شما با موفقیت بروزرسانی شد.')
    }
  }

  // خروج ایمن از حساب کاربری
  const handleLogout = async () => {
    setShowLogoutModal(false) // بستن مدال بلافاصله پس از کلیک روی دکمه تایید
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (res.ok) {
        showNotification('success', 'خروج موفقیت‌آمیز بود. در حال انتقال...')
        setTimeout(() => {
          window.location.replace('/')
        }, 1500)
      } else {
        showNotification('error', 'خطا در خروج از حساب')
      }
    } catch (error) {
      showNotification('error', 'خطا در برقراری ارتباط')
    }
  }

  const handleAddTicket = async formValues => {
    try {
      const payload = {
        category: formValues.category,
        message: formValues.message?.trim()
      }

      if (!payload.category) {
        showNotification('error', 'لطفاً دسته‌بندی تیکت را انتخاب کنید.')
        return
      }

      if (!payload.message) {
        showNotification('error', 'لطفاً متن پیام را وارد کنید.')
        return
      }

      const response = await Customfetch('/api/ticket/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      let result = null

      try {
        result = await response.json()
      } catch {
        result = null
      }

      if (response.status === 201 || response.ok) {
        if (!result?.ticket) {
          showNotification('error', 'پاسخ سرور معتبر نیست.')
          return true
        }

        setTickets(prev => [result.ticket, ...prev])

        showNotification(
          'success',
          'تیکت شما با موفقیت ثبت شد. از شکیبایی شما متشکریم.'
        )

        setFormData(prev => ({
          ...prev,
          message: ''
        }))

        return
      }

      if (response.status === 400) {
        showNotification(
          'error',
          result?.message || result?.error || 'اطلاعات تیکت معتبر نیست.'
        )
        return false
      }

      if (response.status === 401) {
        showNotification('error', 'برای ثبت تیکت ابتدا وارد حساب کاربری شوید.')
        return false
      }

      if (response.status === 403) {
        showNotification('error', 'شما اجازه ثبت تیکت ندارید.')
        return false
      }

      if (response.status === 429) {
        showNotification(
          'error',
          result?.message ||
            result?.error ||
            'شما بیش از حد مجاز تیکت باز دارید.'
        )
        return false
      }

      showNotification(
        'error',
        result?.message || result?.error || 'خطا در ثبت تیکت'
      )
    } catch (error) {
      console.error('Add ticket error:', error)
      showNotification('error', 'مشکل در اتصال به سرور')
      return false
    }
  }

  const toggleWishlist = async productId => {
    const normalizedId = String(productId)

    try {
      const response = await fetch('/api/wishlist/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: normalizedId })
      })

      if (response.ok) {
        const data = await response.json()

        setWishlist(prev => {
          const isExisting = prev.some(item => {
            const id =
              typeof item === 'string'
                ? item
                : item._id || item.id || item.productId?._id
            return String(id) === normalizedId
          })

          if (isExisting) {
            return prev.filter(item => {
              const id =
                typeof item === 'string'
                  ? item
                  : item._id || item.id || item.productId?._id
              return String(id) !== normalizedId
            })
          } else {
            return [...prev, normalizedId]
          }
        })

        showNotification('success', data.message)
      } else {
        showNotification('error', 'مشکلی پیش آمد لطفا بعدا تلاش کنید.')
      }
    } catch (error) {
      showNotification('error', 'مشکل در اتصال')
    }
  }

  return (
    <div
      style={{
        marginTop: `${isMobile ? mobileNavHeight : desktopNavHeight}px`
      }}
      className='min-h-screen  bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-vazir'
      dir='rtl'
    >
      <Cardnotification
        color={notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
        Icon={notification.type === 'success' ? FiCheck : HiOutlineExclamation}
        show={notification.show}
        title={notification.title}
      />

      {/* هدر موبایل */}
      <div className='md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-20'>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        <h1 className='text-lg font-bold'>پروفایل من</h1>
        <div className='w-10'></div>
      </div>

      <div className='max-w-7xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-6'>
        {/* سایدبار / منوی کناری */}

        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-90 transition-opacity duration-300 ${
            isMobileMenuOpen
              ? 'opacity-100 visible'
              : 'opacity-0 invisible pointer-events-none'
          }`}
        />
        <aside
          className={`

    md:w-64 md:shrink-0 bg-white dark:bg-gray-800 rounded-l-xl shadow-sm p-4 
    md:relative md:translate-x-0 md:opacity-100 md:visible md:z-auto
    fixed top-0 right-0 h-full w-70 z-100 transition-all duration-300 ease-in-out
    ${
      isMobileMenuOpen
        ? 'translate-x-0 opacity-100 visible'
        : 'translate-x-full opacity-0 invisible md:translate-x-0 md:opacity-100 md:visible'
    }
  `}
        >
          {/* دکمه بستن (فقط موبایل) */}
          <div className='md:hidden flex justify-end mb-4'>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className='p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full'
            >
              <FiX size={24} />
            </button>
          </div>

          <div className='flex flex-col items-center mb-6 pb-6 border-b border-gray-100 dark:border-gray-700'>
            <div className='relative'>
              <img
                src={currentUser?.avatar || '/images/defaultavatar.webp'}
                alt='avatar'
                className='w-24 h-24 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900'
              />
              <span className='absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full'></span>
            </div>
            <h3 className='mt-3 font-bold text-lg text-center'>
              {currentUser?.name || currentUser?.phone}
            </h3>
            <p className='text-sm text-gray-500 text-center truncate w-full px-2'>
              {currentUser?.email || currentUser?.phone}
            </p>
          </div>

          <nav className='space-y-1'>
            <Sidebaritem
              icon={<FiShoppingBag size={20} />}
              label='سفارش‌های من'
              isActive={activeTab === 'orders'}
              onClick={() => handleTabChange('orders')}
            />
            <Sidebaritem
              icon={<FiHeart size={20} />}
              label='علاقه‌مندی‌ها'
              isActive={activeTab === 'wishlist'}
              onClick={() => handleTabChange('wishlist')}
            />
            <Sidebaritem
              icon={<FiMapPin size={20} />}
              label='آدرس‌ها'
              isActive={activeTab === 'addresses'}
              onClick={() => handleTabChange('addresses')}
            />
            <Sidebaritem
              icon={<FiSend size={20} />}
              label='تیکت ها'
              isActive={activeTab === 'ticket'}
              onClick={() => handleTabChange('ticket')}
            />
            <Sidebaritem
              icon={<FiSettings size={20} />}
              label='تنظیمات حساب'
              isActive={activeTab === 'settings'}
              onClick={() => handleTabChange('settings')}
            />

            <div className='pt-4 mt-4 border-t border-gray-200 dark:border-gray-700'>
              <Sidebaritem
                icon={<FiLogOut size={20} />}
                label='خروج از حساب'
                color='text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                onClick={() => setShowLogoutModal(true)}
              />
            </div>
          </nav>
        </aside>

        {/* محتوای اصلی */}
        <main className='flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 min-h-125'>
          {/* هدر محتوا */}
          <div className='flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-700 pb-4'>
            <h2 className='text-2xl font-bold'>
              {activeTab === 'orders' && 'سفارش‌های من'}
              {activeTab === 'wishlist' && 'علاقه‌مندی‌ها'}
              {activeTab === 'addresses' && 'آدرس‌های من'}
              {activeTab === 'ticket' && 'تیکت'}
              {activeTab === 'settings' && 'تنظیمات حساب'}
            </h2>
          </div>

          {activeTab === 'orders' && <Ordersection orders={orders} />}

          {/* محتوای تب: علاقه‌مندی‌ها */}
          {activeTab === 'wishlist' && (
            <Wishlistsection
              wishlistItems={wishlist}
              onToggleWishlist={toggleWishlist}
              popups={popups}
            />
          )}

          <Deletemodal
            confirmDelete={confirmDelete}
            title={'حذف آدرس'}
            desc={'آیا از حذف آدرس مطمئن هستید؟'}
            onCancel={closeDeleteModalHandeler}
            onConfirm={handleDeleteAddress}
          />
          <Deletemodal
            confirmDelete={showLogoutModal}
            title={'خروج از حساب کاربری'}
            desc={'آیا برای خروج از حساب کاربری خود اطمینان دارید؟'}
            onCancel={() => setShowLogoutModal(false)}
            onConfirm={handleLogout}
            Icon={HiOutlineExclamation}
            textConfirmBtn={'بله'}
          />
          {/* محتوای تب: آدرس‌ها */}
          {activeTab === 'addresses' && (
            <Addresssection
              addresses={addresses}
              showAddressForm={showAddressForm}
              setShowAddressForm={setShowAddressForm}
              handleAddAddress={handleAddAddress}
              handleShowDelete={handleShowDelete}
              handleSetDefault={handleSetDefault}
            />
          )}

          {/* محتوای تب: پیام‌ها (چت) */}
          {activeTab === 'ticket' && (
            <TicketsSection
              subjectsTicket={categoryTicket}
              tickets={tickets}
              formData={formData}
              setFormData={setFormData}
              handleAddTicket={handleAddTicket}
              setIsFormOpen={setIsFormOpen}
              isFormOpen={isFormOpen}
            />
          )}

          {/* محتوای تب: تنظیمات با ارسال currentUser به جای پراپ اولیه */}
          {activeTab === 'settings' && (
            <Settingsection
              user={currentUser}
              handleEditSetting={handleEditSetting}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default Profilewrapper
