'use client'

import React, { useState, useMemo } from 'react'
import {
  FaCheck,
  FaList,
  FaSortAmountDown,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaLayerGroup,
  FaSortNumericDown,
  FaSortAlphaDown,
  FaSpinner
} from 'react-icons/fa'

import Pagenationadminproduct from '@/components/modules/Admin/pagenationadminproduct/Pagenationadminproduct'
import Headeradmin from '@/components/modules/Admin/headeradmin/Headeradmin'
import Rowcategories from '@/components/modules/Admin/rowcategories/Rowcategories'
import Modaladdcategory from '@/components/modules/Admin/modaladdcategory/Modaladdcategory'
import Customfetch from '@/components/utils/CustomeFetch'
import { UseNotification } from '@/components/hooks/UseNotification'
import Cardnotification from '@/components/modules/cardnotification/Cardnotification'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import Productadminnavbar from '@/components/modules/Admin/adminnavbar/Adminnavbar'
import UsePagination from '@/components/hooks/UsePagination'
import UseCrudActions from '@/components/hooks/UseCrudActions'
/* ================= SORT OPTIONS ================= */

const categorySortOptions = [
  { label: 'همه', value: 'none', icon: FaList },
  { label: 'جدیدترین دسته‌بندی‌ها', value: 'newest', icon: FaSortAmountDown },
  { label: 'قدیمی‌ترین دسته‌بندی‌ها', value: 'oldest', icon: FaCalendarAlt },
  { label: 'دسته‌بندی‌های فعال', value: 'active', icon: FaCheckCircle },
  { label: 'دسته‌بندی‌های غیرفعال', value: 'inactive', icon: FaTimesCircle },
  { label: 'دسته‌بندی‌های والد', value: 'parent', icon: FaLayerGroup },
  { label: 'مرتب‌سازی بر اساس ترتیب', value: 'order', icon: FaSortNumericDown },
  { label: 'مرتب‌سازی الفبایی', value: 'alphabetical', icon: FaSortAlphaDown }
]

/* ================= COMPONENT ================= */

