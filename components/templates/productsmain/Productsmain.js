import ConnectToDB from '@/app/lib/mongodb'
import ProductModel from '@/model/ProductModel'
import React from 'react'
import Productmainwrapper from '../productmainwrapper/Productmainwrapper'
import Usermodel from '@/model/Usermodel'
import { getAuthFromCookies } from '@/components/utils/authServer'
import Blogmodel from '@/model/Blogmodel'

export default async function Productsmain () {
  const auth = await getAuthFromCookies()

  let lastProductsData = []
  let bestsellersProductsData = []
  let hugeDiscountsProductData = []
  let userData = null
  let lastblogsData = []

  try {
    await ConnectToDB()

    if (auth?.isLoggedIn && auth?.user?.userId) {
      userData = await Usermodel.findById(auth.user.userId)
        .populate('wishlist')
        .lean()
    }

    lastProductsData = await ProductModel.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('category')
      .lean()
    bestsellersProductsData = await ProductModel.find()
      .sort({ soldCount: -1 })
      .limit(8)
      .populate('category')
      .lean()
    hugeDiscountsProductData = await ProductModel.find()
      .sort({ discount: -1 })
      .limit(8)
      .populate('category')
      .lean()
    lastblogsData = await Blogmodel.find({isActive:true}).sort({ createdAt: -1 }).limit(5).lean()
  } catch (error) {
    console.error('Error fetching products:', error)
  }

  const lastProducts = JSON.parse(JSON.stringify(lastProductsData))
  const bestsellersProducts = JSON.parse(
    JSON.stringify(bestsellersProductsData)
  )
  const hugeDiscountsProduct = JSON.parse(
    JSON.stringify(hugeDiscountsProductData)
  )
  const lastblogs = JSON.parse(
    JSON.stringify(lastblogsData)
  )
  const currentUser = JSON.parse(JSON.stringify(userData))

  return (
    <div>
      <Productmainwrapper
        user={currentUser}
        lastProducts={lastProducts}
        bestsellersProducts={bestsellersProducts}
        hugeDiscountsProduct={hugeDiscountsProduct}
        lastblogs={lastblogs}
      />
    </div>
  )
}
