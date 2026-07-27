import React from 'react'
import StatusBadge from '../statusbadgue/Statusbadgue'

export default function Rowtable ({ performer, eventname, date, status }) {
  return (
    <tr className='border-b dark:border-gray-700'>
      <td className='p-3'>{performer}</td>
      <td className='p-3'>{eventname}</td>
      <td className='p-3'>{date}</td>
      <td className='p-3'>
       <StatusBadge status={status}/>
      </td>
    </tr>
  )
}
