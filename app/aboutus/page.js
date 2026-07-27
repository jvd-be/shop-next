import Aboutuswrapper from '@/components/templates/aboutus/aboutuswrapper/Aboutuswrapper'
import Footer from '@/components/templates/footer/Footer'
import Menumobile from '@/components/templates/menuMoblie/Menumobile'
import Navbar from '@/components/templates/navbar/Navbar'
import React from 'react'
import ConnectToDB from '../lib/mongodb'
import ProductModel from '@/model/ProductModel'

export default async function page () {
    let productsCount
      try {
        await ConnectToDB()
   
      productsCount=await ProductModel.countDocuments({})
      } catch (error) {}
  return (
    <div>
      <Navbar />
      <Menumobile />

      <Aboutuswrapper productsCount={productsCount} />
      <Footer/>
    </div>
  )
}
