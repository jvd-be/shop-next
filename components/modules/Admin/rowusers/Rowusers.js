import {
  FaEnvelope,
  FaEye,
  FaPhone,
  FaUserCheck,
  FaUserSlash
} from 'react-icons/fa'
import Statusbadge from '../statusbadgue/Statusbadgue'
import { HiBan } from 'react-icons/hi'
export default function Rowusers ({
  user,
  handleShowUser,
  handleToggleStatus,
  handleToggleBan,
  adminRole
}) {
  const maskPhone = phone => {
    if (!phone || phone.length < 8) return phone

    const start = phone.slice(0, 4)
    const end = phone.slice(-4)
    return `${start}****${end}`
  }
  const maskEmail = email => {
    if (!email || !email.includes('@')) return email

    const [name, domain] = email.split('@')

    const visibleCount = Math.min(2, name.length)
    const maskedName = name.slice(0, visibleCount) + '****'

    return `${maskedName}@${domain}`
  }
  return (
    <tr className='dark:hover:bg-gray-700 hover:bg-gray-100 transition-colors'>
      <td className='p-4 flex items-center gap-3'>
        <img
          src={user.avatar || '/images/defaultavatar.webp'}
          alt={user.name || 'User Avatar'}
          className='w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600'
        />
        {adminRole === 'SUPER_ADMIN' ? (
          <span className='font-medium text-gray-800 dark:text-gray-200'>
            {user?.phone}
          </span>
        ) : (
          <span className='font-medium text-gray-800 dark:text-gray-200'>
            {user.name || (
              <span
                className='ltr'
                style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
              >
                {maskPhone(user?.phone)}
              </span>
            )}
          </span>
        )}
      </td>
      <td className='p-4 text-gray-600 dark:text-gray-400 dir-ltr text-right'>
        <span className='flex items-center gap-2'>
          <FaPhone className='text-gray-400 text-xs text-right' />
          {adminRole === 'SUPER_ADMIN' ? (
            <span className='font-medium text-gray-800 dark:text-gray-200'>
              {user.phone}
            </span>
          ) : (
            <span
              className='ltr'
              style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
            >
              {maskPhone(user?.phone)}
            </span>
          )}
        </span>
      </td>
      <td className='p-4 text-gray-600 dark:text-gray-400 dir-ltr text-right'>
        <span className='flex items-center gap-2'>
          <FaEnvelope className='text-gray-400 text-xs ltr' />
          {adminRole === 'SUPER_ADMIN' ? (
            <span className='font-medium text-gray-800 dark:text-gray-200'>
              {user?.email ? user.email : 'نامشخص'}
            </span>
          ) : (
            <span
              className='ltr'
              style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
            >
              {user?.email ? maskEmail(user?.email) : 'نامشخص'}
            </span>
          )}
        </span>
      </td>

      <td className='p-4'>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            user.role === 'SUPER_ADMIN'
              ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
              : user.role === 'ADMIN'
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          {user.role}
        </span>
      </td>
      <td className='p-4'>
        <Statusbadge status={user.isActive ? 'فعال' : 'غیرفعال'} />
      </td>
      <td className='p-4'>
        <Statusbadge status={user.isBanned ? 'هست' : 'نیست'} />
      </td>
      <td className='p-4'>
        <div className='flex justify-center gap-3'>
          <button
            onClick={() => handleToggleStatus(user._id)}
            title={user.isActive ? 'غیرفعال کردن' : 'فعال کردن'}
            className={`p-2 rounded-lg transition-colors ${
              user.isActive
                ? 'text-green-600 hover:bg-green-50'
                : 'text-yellow-600 hover:bg-yellow-50'
            }`}
          >
            {user.isActive ? <FaUserCheck /> : <FaUserSlash />}
          </button>

          <button
            onClick={() => handleToggleBan(user._id)}
            className={`p-2 rounded-lg transition-colors ${
              user.isBanned
                ? 'text-red-600 hover:bg-red-50'
                : 'text-green-600 hover:bg-green-50'
            }`}
            title={`${user.isBanned ? 'رفع بن' : 'بن کردن'}`}
          >
            {user.isBanned ? <HiBan /> : <FaUserCheck />}
          </button>

          <button
            onClick={() => {
              handleShowUser(user._id)
            }}
            className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
            title='نمایش اطلاعات'
          >
            <FaEye />
          </button>
        </div>
      </td>
    </tr>
  )
}
