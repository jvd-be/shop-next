import React from 'react'
import Menumobilewrapper from '../menumobilewrapper/Menumobilewrapper'
import { getAuthFromCookies } from '@/components/utils/authServer'
import GeneralModel from '@/model/GeneralModel'
import Blogmodel from '@/model/Blogmodel'
import Categorymodel from '@/model/Categorymodel'
import ProductModel from '@/model/ProductModel'
import ConnectToDB from '@/app/lib/mongodb'

export default async function Menumobile () {
  const auth = await getAuthFromCookies()
  let logoData = null
  let blogs = null
  let products = null
  let categoriesData = null
  try {
    await ConnectToDB()
    logoData = await GeneralModel.findOne(
      {},
      { siteLogo: 1, siteName: 1 }
    ).lean()
    blogs = await Blogmodel.find({ isActive: true }).lean()
    categoriesData = await Categorymodel.find({
      level: 0,
      isActive: true,
      parent: null
    })
      .sort({ order: 1 })
      .lean()
    products = await ProductModel.find().populate('category').lean()
  } catch (error) {}
  const logo = JSON.parse(JSON.stringify(logoData))
  let initialblogs = JSON.parse(JSON.stringify(blogs))
  let initialproducts = JSON.parse(JSON.stringify(products))
  let categories = JSON.parse(JSON.stringify(categoriesData))
  return (
    <>
      <Menumobilewrapper
        auth={auth}
        logo={logo}
        initialblogs={initialblogs}
        initialproducts={initialproducts}
        categories={categories}
      />
    </>
  )
}
