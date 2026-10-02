import React from 'react'
import Link from 'next/link'
import ConnectToDB from '@/app/lib/mongodb'
import Contactmodel from '@/model/Contactmodel'
import Socialmodel from '@/model/Socialmodel'
import { FaTelegram, FaInstagram, FaWhatsapp } from 'react-icons/fa'

const iconMap = {
  telegram: <FaTelegram className='w-5 h-5' />,
  instagram: <FaInstagram className='w-5 h-5' />,
  whatsapp: <FaWhatsapp className='w-5 h-5' />,
  eitaa: <span className='text-lg font-bold'>E</span>,
  rubika: <span className='text-lg font-bold'>R</span>
}

const colorMap = {
  telegram: 'hover:text-blue-400',
  instagram: 'hover:text-pink-500',
  whatsapp: 'hover:text-green-500',
  eitaa: 'hover:text-blue-500',
  rubika: 'hover:text-purple-500'
}

const Footer = async () => {
  await ConnectToDB()

  const contactsData = await Contactmodel.findOne().lean()
  const socialsData = await Socialmodel.findOne().lean()

  const contacts = contactsData
    ? JSON.parse(JSON.stringify(contactsData))
    : null
  const socials = socialsData ? JSON.parse(JSON.stringify(socialsData)) : null

  const socialLinks = socials?.items
    ?.filter(s => s.value && s.value.trim() !== '')
    ?.map(s => ({
      ...s,
      icon: iconMap[s.type],
      color: colorMap[s.type]
    }))

  return (
    <footer className='pt-4  bg-white dark:bg-linear-to-b dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-800'>
      <div className='max-w-7xl mx-auto p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10'>
          {/* درباره */}
          <div className='lg:col-span-5'>
            <h2 className='text-2xl font-bold text-cyan-400 mb-4'>درباره ما</h2>
            <p className='text-gray-400 text-[15px] leading-relaxed'>
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ.
            </p>
          </div>

          {/* لینک ها */}
          <div className='lg:col-span-3'>
            <h2 className='text-xl font-semibold text-white mb-5'>
              لینک‌های مفید
            </h2>

            <div className='flex flex-col gap-3 text-gray-400'>
              <Link href='/' className='hover:text-cyan-400'>
                خانه
              </Link>

              <Link href='/products' className='hover:text-cyan-400'>
                فروشگاه
              </Link>
              <Link href='/aboutus' className='hover:text-cyan-400'>
                درباره ما
              </Link>
              <Link href='/aboutus' className='hover:text-cyan-400'>
                شرایط بازگشت
              </Link>
            </div>
          </div>

          {/* تماس */}
          <div className='lg:col-span-4'>
            <h2 className='text-xl font-semibold text-white mb-5'>
              اطلاعات تماس
            </h2>

            {contacts?.storePhone && (
              <p>
                📞 تلفن فروشگاه:
                <a
                  href={`tel:${contacts?.storePhone}`}
                  className='mr-1 text-cyan-400 hover:underline'
                >
                  {contacts?.storePhone}
                </a>
              </p>
            )}

            {contacts?.mobilePhone && (
              <p>
                📱 موبایل:
                <a
                  href={`tel:${contacts?.mobilePhone}`}
                  className='mr-1 text-cyan-400 hover:underline'
                >
                  {contacts?.mobilePhone}
                </a>
              </p>
            )}
            {/* socials */}
            {socialLinks?.length > 0 && (
              <div className='mt-8'>
                <h3 className='text-sm uppercase tracking-widest mb-4 text-gray-300'>
                  ما را دنبال کنید
                </h3>

                <div className='flex gap-4'>
                  {socialLinks?.map(social => (
                    <a
                      key={social?._id}
                      href={social?.value}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={`w-11 h-11 flex items-center justify-center rounded-2xl text-white bg-gray-900 hover:bg-gray-800 border border-gray-700 transition ${social?.color}`}
                      aria-label={social?.label}
                    >
                      {social?.icon}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='border-t border-gray-800 py-6 text-center text-gray-500 text-sm'>
        © ۱۴۰۵ تمامی حقوق محفوظ است
      </div>
    </footer>
  )
}

export default Footer
