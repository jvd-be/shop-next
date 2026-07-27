import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import Link from 'next/link'

export default function Category({categories}) {
  return (
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
            دسته‌بندی‌ها
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">
              ۵ دسته
            </span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categories.map((cat) => (
              <Link 
                href={`/products/${cat.slug}`} 
                key={cat._id}
                className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
              >
                <div className="aspect-4/5 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent opacity-90" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-lg font-bold mb-1">{cat.name}</h3>
                  <p className="text-xs text-gray-200 mb-3 line-clamp-2">{cat.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cat.color}`}>
                      {cat.count} محصول
                    </span>
                    <FaArrowRight className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

  )
}
