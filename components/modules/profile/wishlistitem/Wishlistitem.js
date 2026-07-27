import { FiShoppingBag,FiTrash2 } from "react-icons/fi"

const Wishlistitem = ({ item, onRemove, onAddToCart }) => {
  return (
    <div className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
      <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-700">
        <button 
          onClick={() => onRemove(item.id)}
          className="absolute top-3 left-3 z-20 bg-white dark:bg-gray-900 p-2 rounded-full text-gray-500 hover:text-white hover:bg-red-500 transition-all shadow-md border border-gray-200 dark:border-gray-600"
          title="حذف از لیست"
        >
          <FiTrash2 size={18} />
        </button>
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </div>
      <div className="p-4 flex flex-col grow">
        <h4 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">{item.title}</h4>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{item.price} تومان</p>
        <button 
          onClick={() => onAddToCart(item.id)}
          className="w-full mt-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium shadow-sm hover:shadow-md"
        >
          <FiShoppingBag size={16} />
          افزودن به سبد
        </button>
      </div>
    </div>
  )
}

export default Wishlistitem