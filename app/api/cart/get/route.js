import { NextResponse } from 'next/server'
import ConnectToDB from '@/app/lib/mongodb'
import Usermodel from '@/model/Usermodel'
import ProductModel from '@/model/ProductModel'
import { getAuthFromCookies } from '@/components/utils/authServer'

export async function GET() {
  try {
    await ConnectToDB()

    const auth = await getAuthFromCookies()

    if (!auth?.user?.userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized'
        },
        { status: 401 }
      )
    }

    const user = await Usermodel.findById(
      auth.user.userId
    ).lean()

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found'
        },
        { status: 404 }
      )
    }

    const cartItems =
      user.cart?.items || []

    if (cartItems.length === 0) {
      return NextResponse.json({
        success: true,
        items: []
      })
    }

    // گرفتن product ids
    const productIds = cartItems.map(
      item => item.productId
    )

    const products =
      await ProductModel.find({
        _id: { $in: productIds }
      })

    // map سریع
    const productsMap = {}

    products.forEach(product => {
      productsMap[
        product._id.toString()
      ] = product
    })

    const updatedCart = cartItems.map(
      item => {
        const product =
          productsMap[
            item.productId.toString()
          ]

        const variant =
          product?.variants?.id(
            item.variantId
          )

        if (!variant) return item

        return {
          ...item,
          stock: variant.quantity,
          quantity: Math.min(
            item.quantity,
            variant.quantity
          )
        }
      }
    )

    return NextResponse.json(
      {
        success: true,
        items: updatedCart
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(
      'GET CART ERROR:',
      error
    )

    return NextResponse.json(
      {
        success: false,
        message: 'Server error'
      },
      { status: 500 }
    )
  }
}