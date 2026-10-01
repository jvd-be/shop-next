'use client'
import UseCrudActions from '@/components/hooks/UseCrudActions'
import { UseNotification } from '@/components/hooks/UseNotification'
import Headeradmin from '@/components/modules/Admin/headeradmin/Headeradmin'
import Modaladdproduct from '@/components/modules/Admin/modaladdproduct/Modaladdproduct'
import Modaleditproduct from '@/components/modules/Admin/modaleditproduct/Modaleditproduct'
import Modalshowproduct from '@/components/modules/Admin/modalshowproduct/Modalshowproduct'
import Pagenationadminproduct from '@/components/modules/Admin/pagenationadminproduct/Pagenationadminproduct'
import Productadminnavbar from '@/components/modules/Admin/adminnavbar/Adminnavbar'
import Rowproductadmin from '@/components/modules/Admin/rowproductadmin/Rowproductadmin'
import Cardnotification from '@/components/modules/cardnotification/Cardnotification'
import Deletemodal from '@/components/modules/cart/deletemodal/Deletemodal'
import { exportToExcel, findById } from '@/components/utils/helper'
import { useEffect, useMemo, useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import {
  FaCheck,
  FaSortAmountDown,
  FaArrowUp,
  FaBoxOpen,
  FaCheckCircle,
  FaTag,
  FaList,
  FaArrowDown,
  FaInvision
} from 'react-icons/fa'
import UsePagination from '@/components/hooks/UsePagination'
const productSortOptions = [
  {
    label: 'همه',
    value: 'none',
    icon: FaList
  },
  {
    label: 'جدیدترین ها',
    value: 'newest',
    icon: FaSortAmountDown
  },
  {
    label: 'فعال ها',
    value: 'active',
    icon: FaCheckCircle
  },
  {
    label: 'کم به زیاد',
    value: 'lowest',
    icon: FaArrowDown
  },
  {
    label: 'ناموجود ها',
    value: 'out_of_stock',
    icon: FaBoxOpen
  },
  {
    label: 'ویژه ها',
    value: 'isFeatured',
    icon: FaInvision
  },
  {
    label: 'تخفیف دار ها',
    value: 'offer',
    icon: FaTag
  },
  {
    label: 'گران ترین ها',
    value: 'expensive',
    icon: FaArrowUp
  }
]
export default function Adminproductspagewrapper ({
  categories,
  initialproducts
}) {
  const [products, setProducts] = useState(initialproducts)

  const [sortBy, setSortBy] = useState('none')
  const [searchValue, setSearchValue] = useState('')
  const [existing, setExisting] = useState(false)
  const searchedProducts = useMemo(() => {
    if (!searchValue) return products

    const lowerCaseSearch = searchValue.toLowerCase().trim()

    return products.filter(
      product =>
        product.title?.toLowerCase().includes(lowerCaseSearch) ||
        product.category?.toLowerCase().includes(lowerCaseSearch) ||
        product.description?.toLowerCase().includes(lowerCaseSearch)
    )
  }, [searchValue, products])

  const sortedAndFilteredProducts = useMemo(() => {
    let currentProducts = [...searchedProducts]

    if (sortBy === 'newest') {
      currentProducts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    } else if (sortBy === 'expensive') {
      currentProducts.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'offer') {
      currentProducts = currentProducts.filter(
        item => Number(item.discount) > 0
      )
    } else if (sortBy === 'out_of_stock') {
      currentProducts = currentProducts.filter(
        item => Number(item.totalQuantity) === 0
      )
    } else if (sortBy === 'active') {
      currentProducts = currentProducts.filter(item => item.isActive === true)
    } else if (sortBy === 'lowest') {
      currentProducts.sort(
        (a, b) => Number(a.totalQuantity) - Number(b.totalQuantity)
      )
    } else if (sortBy === 'isFeatured') {
      currentProducts = currentProducts.filter(item => item.isFeatured === true)
    }
    if (existing) {
      currentProducts = currentProducts.filter(
        item => Number(item.totalQuantity) > 0
      )
    }
    return currentProducts
  }, [searchedProducts, sortBy, existing])

  const {
    selectedItem,
    isViewOpen,
    isEditOpen,
    isDeleteOpen,
    openView,
    closeView,
    openEdit,
    closeEdit,
    openDelete,
    closeDelete
  } = UseCrudActions()
  const { notification, showNotification } = UseNotification()

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    indexOfFirstItem,
    indexOfLastItem,
    currentItems
  } = UsePagination(sortedAndFilteredProducts)

  const [openAddModal, setOpenAddModel] = useState(false)

  useEffect(() => {
    setCurrentPage(1)
  }, [sortBy, searchValue, existing])

  const handleOpenModal = () => {
    setOpenAddModel(true)
  }

  const handleSortChange = sortType => {
    setSortBy(sortType)
  }

  const handleSearchChange = value => {
    setSearchValue(value)
  }

  const showEye = id => {
    const product = findById(products, id)
    openView(product)
  }

  const handleRemoveProduct = id => {
    const product = findById(products, id)
    openDelete(product)
  }

  const confirmRemove = async () => {
    try {
      const res = await fetch('/api/products/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: selectedItem._id })
      })

      if (res.ok) {
        showNotification('success', 'محصول با موفقیت حذف شد')

        setProducts(prev => prev.filter(item => item._id !== selectedItem._id))

        closeDelete()
      } else {
        showNotification('error', 'خطا در حذف محصول')
      }
    } catch (error) {
      showNotification('error', 'خطا در ارتباط با سرور ')
    }
  }

  const handleProductAdded = newProduct => {
    setProducts(prev => [newProduct, ...prev])
  }
  const handleProductEdited = editProduct => {
    setProducts(prev =>
      prev.map(item => (item._id === editProduct._id ? editProduct : item))
    )
  }
  const handleEditModal = id => {
    const product = findById(products, id)
    openEdit(product)
  }

  return (
    <div className='space-y-6'>
      <Headeradmin
        title='محصولات'
        desc='مشاهده محصولات اضافه و حذف و ادیت محصولات'
        btncontent='اضافه کردن محصول'
        addbtn={true}
        handleOpenModal={handleOpenModal}
        excelactive={true}
        exportToExcel={exportToExcel}
        excelData={products}
        excelHeaders={{
          title: 'نام محصول',
          price: 'قیمت',
          discount: 'تخفیف',
          finalPrice: 'قیمت نهایی',
          isActive: 'وضعیت',
          totalQuantity: 'موجودی',
          soldCount:"تعداد فروش",
          isFeatured: 'ویژه',
          variants:"رنگ و سایز",
          createdAt: 'تاریخ ایجاد محصول',
          updatedAt: 'تاریخ اخرین اپدیت '
        }}
        excelFilename='products.csv'
      />
      <Cardnotification
        show={notification.show}
        title={notification.title}
        color={notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
        Icon={
          notification.type === 'success' ? FaCheck : HiOutlineExclamationCircle
        }
      />

      <Productadminnavbar
        filterActive={true}
        handleSortChange={handleSortChange}
        sortBy={sortBy}
        searchValue={searchValue}
        handleSearchChange={handleSearchChange}
        existing={existing}
        setExisting={setExisting}
        sortOptions={productSortOptions}
        toggleBtn={true}
      />

      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-right'>
            <thead className='bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm uppercase font-semibold'>
              <tr>
                <th className='p-4 rounded-tr-lg'>محصول</th>
                <th className='p-4'>دسته‌بندی</th>
                <th className='p-4'>قیمت</th>
                <th className='p-4'>موجودی</th>
                <th className='p-4'>وضعیت</th>
                <th className='p-4'>ویژه ها</th>
                <th className='p-4'>تخفیف</th>
                <th className='p-4'>تاریخ ایجاد</th>
                <th className='p-4 rounded-tl-lg'>عملیات</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-100 dark:divide-gray-700'>
              {currentItems.length > 0 ? (
                currentItems.map(product => (
                  <Rowproductadmin
                    key={product._id || product.id}
                    title={product.title}
                    totalQuantity={product.totalQuantity}
                    id={product._id || product.id}
                    date={product.createdAt}
                    isActive={product.isActive ? 'فعال' : 'غیرفعال'}
                    category={
                      typeof product.category === 'object'
                        ? product.category?.name
                        : categories.find(c => c._id === product.category)
                            ?.name || 'نامشخص'
                    }
                    price={product.price}
                    image={product.images[0]}
                    finalPrice={product.finalPrice}
                    discount={product.discount}
                    isFeatured={product.isFeatured ? 'ویژه' : 'غیرویژه'}
                    showEye={showEye}
                    handleRemoveProduct={handleRemoveProduct}
                    handleEditModal={handleEditModal}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan='8' className='p-4 text-center text-gray-500'>
                    محصولی یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagenationadminproduct
          allProducts={totalItems}
          indexOfLastProduct={indexOfLastItem}
          indexOfFirstProduct={indexOfFirstItem}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          currentPage={currentPage}
        />
      </div>
      <Deletemodal
        title={'حذف محصول'}
        desc={'آیا از  حذف محصول اطمینان دارید؟'}
        onConfirm={confirmRemove}
        confirmDelete={isDeleteOpen}
        onCancel={closeDelete}
      />
      <Modalshowproduct
        isOpenEye={isViewOpen}
        onClose={closeView}
        showedProduct={selectedItem}
      />
      <Modaleditproduct
        isOpen={isEditOpen}
        onClose={closeEdit}
        editProduct={selectedItem}
        categories={categories}
        onProductAdded={handleProductEdited}
      />
      <Modaladdproduct
        categories={categories}
        isOpen={openAddModal}
        onClose={() => setOpenAddModel(false)}
        onProductAdded={handleProductAdded}
      />
    </div>
  )
}
