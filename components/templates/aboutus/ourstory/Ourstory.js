import React from 'react'
import Valuecard from '@/components/modules/aboutus/valuecard/Valuecard'
import Missioncard from '@/components/modules/aboutus/missioncard/Missioncard'
import Featurecard from '@/components/modules/aboutus/featurecard/Featurecard'
export default function Ourstory ({ about,values,features}) {
  return (
    <div className='space-y-8'>
      {/* Mission & Vision */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
  {about.map((item, index) => (
    <div
      key={index}
      className={index === about.length - 1 ? 'md:col-span-2' : ''}
    >
      <Missioncard
        title={item.title}
        Icon={item.icon}
        description={item.description}
      />
    </div>
  ))}
</div>
      {/* Values */}
      <div>
        <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-6'>
          ارزش‌های ما
        </h3>
<div className="flex flex-wrap gap-4">
  {values.map((value, index) => (
    <div key={index} className="flex-1 min-w-45">
      <Valuecard value={value} />
    </div>
  ))}
</div>


      </div>

      {/* Features */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        {features.map((feature, index) => (
        <Featurecard key={index} Icon={feature.icon} title={feature.title} desc={feature.desc} />
        ))}
      </div>
    </div>
  )
}
