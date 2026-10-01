import React from 'react'
import Navbar from '@/components/templates/navbar/Navbar'
import Menumobile from '@/components/templates/menuMoblie/Menumobile'
import Footer from '@/components/templates/footer/Footer'
import Productswrapper from '@/components/templates/productswrapper/Productswrapper'
import ConnectToDB from '../lib/mongodb'
import ProductModel from '@/model/ProductModel'
import { getAuthFromCookies } from '@/components/utils/authServer'
import Usermodel from '@/model/Usermodel'
import Categorymodel from '@/model/Categorymodel'
import Banners from '@/components/templates/banners/Banners'
import { Getbanners } from '@/components/utils/helperServer'
import Headermobile from '@/components/modules/headermobile/Headermobile'
import GeneralModel from '@/model/GeneralModel'
export default async function Products ({ searchParams }) {
  const auth = await getAuthFromCookies()
  let productsData = []
  let totalProducts
  let userData = []
  let categoryiesData = []
  let logoData = null
  const banners = await Getbanners()
  const params = await searchParams
  const page = Math.max(1, params.page)
  const limit = 8
  const skip = (page - 1) * limit
  try {
    await ConnectToDB()
    logoData = await GeneralModel.findOne(
      {},
      { siteLogo: 1, siteName: 1 }
    ).lean()
    productsData = await ProductModel.find({ isActive: true })
      .sort({ totalQuantity: -1 })
      .skip(skip)
      .limit(limit)
      .populate('category')
      .lean()

    totalProducts = await ProductModel.countDocuments()

    categoryiesData = await Categorymodel.find({ isActive: true }).lean()
    if (auth?.isLoggedIn && auth?.user?.userId) {
      userData = await Usermodel.findById(auth.user.userId)
        .populate('wishlist')
        .lean()
    }
  } catch (error) {
    console.error('Error fetching products:', error)
  }
  const products = JSON.parse(JSON.stringify(productsData))
  const currentUser = JSON.parse(JSON.stringify(userData))
  const categories = JSON.parse(JSON.stringify(categoryiesData))
  const totalPages = Math.ceil(totalProducts / limit)
  const logo = JSON.parse(JSON.stringify(logoData))


  return (
    <div className='dark:bg-gray-800'>

      <Headermobile  logo={logo} banners={banners}  />
      <Navbar />
      <Menumobile />
      <Productswrapper
        products={products}
        user={currentUser}
        categories={categories}
        totalProducts={totalProducts}
        totalPages={totalPages}
        currentPage={page}
      />
      <Footer />
    </div>
  )
}
