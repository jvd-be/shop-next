import React, { useMemo, useState } from 'react'

export default function UsePagination (data, itemsPerPage = 4) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalItems = data?.length || []
  const indexOfLastItem = itemsPerPage * currentPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const currentItems = useMemo(() => {
    return data?.slice(indexOfFirstItem, indexOfLastItem)
  }, [data, indexOfFirstItem, indexOfLastItem])
  return {
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    indexOfFirstItem,
    indexOfLastItem,
    currentItems
  }
}
