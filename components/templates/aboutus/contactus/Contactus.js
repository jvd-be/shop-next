import Addrescard from '@/components/modules/aboutus/addrescard/Addrescard'
import Contactform from '@/components/modules/aboutus/contactform/Contactform'
import React from 'react'
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaClock,
  FaPhoneAlt,
} from 'react-icons/fa'
export default function Contactus({contact}) {
    console.log(contact.address);
    
    const contactInfo = [
  {
    icon: FaMapMarkerAlt,
    title: 'آدرس',
    value: contact.address,
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    icon: FaPhoneAlt,
    title: 'تلفن',
    value: contact.phone,
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
    fontMono: true
  },
  {
    icon: FaEnvelope,
    title: 'ایمیل',
    value: contact.email,
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    icon: FaClock,
    title: 'ساعات کاری',
    value: contact.hours,
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-600 dark:text-orange-400'
  }
]
  return (
  <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* اطلاعات تماس */}
            <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 shadow-sm'>
              <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-6'>
                اطلاعات تماس
              </h3>
              <div className='space-y-6'>
                {contactInfo.map((item,key)=>(

               <Addrescard key={key} Icon={item.icon} title={item.title} value={item.value} bgColor={item.bgColor} iconColor={item.iconColor} />
                ))}
              
              </div>
            </div>

            {/* فرم تماس */}
           <Contactform/>
          </div>
  )
}
