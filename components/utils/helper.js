
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

export const exportToExcel = () => {
  if (filteredUsers.length === 0) return

  // تعریف هدرها
  const headers = ['نام', 'ایمیل', 'تلفن', 'نقش', 'وضعیت']

  // تبدیل داده‌ها به فرمت CSV
  const csvContent = [
    headers.join(','), // هدر
    ...filteredUsers.map(
      user =>
        `${user.name},${user.email},${user.phone},${user.role},${user.status}`
    )
  ].join('\n')

  // ایجاد فایل و دانلود
  const blob = new Blob(['\ufeff' + csvContent], {
    type: 'text/csv;charset=utf-8;'
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', 'users_export.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const formatDate = dateString => {
  return new Date(dateString).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const toPersianDigits = (num) =>
  num.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d])
 

export function calculateTrend(current, previous) {
  const currentNum = Number(current) || 0
  const previousNum = Number(previous) || 0
 
  // اگر مقدار ماه قبل صفر یا نامعتبر بود
  if (!previousNum) {
    // اگر این ماه هم صفر بود، یعنی هیچ تغییری نداشتیم
    if (!currentNum) {
      return { trend: '۰٪', isPositive: true }
    }
    // رشد از صفر به یک عدد مثبت، یعنی رشد ۱۰۰٪
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