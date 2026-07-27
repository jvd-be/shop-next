import { FiTrash2 } from "react-icons/fi"

const Addresscard = ({ address, onEdit, onDelete }) => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 relative hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
    {address.isDefault && <span className="absolute top-4 left-4 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-medium">پیش‌فرض</span>}
    <h4 className="font-bold mb-1">{address.title}</h4>
    <p className="text-gray-600 dark:text-gray-300 text-sm mb-1 leading-relaxed">{address.address}</p>
    <p className="text-xs text-gray-500 mb-3">گیرنده: {address.receiver} | کد پستی: {address.postalCode}</p>
    <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
      <button onClick={() => onEdit(address.id)} className="text-sm text-blue-600 hover:underline">ویرایش</button>
      <button onClick={() => onDelete(address.id)} className="text-sm text-red-500 hover:underline flex items-center gap-1"><FiTrash2 size={14} /> حذف</button>
    </div>
  </div>
)

export default Addresscard