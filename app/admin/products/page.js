import ConnectToDB from '@/app/lib/mongodb'
import Adminlayout from '@/components/templates/Admin/adminlayout/Adminlayout'
import Adminproductspagewrapper from '@/components/templates/Admin/adminproductpagewrapper/Adminproductpagewrapper'
import Categorymodel from '@/model/Categorymodel'
import ProductModel from '@/model/ProductModel'
import React from 'react'

export default async function Adminproducstpage () {
  let categories
  let products
  try {
    await ConnectToDB()
    categories = await Categorymodel.find({}).lean()
    let productsRow = await ProductModel.find({})
      .populate('category', 'name')
      .lean()
    products = productsRow.map(item => ({
      ...item,
      _id: item._id.toString(),
      createdAt: item?.createdAt?.toISOString(),
      updatedAt: item?.updatedAt?.toISOString()
    }))
  } catch (error) {}
  let initialproducts = JSON.parse(JSON.stringify(products))
  let initialcategories=JSON.parse(JSON.stringify(categories))
  return (
    <Adminlayout>
      <Adminproductspagewrapper
        categories={initialcategories}
        initialproducts={initialproducts}
      />
    </Adminlayout>
  )
}
