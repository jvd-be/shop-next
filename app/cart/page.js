import Cartwrapper from '@/components/templates/cartwrapper/Cartwrapper'
import Footer from '@/components/templates/footer/Footer'
import Menumobile from '@/components/templates/menuMoblie/Menumobile'
import Navbar from '@/components/templates/navbar/Navbar'
import ConnectToDB from '@/app/lib/mongodb'
import ShippingModel from '@/model/Shippingmodel'
import Usermodel from '@/model/Usermodel'
import { getAuthFromCookies } from '@/components/utils/authServer'

export const metadata = {
  title: 'سبد خرید | تکمیل سفارش',
  description:
    'مشاهده محصولات انتخاب‌شده، بررسی هزینه ارسال و ادامه فرایند خرید.',
  robots: {
    index: false,
    follow: false,
    nocache: true
  },
  alternates: {
    canonical: '/cart'
  },
  openGraph: {
    title: 'سبد خرید | تکمیل سفارش',
    description:
      'محصولات انتخاب‌شده خود را بررسی کرده و سفارش خود را تکمیل کنید.',
    url: '/cart',
    type: 'website'
  }
}
export default async function CartPage() {
  let shippingData = null
  let address = []

  try {
    await ConnectToDB()

    shippingData = await ShippingModel.findOne().lean()

    const auth = await getAuthFromCookies()

    if (auth?.isLoggedIn) {
const user = await Usermodel.findById(auth.user.userId)
  .select("addresses")
  .lean()
  
  address = JSON.parse(JSON.stringify(user?.addresses || []))

}
} catch (error) {
  console.error("خطا در دریافت اطلاعات:", error)
}

const shippings = shippingData
? JSON.parse(JSON.stringify(shippingData))
: null
  

  
  return (
    <div>
      <Navbar />
      <Menumobile />
      <Cartwrapper
        shippings={shippings}
        address={address}
      />
      <Footer />
    </div>
  )
}