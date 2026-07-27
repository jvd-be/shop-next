import ConnectToDB from '@/app/lib/mongodb'
import { getAuthFromCookies } from '@/components/utils/authServer'
import ProductModel from '@/model/ProductModel'
import Usermodel from '@/model/Usermodel'
import mongoose from 'mongoose'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    await ConnectToDB()

    const auth =
      await getAuthFromCookies()

    // guest
    if (!auth.isLoggedIn) {
      return NextResponse.json(
        {
          success: true,
          guest: true
        },
        { status: 200 }
      )
    }

    const body =
      await req.json()

    const {
      productId,
      variantId,
      quantity
    } = body

 
    
    if (
      !mongoose.Types.ObjectId.isValid(
        productId
      ) ||
      !mongoose.Types.ObjectId.isValid(
        variantId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'آیدی نامعتبر است'
        },
        { status: 400 }
      )
    }

    // validate qty
    const qty =
      Number(quantity)

    if (
      !Number.isFinite(qty) ||
      qty <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'مقدار وارد شده نامعتبر است'
        },
        { status: 400 }
      )
    }

    // get product + variant
    const product =
      await ProductModel.findOne(
        {
          _id: productId,
          'variants._id':
            variantId
        },
        {
          title: 1,
          price: 1,
          finalPrice: 1,
          discount: 1,
          images: 1,
          slug: 1,
          'variants.$': 1
        }
      ).lean()

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message:
            'محصول یافت نشد'
        },
        { status: 404 }
      )
    }

    const variant =
      product.variants?.[0]

    if (!variant) {
      return NextResponse.json(
        {
          success: false,
          message:
            'واریانت پیدا نشد'
        },
        { status: 404 }
      )
    }

    // stock
    const stock = Number(
      variant.quantity ?? 0
    )

    if (stock <= 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            'این محصول ناموجود است'
        },
        { status: 409 }
      )
    }

    // ---- pricing ----

    const originalPrice =
      Number(
        product.price || 0
      )

    const discount =
      Number(
        product.discount || 0
      )

    // fallback if finalPrice is null
    const finalPrice =
      Number(
        product.finalPrice
      ) ||
      Math.round(
        originalPrice *
          (1 -
            discount / 100)
      )

    const discountAmount =
      originalPrice -
      finalPrice

    // user
    const userId =
      auth?.user?.userId

    const user =
      await Usermodel.findById(
        userId
      )

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            'کاربر پیدا نشد'
        },
        { status: 404 }
      )
    }

    // safe cart
    if (!user.cart) {
      user.cart = {
        items: []
      }
    }

    if (
      !Array.isArray(
        user.cart.items
      )
    ) {
      user.cart.items = []
    }

    const pId =
      String(productId)

    const vId =
      String(variantId)

    const idx =
      user.cart.items.findIndex(
        item =>
          String(
            item.productId
          ) === pId &&
          String(
            item.variantId
          ) === vId
      )

    // already exists
    if (idx >= 0) {
      const current =
        Number(
          user.cart.items[
            idx
          ].quantity || 0
        )

      const newQty =
        current + qty

      if (
        newQty > stock
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              'موجودی کافی نیست'
          },
          { status: 409 }
        )
      }

      user.cart.items[
        idx
      ].quantity = newQty

      // sync latest stock + pricing
      user.cart.items[
        idx
      ].stock = stock

      user.cart.items[
        idx
      ].price =
        finalPrice

      user.cart.items[
        idx
      ].oldPrice =
        originalPrice

      user.cart.items[
        idx
      ].discount =
        discount

      user.cart.items[
        idx
      ].discountAmount =
        discountAmount
    } else {
      // add new item
      user.cart.items.push({
        productId,
        variantId,

        quantity:
          Math.min(
            qty,
            stock
          ),

        title:
          product.title,

        image:
          product
            .images?.[0] ||
          null,

        slug:
          product.slug,

        // variant
        color:
          variant.color,

        colorName:
          variant.colorName,

        size:
          variant.size,

        // stock
        stock,

        // pricing
        price:
          finalPrice,

        oldPrice:
          originalPrice,

        discount,

        discountAmount
      })
    }

    user.cart.updatedAt =
      new Date()

    await user.save()

    return NextResponse.json(
      {
        success: true,
        items:
          user.cart.items
      },
      { status: 200 }
    )
  } catch (error) {
    console.log(
      'CART ADD ERROR:',
      error
    )

    return NextResponse.json(
      {
        success: false,
        message:
          'خطای داخلی سرور',
        error:
          error.message
      },
      { status: 500 }
    )
  }
}