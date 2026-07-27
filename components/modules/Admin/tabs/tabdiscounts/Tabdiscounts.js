import React, { useState } from 'react'
import {
  FaTrash,
  FaPlus,
  FaEdit,
  FaCheck,
  FaTimes,
  FaCopy
} from 'react-icons/fa'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { UseNotification } from '@/components/hooks/UseNotification'
import Cardnotification from '@/components/modules/cardnotification/Cardnotification'
import Deletemodal from '@/components/modules/cart/deletemodal/Deletemodal'
export default function Tabdiscounts ({
  addDiscount,
  updateDiscount,
  deleteDiscount,
  toggleDiscountActive,
  discountSettings = [],
  setDiscountSettings
}) {
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedDeleteId, setSelectedDeleteId] = useState(null)

  const { notification, showNotification } = UseNotification()
  const isTempId = id => String(id).startsWith('temp')

  const createTempRow = () => {
    const tempId = 'temp-' + Date.now()

    const newRow = {
      _id: tempId,
      code: '',
      typediscount: 'Percent',
      value: 0,
      status: true,
      usageLimit: null,
      usedCount: 0,
      minPurchase: 0,
      perUserLimit: 1,
      firstPurchaseOnly: false,
      expiredDate: ''
    }

    setDiscountSettings(prev => [newRow, ...(prev || [])])
    setEditingId(tempId)
    setFormData(newRow)
  }

  const startEdit = discount => {
    setEditingId(discount._id)
    setFormData({ ...discount })
  }

  const cancelEdit = () => {
    if (isTempId(editingId)) {
      setDiscountSettings(prev => prev.filter(d => d._id !== editingId))
    }

    setEditingId(null)
    setFormData(null)
  }

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }

      if (field === 'typediscount' && value === 'Shipping') {
        updated.value = 0
      }

      return updated
    })
  }

  const saveEdit = async () => {
    if (!formData.code) {
      showNotification('error', 'کد تخفیف را وارد کنید')
      return
    }

    if (formData.code.length < 4) {
      showNotification('error', 'کد تخفیف باید حداقل ۴ کاراکتر باشد')
      return
    }

    if (formData.typediscount !== 'Shipping' && !formData.value) {
      showNotification('error', 'مقدار تخفیف را وارد کنید')
      return
    }

    if (!formData.minPurchase) {
      showNotification('error', 'حداقل خرید مشخص نشده')
      return
    }

    try {
      if (isTempId(editingId)) {
        const created = await addDiscount?.(formData)

        if (!created) {
          showNotification('error', 'ثبت تخفیف ناموفق بود')
          return
        }

        setDiscountSettings(prev =>
          prev.map(d => (d._id === editingId ? created : d))
        )

        showNotification('success', 'کد تخفیف ثبت شد')
      } else {
        const updated = await updateDiscount?.(editingId, formData)

        if (!updated) {
          showNotification('error', 'ویرایش انجام نشد')
          return
        }

        setDiscountSettings(prev =>
          prev.map(d => (String(d._id) === String(editingId) ? updated : d))
        )

        showNotification('success', 'ویرایش با موفقیت انجام شد')
      }

      setEditingId(null)
      setFormData(null)
    } catch (err) {
      console.error(err)
      showNotification('error', 'خطا در ذخیره تخفیف')
    }
  }

  const copyCode = code => {
    navigator.clipboard.writeText(code)
  }
  const formatNumber = num => {
    if (num === null || num === undefined) return ''
    return Number(num).toLocaleString('en-US')
  }

  const parseNumber = val => {
    return Number(String(val).replace(/,/g, ''))
  }

  const confirmRemove = async () => {
    if (!selectedDeleteId) return

    try {
      const success = await deleteDiscount(selectedDeleteId)

      if (!success) {
        showNotification('error', 'حذف انجام نشد')
        return
      }

      setDiscountSettings(prev =>
        prev.filter(d => String(d._id) !== String(selectedDeleteId))
      )

      showNotification('success', 'کد تخفیف حذف شد')
    } catch (err) {
      console.error(err)
      showNotification('error', 'خطا در حذف کد تخفیف')
    } finally {
      closeDelete()
    }
  }

  const openDelete = id => {
    setSelectedDeleteId(id)
    setIsDeleteOpen(true)
  }
  const closeDelete = () => {
    setSelectedDeleteId(null)
    setIsDeleteOpen(false)
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <h3 className='text-2xl font-bold  dark:text-white'>کدهای تخفیف</h3>

        <button
          onClick={createTempRow}
          className='flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-xl'
        >
          <FaPlus /> جدید
        </button>
      </div>
      <Cardnotification
        show={notification.show}
        title={notification.title}
        color={notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
        Icon={
          notification.type === 'success' ? FaCheck : HiOutlineExclamationCircle
        }
      />

      <Deletemodal
        title={'حذف کد'}
        desc={'آیا از حذف کد تخفیف اطمینان دارید؟'}
        confirmDelete={isDeleteOpen}
        onConfirm={confirmRemove}
        onCancel={closeDelete}
      />

      <div className='bg-white dark:bg-gray-800  dark:text-gray-100 rounded-2xl shadow overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead className='bg-gray-100 dark:bg-gray-900'>
            <tr>
              <th className='p-4 text-right'>کد</th>
              <th className='p-4 text-right'>نوع</th>
              <th className='p-4 text-right'>مقدار</th>
              <th className='p-4 text-right'>حداقل خرید</th>
              <th className='p-4 text-right'>حد استفاده</th>
              <th className='p-4 text-right'>استفاده شده</th>
              <th className='p-4 text-right'>انقضا</th>
              <th className='p-4 text-right'>وضعیت</th>
              <th className='p-4 text-center'>عملیات</th>
            </tr>
          </thead>

          <tbody>
            {discountSettings.map(discount => {
              const editing = String(editingId) === String(discount._id)

              return (
                <tr key={discount._id} className='border-b'>
                  {/* Code */}
                  <td className='p-4'>
                    {editing ? (
                      <input
                        type='text'
                        value={formData.code.toUpperCase()}
                        onChange={e => handleChange('code', e.target.value)}
                        className='border rounded px-3 py-2 w-full'
                      />
                    ) : (
                      <div className='flex items-center gap-2 font-mono'>
                        {discount.code.toUpperCase()}
                        <FaCopy
                          size={14}
                          className='cursor-pointer text-gray-400'
                          onClick={() => copyCode(discount.code)}
                        />
                      </div>
                    )}
                  </td>

                  {/* Type */}
                  <td className='p-4'>
                    {editing ? (
                      <select
                        value={formData.typediscount}
                        onChange={e =>
                          handleChange('typediscount', e.target.value)
                        }
                        className='border rounded px-3 py-2 w-full'
                      >
                        <option value='Percent'>درصد</option>
                        <option value='Fixed'>مبلغ ثابت</option>
                        <option value='Shipping'>ارسال رایگان</option>
                      </select>
                    ) : discount.typediscount === 'Shipping' ? (
                      'ارسال رایگان'
                    ) : (
                      discount.typediscount
                    )}
                  </td>

                  {/* Value */}
                  <td className='py-4 px-2'>
                    {editing ? (
                      formData.typediscount === 'Shipping' ? (
                        'ارسال رایگان'
                      ) : (
                        <input
                          type='text'
                          value={formatNumber(formData.value)}
                          onChange={e =>
                            handleChange(
                              'value',
                              parseNumber(e.target.value) || 0
                            )
                          }
                          className='border rounded px-3 py-2 w-full'
                        />
                      )
                    ) : discount.typediscount === 'Shipping' ? (
                      'ارسال رایگان'
                    ) : (
                      formatNumber(discount.value)
                    )}
                  </td>

                  {/* Min Purchase */}
                  <td className='py-4'>
                    {editing ? (
                      <input
                        type='text'
                        value={formatNumber(formData.minPurchase)}
                        onChange={e =>
                          handleChange(
                            'minPurchase',
                            parseNumber(e.target.value) || 0
                          )
                        }
                        className='border rounded px-3 py-2 w-full'
                      />
                    ) : (
                      formatNumber(discount.minPurchase)
                    )}
                  </td>

                  {/* Usage Limit */}
                  <td className='p-4'>
                    {editing ? (
                      <input
                        type='number'
                        value={formData.usageLimit ?? ''}
                        onChange={e =>
                          handleChange(
                            'usageLimit',
                            Number(e.target.value) || 0
                          )
                        }
                        className='border rounded px-3 py-2 w-full'
                      />
                    ) : (
                      discount.usageLimit ?? '—'
                    )}
                  </td>

                  <td className='p-4'>{discount.usedCount}</td>

                  {/* Expire */}
                  <td className='p-4'>
                    {editing ? (
                      <input
                     type='datetime-local'
                        value={formData.expiredDate ?? ''}
                        onChange={e =>
                          handleChange('expiredDate', e.target.value)
                        }
                        className='border rounded px-3 py-2 w-full'
                      />
                    ) : discount.expiredDate ? (
                      new Date(discount.expiredDate).toLocaleDateString('fa-IR')
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Status */}
                  <td className='p-4'>
                    <button
                      onClick={() => toggleDiscountActive?.(discount._id)}
                      className={`px-3 py-1 rounded-full text-xs ${
                        discount.status
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {discount.status ? 'فعال' : 'غیرفعال'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className='p-4 text-center'>
                    {editing ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className='text-green-600 mx-2'
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className='text-red-600 mx-2'
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(discount)}
                          className='text-blue-600 mx-2'
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => openDelete(discount._id)}
                          className='text-red-600 mx-2'
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
