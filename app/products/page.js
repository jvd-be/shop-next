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
export default async function Products () {
  const auth = await getAuthFromCookies()
  let productsData = []
  let userData = []
  let categoryiesData = []
  try {
    await ConnectToDB()

    productsData = await ProductModel.find().populate('category').lean()
    categoryiesData = await Categorymodel.find().lean()
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

  return (
    <div>
      <Navbar />
      <Menumobile />
      <Productswrapper products={products} user={currentUser} categories={categories} />
      <Footer />
    </div>
  )
}
