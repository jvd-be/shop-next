import React from 'react'
import Statscard from '../statscard/Statscard'

export default function Herosection({aboutData}) {
  return (
 <section className="relative bg-linear-to-br from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">{aboutData.name}</h1>
            <p className="text-lg lg:text-xl text-blue-100 mb-8">{aboutData.tagline}</p>
            <p className="text-blue-100/80 leading-relaxed hidden lg:block">
              {aboutData.description}
            </p>
          </div>

          {/* Stats */}
          <Statscard stats={aboutData.stats}/>
        </div>
      </section>
  )
}
