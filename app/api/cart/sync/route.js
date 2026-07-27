import { NextResponse } from 'next/server'
import ProductModel from '@/model/ProductModel'
import ConnectToDB from '@/app/lib/mongodb'

export async function POST(req) {
  await ConnectToDB()

  const { items } = await req.json()

  const productIds = items.map(i => i.productId)

  const products = await ProductModel.find({
    _id: { $in: productIds }
  }).lean()

  const updatedItems = items.map(item => {
    const product = products.find(
      p => p._id.toString() === item.productId
    )

    if (!product) return item

    let basePrice = product.finalPrice
    let stock = 0
    let discount = product.discount || 0

    if (item.variantId && product.variants?.length) {
      const variant = product.variants.find(
        v => v._id.toString() === item.variantId
      )

      if (variant) {
        stock = variant.quantity

        if (variant.price != null) {
          basePrice = variant.price
        } else if (variant.additionalPrice) {
          basePrice = product.finalPrice + variant.additionalPrice
        }
      }
    }

  return {
  ...item,

  title: product.title,
  image: product.images?.[0] || null,

  price: basePrice,
  oldPrice: product.price,
  discount,

  finalPrice: Math.round(
    basePrice - (basePrice * discount) / 100
  ),

  stock,
  isOutOfStock: stock === 0,
  exceedsStock: stock > 0 && item.quantity > stock
}

  })

  return NextResponse.json({
    items: updatedItems
  })
}