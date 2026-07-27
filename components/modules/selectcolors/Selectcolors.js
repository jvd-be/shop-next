'use client'

export default function Selectcolors ({
  colors,
  selectedColor,
  setSelectedColor
}) {
  return (
    <div>
      <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
        رنگ:{' '}
        <span className='text-gray-900 dark:text-white'>
          {selectedColor?.colorName || 'انتخاب نشده'}
        </span>
      </h3>
      <div className='flex gap-3'>
        {colors.map(color => (
          <button
            key={color.colorName}
            onClick={() => setSelectedColor(color)}
            className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full border-4 transition-all ${
              selectedColor.colorName === color.colorName
                ? 'border-blue-500 dark:border-blue-400 scale-110'
                : 'border-transparent hover:scale-105'
            }`}
            style={{ backgroundColor: color.color }}
            title={color.colorName}
          />
        ))}
      </div>
    </div>
  )
}
