'use client'
import {
  FaBullseye,
  FaHandshake,
  FaBolt,
  FaGem,
  FaHeart,
  FaLock,
  FaCrosshairs,
  FaShippingFast,
  FaHeadset,
  FaBox,
  FaStore
} from 'react-icons/fa'
import Herosection from '@/components/modules/aboutus/herosection/Herosection'

import Ourstory from '@/components/templates/aboutus/ourstory/Ourstory'
import { useHeight } from '@/components/utils/navHeightContext'
import { useDevice } from '@/components/utils/helper'

export default function Aboutuswrapper ({ productsCount }) {
  const { mobileNavHeight, desktopNavHeight } = useHeight()
  const isMobile = useDevice()
  const aboutData = {
    name: 'فروشگاه ما',
    tagline: 'بهترین انتخاب برای سبک زندگی شما',
    about: [
      {
        icon: FaBullseye,
        title: 'مأموریت ما',
        description:
          'تأمین نیازهای پوشاک مشتریان با ارائه محصولات باکیفیت، قیمت مناسب و خدمات عالی.'
      },
      {
        icon: FaCrosshairs,
        title: 'چشم‌انداز ما',
        description:
          'تبدیل شدن به اولین انتخاب مشتریان در صنعت پوشاک آنلاین با اعتماد و کیفیت.'
      },
      {
        icon: FaStore,
        title: 'درباره ما',
        description:
          'ما با بیش از ۱۵ سال تجربه در صنعت پوشاک، بهترین محصولات را با کیفیت بالا و قیمت مناسب به شما ارائه می‌دهیم. هدف ما رضایت مشتری و ارائه خدمات برتر است.'
      }
    ],
    values: [
      {
        icon: FaCrosshairs,
        title: 'کیفیت',
        desc: 'ارائه بهترین کیفیت در محصولات'
      },
      { icon: FaHandshake, title: 'اعتماد', desc: 'صداقت و شفافیت در خدمات' },
      { icon: FaBolt, title: 'سرعت', desc: 'ارسال سریع و مطمئن' },
      { icon: FaGem, title: 'ارزش', desc: 'بهترین قیمت برای مشتری' },
      { icon: FaHeart, title: 'مشتری', desc: 'اولویت اول رضایت شماست' }
    ],
    stats: [
      // { number: `${productsCount}+`, label: 'سال تجربه' },
      { number: `${productsCount}+`, label: 'محصول' },
      { number: '۵۰,۰۰۰+', label: 'مشتری راضی' },
      { number: '۴.۸', label: 'امتیاز از مشتریان' }
    ],

    contact: {
      phone: '۰۲۱-۱۲۳۴۵۶۷۸',
      email: 'info@example.com',
      address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
      hours: 'شنبه تا پنج‌شنبه: ۹ صبح تا ۹ شب'
    },
    features: [
      {
        icon: FaShippingFast,
        title: 'ارسال رایگان',
        desc: 'امکان ارسال رایگان برای سفارش‌های منتخب'
      },
      { icon: FaLock, title: 'پرداخت امن', desc: 'درگاه پرداخت معتبر' },
      {
        icon: FaHeadset,
        title: 'پشتیبانی ۲۴/۷',
        desc: 'پاسخگویی در تمام ساعات'
      },
      { icon: FaBox, title: 'بسته‌بندی مطمئن', desc: 'حفظ کیفیت محصولات' }
    ]
  }
  return (
    <div
      style={{
        marginTop: `${isMobile ? mobileNavHeight : desktopNavHeight}px`
      }}
      className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'
    >
      {/* Hero Section */}
      <Herosection aboutData={aboutData} />

      {/* Tab Content */}
      <main className='max-w-7xl mx-auto px-4 py-8 lg:py-12'>
        {/* داستان ما */}

        <Ourstory
          about={aboutData.about}
          features={aboutData.features}
          values={aboutData.values}
        />
      </main>
    </div>
  )
}
