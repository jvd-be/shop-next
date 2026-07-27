'use client'
import React, { useMemo, useState, useEffect } from 'react'
import Pagenationadminproduct from '@/components/modules/Admin/pagenationadminproduct/Pagenationadminproduct'
import Rowblogadmin from '@/components/modules/Admin/rowblogadmin/Rowblogadmin'
import Adminnavbar from '@/components/modules/Admin/adminnavbar/Adminnavbar'
import Headeradmin from '@/components/modules/Admin/headeradmin/Headeradmin'
import ModalAddBlog from '@/components/modules/Admin/modaladdblog/Modaladdblog'
import {
  FaList,
  FaCheckCircle,
  FaSortAmountDown,
  FaCheck,
  FaExclamationCircle
} from 'react-icons/fa'
import Modalshowblog from '@/components/modules/Admin/modalshowblog/Modalshowblog'
import Deletemodal from '@/components/modules/cart/deletemodal/Deletemodal'
import Cardnotification from '@/components/modules/cardnotification/Cardnotification'
import Modaleditblog from '@/components/modules/Admin/modaleditblog/Modaleditblog'
import { UseNotification } from '@/components/hooks/UseNotification'
import UseCrudActions from '@/components/hooks/UseCrudActions'
import { findById } from '@/components/utils/helper'
import UsePagination from '@/components/hooks/UsePagination'
const blogSortOptions = [
  {
    label: 'همه',
    value: 'none',
    icon: FaList
  },
  {
    label: 'منتشر شده ها',
    value: 'active',
    icon: FaCheckCircle
  },
  {
    label: 'جدیدترین',
    value: 'newest',
    icon: FaSortAmountDown
  }
]

export default function Adminblogpagewrapper ({ initialblogs }) {

  const {
    isViewOpen,
    isEditOpen,
    isDeleteOpen,
    selectedItem,
    openView,
    closeView,
    openEdit,
    closeEdit,
    openDelete,
    closeDelete
  } = UseCrudActions()
  const [sortBy, setSortBy] = useState('none')
  const [searchValue, setSearchValue] = useState('')
  const [blogs, setBlogs] = useState(initialblogs)

  const { notification, showNotification } = UseNotification()

  const [showModalAdd, setShowModalAdd] = useState(false)
  let filtredBlogs = useMemo(() => {
    let result = [...blogs]
    if (searchValue.trim()) {
      const search = searchValue.toLocaleLowerCase().trim()
      result = result.filter(
        blog =>
          blog.title?.toLocaleLowerCase().includes(search) ||
          blog.author?.toLocaleLowerCase().includes(search)
      )
    }
    if (sortBy === 'active') {
      result = result.filter(item => item.isActive === true)
    } else if (sortBy === 'newest') {
      result = result.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    }

    return result
  }, [sortBy, searchValue, blogs])

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    indexOfFirstItem,
    indexOfLastItem,
    currentItems
  } = UsePagination(filtredBlogs)

  const handleOpenModal = () => {
    setShowModalAdd(true)
  }

  const handleSortChange = sortType => {
    setSortBy(sortType)
  }
  const handleSearchChange = value => {
    setSearchValue(value)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [sortBy, searchValue])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1)
    }
  }, [currentPage, totalPages])

  const handleAddBloged = newBlog => {
    setBlogs(prev => [newBlog, ...prev])
  }

  const handleEditedBlog = updatedBlog => {
    setBlogs(prev =>
      prev.map(blog => (blog._id === updatedBlog._id ? updatedBlog : blog))
    )
  }
  const handleOpenViewBlogModal = id => {
    const blog = findById(filtredBlogs, id)
    openView(blog)
  }

  const handleRemoveBlog = id => {
    const blog = findById(filtredBlogs, id)
    openDelete(blog)
  }

  const confirmRemove = async () => {
    try {
      const res = await fetch('/api/blogs/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: selectedItem._id })
      })

      if (res.ok) {
        setBlogs(prev => prev.filter(item => item._id !== selectedItem._id))
        closeDelete()
        showNotification('success', 'حذف با موفقیت انجام شد')
      } else {
        closeDelete()
        showNotification('error', 'خطا در حذف محصول')
      }
    } catch (error) {
      closeDelete()
      showNotification('error', 'خطا در ارتباط با سرور')
    }
  }

  const handleOpenEditBlogModal = id => {
    const blog = findById(filtredBlogs, id)

    openEdit(blog)
  }
  return (
    <div className='space-y-6'>
      <Headeradmin
        addbtn={true}
        handleOpenModal={handleOpenModal}
        title={'  مدیریت مقالات'}
        btncontent={'افزودن مقاله جدید'}
        excelactiv={true}
        desc={'مشاهده، ویرایش و مدیریت محتوای وبلاگ'}
      />
      <Adminnavbar
        handleSortChange={handleSortChange}
        filterActive={true}
        sortOptions={blogSortOptions}
        sortBy={sortBy}
        searchValue={searchValue}
        handleSearchChange={handleSearchChange}
        toggleBtn={false}
      />

      <Cardnotification
        title={notification.title}
        type={notification.type}
        show={notification.show}
        Icon={notification.type === 'success' ? FaCheck : FaExclamationCircle}
        color={notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
      />

      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-right'>
            <thead className='bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm uppercase font-semibold'>
              <tr>
                <th className='p-4 rounded-tr-lg'>عنوان مقاله</th>
                <th className='p-4 rounded-tr-lg'>عکس کاور</th>
                <th className='p-4'>نویسنده</th>
                <th className='p-4'>وضعیت</th>
                <th className='p-4'>تاریخ</th>
                <th className='p-4 rounded-tl-lg'>عملیات</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100 dark:divide-gray-700'>
              {currentItems.map((post, id) => (
                <Rowblogadmin
                  handleOpenViewBlogModal={handleOpenViewBlogModal}
                  handleRemoveBlog={handleRemoveBlog}
                  handleOpenEditBlogModal={handleOpenEditBlogModal}
                  key={id}
                  post={post}
                />
              ))}
            </tbody>
          </table>
        </div>
        <ModalAddBlog
          isOpen={showModalAdd}
          onClose={() => {
            setShowModalAdd(false)
          }}
          onAddBloged={handleAddBloged}
        />
        <Modalshowblog
          isOpen={isViewOpen}
          onClose={closeView}
          post={selectedItem}
        />
        <Deletemodal
          title={'حذف بلاگ'}
          desc={'آیا از  حذف بلاگ اطمینان دارید؟'}
          onConfirm={confirmRemove}
          confirmDelete={isDeleteOpen}
          onCancel={closeDelete}
        />
        <Modaleditblog
          onClose={closeEdit}
          isOpen={isEditOpen}
          post={selectedItem}
          onEditBloged={handleEditedBlog}
        />
        {/* صفحه‌بندی */}
        <Pagenationadminproduct
          allProducts={totalItems}
          currentPage={currentPage}
          indexOfFirstProduct={indexOfFirstItem}
          indexOfLastProduct={indexOfLastItem}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          name={'مقاله'}
        />
      </div>
    </div>
  )
}
