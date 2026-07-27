import { useState } from "react";
import { FaSortAmountDownAlt, FaCheck } from "react-icons/fa";

const SORT_OPTIONS = [
  { value: 'default', label: 'پیش‌فرض' },
  { value: 'newest', label: 'جدیدترین' },
  { value: 'price-asc', label: 'ارزان‌ترین' },
  { value: 'price-desc', label: 'گران‌ترین' },
  { value: 'best-discount', label: 'بیشترین تخفیف' },
  { value: 'best-sales', label: 'بیشترین فروش' }
]
export default function Sortdropdown({ sortBy, setSortBy }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSort = (value) => {
    setSortBy(value);
    setIsOpen(false);
  };

  const currentSort =
    SORT_OPTIONS.find((item) => item.value === sortBy) || SORT_OPTIONS[0];

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors duration-300 w-full md:w-auto"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaSortAmountDownAlt className="h-5 w-5 text-blue-500" />
        <span className="text-blue-500">{currentSort.label}</span>
      </button>

      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 flex flex-col origin-top-right overflow-hidden"
          role="menu"
        >
          {SORT_OPTIONS.map((item) => {
            const isActive = sortBy === item.value;

            return (
              <button
                key={item.value}
                onClick={() => handleSort(item.value)}
                className={`flex items-center justify-between w-full text-right px-4 py-2 text-sm transition-colors
                  ${
                    isActive
                      ? "bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                role="menuitem"
              >
                <span>{item.label}</span>
                {isActive && <FaCheck className="text-xs" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
