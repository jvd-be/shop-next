'use client'

import { useEffect, useState } from 'react'

export function cleanNumberInput (value) {
  return value.replace(/\D/g, '')
}

export function handleNumberInput ({ e, field, setFormData, isPrice = false }) {
  const rawValue = e.target.value
  const cleanedValue = rawValue.replace(/\D/g, '')

  setFormData(prev => ({
    ...prev,
    [field]: cleanedValue
  }))
}

export const findById = (items, id, key = '_id') => {
  return items.find(item => item[key] === id)
}

// تابع استخراج اکسل (CSV)

export const exportToExcel = ({
  data = [],
  headers = {},
  filename = 'export.csv'
}) => {
  const keys = Object.keys(headers)
  const headerRow = Object.values(headers)

  const escapeCsvValue = value => {
    if (value === null || value === undefined) return ''

    const stringValue = String(value)

    if (
      stringValue.includes(',') ||
      stringValue.includes('"') ||
      stringValue.includes('\n')
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }

    return stringValue
  }

  const formatValue = value => {
    // اگر آرایه بود
    if (Array.isArray(value)) {
      return value
        .map(item => {
          // اگر آبجکت بود
          if (item && typeof item === 'object') {
            return Object.values(item)
              .filter(v => v !== null && v !== undefined)
              .join(' - ')
          }

          return item
        })
        .join(' | ')
    }

    // اگر آبجکت ساده بود
    if (value && typeof value === 'object') {
      return JSON.stringify(value)
    }

    return value
  }

  const csvRows = []

  // Header
  csvRows.push(headerRow.map(header => escapeCsvValue(header)).join(','))

  // Data
  for (const item of data) {
    const row = []

    for (const key of keys) {
      const value = formatValue(item[key])
      row.push(escapeCsvValue(value))
    }

    csvRows.push(row.join(','))
  }

  const csvContent = csvRows.join('\n')

  const blob = new Blob(['\ufeff' + csvContent], {
    type: 'text/csv;charset=utf-8;'
  })

  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

export const formatDate = dateString => {
  return new Date(dateString).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const toPersianDigits = num =>
  num.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d])

export function calculateTrend (current, previous) {
  const currentNum = Number(current) || 0
  const previousNum = Number(previous) || 0

  if (!previousNum) {
    if (!currentNum) {
      return { trend: '۰٪', isPositive: true }
    }
    return { trend: '+۱۰۰٪', isPositive: true }
  }

  const diff = currentNum - previousNum
  const percent = Math.abs((diff / previousNum) * 100).toFixed(0)
  const sign = diff >= 0 ? '+' : '-'

  return {
    trend: `${sign}${toPersianDigits(percent)}٪`,
    isPositive: diff >= 0
  }
}

export function useDevice () {
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const reSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    reSize()

    window.addEventListener('resize', reSize)

    return () => window.removeEventListener('resize', reSize)
  }, [])
  return isMobile
}
