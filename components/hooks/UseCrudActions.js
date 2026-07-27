import { useState } from 'react'

export default function UseCrudActions () {
  const [selectedItem, setSelectedItem] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const openView = id => {
    setSelectedItem(id)
    setIsViewOpen(true)
  }
  const closeView = () => {
    setIsViewOpen(false)
  }
  const openEdit = item => {
    setSelectedItem(item)
    setIsEditOpen(true)
  }

  const closeEdit = () => {
    setIsEditOpen(false)
  }
  const openDelete = item => {
    setSelectedItem(item)
    setIsDeleteOpen(true)
  }

  const closeDelete = () => {
    setIsDeleteOpen(false)
  }

  return {
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
  }
}
