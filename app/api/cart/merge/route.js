import { NextResponse } from "next/server"
import Usermodel from "@/model/Usermodel"
import ProductModel from "@/model/ProductModel"
import { getAuthFromCookies } from "@/components/utils/authServer"
import ConnectToDB from "@/app/lib/mongodb"

export async function POST(req) {
  try {
    await ConnectToDB()

    const auth = await getAuthFromCookies()

    if (!auth.user?.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { items } = await req.json()

    const user = await Usermodel.findById(auth.user?.userId)

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      )
    }

    for (const guestItem of items) {
      const { productId, variantId, quantity } = guestItem

      const product = await ProductModel.findOne(
        { _id: productId, "variants._id": variantId },
        { "variants.$": 1 }
      ).lean()

      if (!product) continue

      const variant = product.variants[0]

    const existingIndex = user.cart.items.findIndex(
  item =>
    item.productId.toString() === String(productId) &&
    item.variantId.toString() === String(variantId)
)


      if (existingIndex !== -1) {
        const newQty =
          user.cart.items[existingIndex].quantity + quantity

        user.cart.items[existingIndex].quantity = Math.min(
          newQty,
          variant.quantity
        )
      } else {
        user.cart.items.push({
          productId,
          variantId,
          quantity: Math.min(quantity, variant.quantity),
          price: guestItem.price,
          title: guestItem.title,
          image: guestItem.image,
          size: guestItem.size,
          color: guestItem.color,
          colorName: guestItem.colorName
        })
      }
    }

    await user.save()

    return NextResponse.json({
      success: true,
      items: user.cart.items
    })
  } catch (error) {
    console.error("MERGE CART ERROR:", error)

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}
