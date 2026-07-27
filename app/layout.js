import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/utils/ThemeContext'
import CartProvider from '@/components/utils/CartContext'
import { getAuthFromCookies } from '@/components/utils/authServer'
import ConnectToDB from '@/app/lib/mongodb'
import GeneralModel from '@/model/GeneralModel'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

const fallbackSiteUrl = 'https://maahshope.com'
const fallbackSiteName = 'ماه شاپ'
const fallbackDescription =
  'فروشگاه اینترنتی خرید لباس زنانه با تنوع بالا، قیمت مناسب و ارسال سریع.'

export async function generateMetadata () {
  let general = null

  try {
    await ConnectToDB()
    general = await GeneralModel.findOne().lean()
  } catch (error) {
    console.error('خطا در دریافت تنظیمات سئو سایت:', error)
  }

  const siteUrl = general?.siteUrl || fallbackSiteUrl
  const siteName = general?.siteName || fallbackSiteName
  const description = general?.siteDescription || fallbackDescription
  const defaultOgImage =
    general?.defaultOgImage || `${siteUrl}/images/og-default.jpg`

  return {
    metadataBase: new URL(siteUrl),

    title: {
      default: siteName,
      template: `%s | ${siteName}`
    },

    description,

    keywords: [
      'خرید لباس زنانه',
      'فروشگاه لباس زنانه',
      'مانتو زنانه',
      'لباس مجلسی زنانه',
      'ماه شاپ'
    ],

    applicationName: siteName,

    authors: [
      {
        name: siteName,
        url: siteUrl
      }
    ],

    creator: siteName,
    publisher: siteName,

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1
      }
    },

    alternates: {
      canonical: '/'
    },

    openGraph: {
      title: siteName,
      description,
      url: siteUrl,
      siteName,
      type: 'website',
      locale: 'fa_IR',
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: siteName
        }
      ]
    },

    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description,
      images: [defaultOgImage],
      creator: general?.twitterHandle || undefined
    },

    icons: {
      icon: general?.favicon || '/favicon.ico',
      shortcut: general?.favicon || '/favicon.ico',
      apple: general?.appleIcon || '/apple-touch-icon.png'
    },

    category: 'shopping'
  }
}

export default async function RootLayout ({ children }) {
  const { isLoggedIn } = await getAuthFromCookies()

  return (
 <html lang="fa" dir="rtl" suppressHydrationWarning>
     <body
  className={`${geistSans.variable} ${geistMono.variable} bg-white text-gray-900 dark:bg-gray-800 dark:text-white`}
>
        <ThemeProvider>
          <CartProvider isLoggedIn={isLoggedIn}>{children}</CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
      