export default function Admincategorieswrapper ({ category = [] }) {
  const { notification, showNotification } = UseNotification()

  const [categories, setCategories] = useState(category)
  const [searchValue, setSearchValue] = useState('')
  const [sortBy, setSortBy] = useState('none')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    order: 0,
    parent: '',
    description: '',
    image: null,
    isActive: true
  })

  /* ================= SEARCH ================= */

  const searchedCategories = useMemo(() => {
    if (!searchValue.trim()) return categories

    const lower = searchValue.toLowerCase().trim()

    return categories.filter(
      cat =>
        cat?.name?.toLowerCase().includes(lower) ||
        cat?.slug?.toLowerCase().includes(lower) ||
        cat?.description?.toLowerCase().includes(lower)
    )
  }, [searchValue, categories])

  /* ================= SORT ================= */

  const sortedAndFilteredCategories = useMemo(() => {
    const data = [...searchedCategories]

    switch (sortBy) {
      case 'newest':
        return data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )

      case 'oldest':
        return data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        )

      case 'active':
        return data.filter(c => c.isActive === true)

      case 'inactive':
        return data.filter(c => c.isActive === false)

      case 'parent':
        return data.filter(c => !c.parent)

      case 'order':
        return data.sort((a, b) => (a.order || 0) - (b.order || 0))

      case 'alphabetical':
        return data.sort((a, b) =>
          (a.name || '').localeCompare(b.name || '', 'fa')
        )

      default:
        return data
    }
  }, [sortBy, searchedCategories])

  /* ================= HANDLERS ================= */

  const handleSearchChange = value => {
    setSearchValue(value)
    setCurrentPage(1)
  }

  const handleSortChange = value => {
    setSortBy(value)
    setCurrentPage(1)
  }

  const handleInputChange = e => {
    const { name, value, files, type, checked } = e.target

    setFormData(prev => ({
      ...prev,
      [name]:
        type === 'file'
          ? files?.[0] || null
          : type === 'checkbox'
          ? checked
          : value
    }))
  }

  const openAddModal = () => {
    setEditingCategory(null)
    setFormData({
      name: '',
      slug: '',
      order: 0,
      parent: '',
      description: '',
      image: null,
      isActive: true
    })
    setIsModalOpen(true)
  }

  const openEditModal = category => {
    setEditingCategory(category)
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      parent: category.parent || '',
      description: category.description || '',
      order: category.order || 0,
      image: null,
      isActive: category.isActive ?? true
    })
    setIsModalOpen(true)
  }

  /* ================= ADD CATEGORY ================= */

  const handleAddSubmit = async e => {
    e.preventDefault()

    try {
      const form = new FormData()

      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'image' && value) form.append(key, value)
        else if (key !== 'image') form.append(key, String(value ?? ''))
      })

      const res = await Customfetch('/api/category/add', {
        method: 'POST',
        body: form
      })

      const result = await res.json()

      if (!res.ok) {
        showNotification('error', result?.message || 'خطا در افزودن دسته')
        return
      }

      setCategories(prev => [result.category, ...prev])
      
      showNotification('success', 'دسته‌بندی با موفقیت اضافه شد')
      setIsModalOpen(false)
    } catch (error) {
      console.error(error)
      showNotification('error', 'مشکلی در افزودن ایجاد شد')
    }
  }

  /* ================= TOGGLE STATUS ================= */

  const toggleStatus = async id => {
    try {
      const res = await Customfetch('/api/category/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      const data = await res.json()

      if (!res.ok) {
        showNotification('error', data?.message || 'خطا در تغییر وضعیت')
        return
      }

      setCategories(prev =>
        prev.map(cat => (String(cat._id) === String(id) ? data.category : cat))
      )

      showNotification('success', 'وضعیت با موفقیت تغییر کرد')
    } catch (error) {
      console.error(error)
      showNotification('error', 'خطا در تغییر وضعیت')
    }
  }

  const handleEditSubmit = async e => {
    e.preventDefault()

    if (!editingCategory) return

    try {
      const form = new FormData()

      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'image' && value) form.append(key, value)
        else if (key !== 'image') form.append(key, String(value ?? ''))
      })

      form.append('id', editingCategory._id)

      const res = await Customfetch('/api/category/update', {
        method: 'PUT',
        body: form
      })

      const data = await res.json()

      if (!res.ok) {
        showNotification('error', data?.message || 'خطا در ویرایش دسته')
        return
      }

      const updatedCategory = data?.category

      setCategories(prev =>
        prev.map(cat =>
          String(cat._id) === String(updatedCategory._id)
            ? updatedCategory
            : cat
        )
      )

      showNotification('success', 'دسته با موفقیت ویرایش شد')

      setIsModalOpen(false)
      setEditingCategory(null)
    } catch (error) {
      console.error(error)
      showNotification('error', 'خطا در ویرایش دسته')
    }
  }

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    indexOfFirstItem,
    indexOfLastItem,
    currentItems
  } = UsePagination(sortedAndFilteredCategories)
  /* ================= RENDER ================= */

  if (!categories)
    return (
      <div className='flex justify-center items-center h-64'>
        <FaSpinner className='animate-spin text-blue-600 text-4xl' />
      </div>
    )

  return (
    <div className='p-6 bg-gray-50 dark:bg-gray-900 min-h-screen'>
      <Headeradmin
        title='مدیریت دسته‌بندی پوشاک'
        addbtn
        btncontent='اضافه دسته بندی'
        desc='مدیریت دسته بندی ها'
        handleOpenModal={openAddModal}
      />

      <Productadminnavbar
        sortOptions={categorySortOptions}
        searchValue={searchValue}
        handleSearchChange={handleSearchChange}
        sortBy={sortBy}
        handleSortChange={handleSortChange}
      />

      <Cardnotification
        show={notification.show}
        title={notification.title}
        color={notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
        Icon={
          notification.type === 'success' ? FaCheck : HiOutlineExclamationCircle
        }
      />

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden'>
        <table className='w-full text-right'>
          <thead className='bg-gray-50 dark:bg-gray-700 text-sm uppercase'>
            <tr>
              <th className='p-4'>دسته‌بندی</th>
              <th className='p-4'>Slug</th>
              <th className='p-4'>دسته والد</th>

              <th className='p-4'>وضعیت</th>
              <th className='p-4 text-center'>عملیات</th>
            </tr>
          </thead>

          <tbody>
   {currentItems.length > 0 ? (
  (

    currentItems.filter(Boolean).map(cat => {
      const parentName =
        categories.find(
          c => String(c?._id) === String(cat?.parent)
        )?.name || 'ریشه'

      return (
        <Rowcategories
          key={cat._id}
          cat={cat}
          parentName={parentName}
          openEditModal={openEditModal}
          toggleStatus={toggleStatus}
        />
      )
    })
  )
) : (
  <tr>
    <td colSpan='5' className='p-8 text-center'>
      دسته‌بندی یافت نشد
    </td>
  </tr>
)}
          </tbody>
        </table>

        <div className='p-4 border-t'>
          <Pagenationadminproduct
            allProducts={totalItems}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            indexOfFirstProduct={indexOfFirstItem}
            indexOfLastProduct={indexOfLastItem}
            name='دسته بندی'
          />
        </div>
      </div>

      {isModalOpen && (
        <Modaladdcategory
          formData={formData}
          handleAddSubmit={editingCategory ? handleEditSubmit : handleAddSubmit}
          handleInputChange={handleInputChange}
          categories={categories}
          isEdit={!!editingCategory}
          onClose={() => {
            setIsModalOpen(false)
            setEditingCategory(null)
          }}
        />
      )}
    </div>
  )
}
