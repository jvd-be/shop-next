import { useMemo } from 'react'

export default function UsePaginationBackend (
  totalProducts,
  currentPage,
  itemsPerPage = 8
) {
  const totalItems = totalProducts

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage

  const indexOfLastItem = Math.min(indexOfFirstItem + itemsPerPage, totalItems)

  return useMemo(
    () => ({
      currentPage,
      totalPages,
      totalItems,
      indexOfFirstItem,
      indexOfLastItem
    }),
    [currentPage, totalPages, totalItems, indexOfFirstItem, indexOfLastItem]
  )
}
