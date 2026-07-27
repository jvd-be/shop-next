export default function Statusbadge ({ status }) {
  let styles = 'bg-gray-100 text-gray-600 border-gray-200'

  switch (status) {
    case 'موفق':
      styles = 'bg-green-100 text-green-600 border-green-300'
      break
    case 'نیست':
      styles = 'bg-green-100 text-green-600 border-green-300'
      break
    case 'فعال':
      styles = 'bg-green-100 text-green-600 border-green-300'
      break
    case 'ارسال شده':
      styles = 'bg-green-100 text-green-600 border-green-300'
      break
    case 'غیرفعال':
      styles = 'bg-red-100 text-red-600 border-red-300'
      break
   
    case 'هست':
      styles = 'bg-red-100 text-red-600 border-red-300'
      break
    case 'ناموفق':
      styles = 'bg-red-100 text-red-600 border-red-300'
      break
    case 'پرداخت ناموفق':
      styles = 'bg-red-100 text-red-600 border-red-300'
      break
    case 'لغو شده':
      styles = 'bg-red-100 text-red-600 border-red-300'
      break
    case 'جدید':
      styles = 'bg-blue-100 text-blue-600 border-blue-300'
      break
    case 'ویژه':
      styles = 'bg-amber-100 text-amber-600 border-amber-300'
      break
    case 'غیرویژه':
      styles = 'bg-sky-100 text-sky-600 border-sky-300'
      break
    case 'در حال پردازش':
      styles = 'bg-amber-50 text-amber-700 border-amber-100'
      break
    default:
      break
  }

  return (
    <span
      className={`px-3 py-1 rounded-lg text-nowrap text-xs font-bold border ${styles}`}
    >
      {status}
    </span>
  )
}
