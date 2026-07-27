import Headersection from '@/components/modules/aboutus/headersection/Headersection'
import Membercard from '@/components/modules/aboutus/membercard/Membercard'
import React from 'react'

export default function Ourteam ({ team }) {
  return (
    <div>
      <Headersection
        title={'تیم ما'}
        desc={'با افراد متخصص و باتجربه ما آشنا شوید'}
      />
      <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
        {team.map((member, index) => (
          <Membercard key={index} member={member} />
        ))}
      </div>
    </div>
  )
}
