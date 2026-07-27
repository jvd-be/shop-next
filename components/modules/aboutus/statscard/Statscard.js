import React from 'react'

export default function Statscard({stats}) {
  return (
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mt-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 lg:p-6"
              >
                <div className="text-2xl lg:text-4xl font-bold mb-1">{stat.number}</div>
                <div className="text-blue-100 text-sm lg:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
  )
}
