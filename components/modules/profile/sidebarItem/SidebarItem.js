const Sidebaritem = ({ icon, label, isActive, onClick, color = "" }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive 
        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium shadow-sm' 
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
    } ${color}`}
  >
    {icon}
    <span>{label}</span>
  </button>
)

export default Sidebaritem