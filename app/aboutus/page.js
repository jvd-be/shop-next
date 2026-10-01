import Aboutuswrapper from '@/components/templates/aboutus/aboutuswrapper/Aboutuswrapper'
import Footer from '@/components/templates/footer/Footer'
import Menumobile from '@/components/templates/menuMoblie/Menumobile'
import Navbar from '@/components/templates/navbar/Navbar'
import React from 'react'
import ConnectToDB from '../lib/mongodb'
import ProductModel from '@/model/ProductModel'
import Headermobile from '@/components/modules/headermobile/Headermobile'
import GeneralModel from '@/model/GeneralModel'
import { Getbanners } from '@/components/utils/helperServer'

export default async function page () {
  let productsCount
  let logoData = null
  try {
    await ConnectToDB()
    logoData = await GeneralModel.findOne(
      {},
      { siteLogo: 1, siteName: 1 }
    ).lean()

    productsCount = await ProductModel.countDocuments({})
  } catch (error) {}
  const logo = JSON.parse(JSON.stringify(logoData))
  const banners = await Getbanners()
  return (
    <div>
      <Navbar />
      <Headermobile logo={logo} banners={banners} />
      <Menumobile />

      <Aboutuswrapper productsCount={productsCount} />
      <Footer />
    </div>
  )
}
