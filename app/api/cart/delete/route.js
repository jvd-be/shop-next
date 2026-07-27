import { NextResponse } from "next/server"
import Usermodel from "@/model/Usermodel"
import { getAuthFromCookies } from "@/components/utils/authServer"
import ConnectToDB from "@/app/lib/mongodb"

export async function DELETE(req) {
  try {

    await ConnectToDB()

    const auth = await getAuthFromCookies()

    if (!auth.user?.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { productId, variantId } = await req.json()

    if (!productId || !variantId) {
      return NextResponse.json(
        { success: false, message: "Invalid data" },
        { status: 400 }
      )
    }

    const user = await Usermodel.findById(auth.user.userId)

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      )
    }

    user.cart.items = user.cart.items.filter(item =>
      !(
        item.productId.toString() === productId &&
        item.variantId.toString() === variantId
      )
    )

    user.cart.updatedAt = new Date()

    await user.save()

    return NextResponse.json({
      success: true,
      items: user.cart.items
    })

  } catch (error) {

    console.error("DELETE CART ERROR:", error)

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}
