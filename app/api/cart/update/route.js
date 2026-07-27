import { NextResponse } from 'next/server'
import ConnectToDB from '@/app/lib/mongodb'
import Usermodel from '@/model/Usermodel'
import { getAuthFromCookies } from '@/components/utils/authServer'

export async function PUT(req) {
  await ConnectToDB()

  const auth = await getAuthFromCookies()

  if (!auth?.user?.userId) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  const { productId, variantId, quantity } = await req.json()

  const user = await Usermodel.findById(auth.user.userId)

  const item = user.cart.items.find(
    i =>
      i.productId.toString() === productId &&
      i.variantId.toString() === variantId
  )

  if (!item) {
    return NextResponse.json({ success: false }, { status: 404 })
  }

  item.quantity = quantity

  await user.save()

  return NextResponse.json({
    success: true
  })
}
