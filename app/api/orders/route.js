import { NextResponse } from 'next/server'
import ConnectToDB from '@/app/lib/mongodb'

import Usermodel from '@/model/Usermodel'
import ProductModel from '@/model/ProductModel'
import Ordermodel from '@/model/Ordermodel'
import ShippingModel from '@/model/Shippingmodel'
import { getAuthFromCookies } from '@/components/utils/authServer'


function calculateShippingCost (itemsTotal, shippingSettings) {
  if (!shippingSettings) return 0

  const {
    freeThreshold = 0,
    halfThreshold = 0,
    freeShippingCost = 0,
    halfShippingCost = 0,
    fullShippingCost = 0
  } = shippingSettings

  if (freeThreshold && itemsTotal >= freeThreshold) return freeShippingCost
  if (halfThreshold && itemsTotal >= halfThreshold) return halfShippingCost
  return fullShippingCost
}

export async function POST (req) {
  try {
    await ConnectToDB()

    // این قسمت را با سیستم احراز هویت خودت جایگزین کن
    const auth = await getAuthFromCookies()

    const userId = auth.user.userId
    const user = await Usermodel.findById(userId)

    if (!user) {
      return NextResponse.json({ message: 'کاربر پیدا نشد' }, { status: 404 })
    }

    if (!user.cart?.items?.length) {
      return NextResponse.json(
        { message: 'سبد خرید خالی است' },
        { status: 400 }
      )
    }

    if (
      user.addresses.length<1
    ) {
      return NextResponse.json(
        { message: 'لطفاً ابتدا آدرس ارسال را تکمیل کنید' },
        { status: 400 }
      )
    }

    // ۱. خواندن محصولات واقعی از دیتابیس (به قیمت/اسم داخل سبد خرید اعتماد نمی‌کنیم)
    const productIds = user.cart.items.map((item) => item.productId)
    const products = await ProductModel.find({ _id: { $in: productIds } })

    const items = []
    let itemsTotal = 0

    for (const cartItem of user.cart.items) {
      const product = products.find(
        (p) => p._id.toString() === cartItem.productId.toString()
      )

      if (!product) {
        return NextResponse.json(
          { message: `محصولی از سبد خرید دیگر موجود نیست` },
          { status: 404 }
        )
      }

      // ۲. چک موجودی
      if (product.stock < cartItem.quantity) {
        return NextResponse.json(
          { message: `موجودی «${product.name}» کافی نیست` },
          { status: 409 }
        )
      }

      const itemPrice =product.finalPrice || product.price // قیمت واقعی و به‌روز از دیتابیس

      items.push({
        product: product._id,
        name: product.name,
        price: itemPrice,
        quantity: cartItem.quantity,
        color: cartItem.color,
        colorName: cartItem.colorName,
        size: cartItem.size
      })

      itemsTotal += itemPrice * cartItem.quantity
    }

    // نکته: موجودی اینجا فقط چک می‌شه، نه کم — کم‌شدن واقعی موجودی به بعد از
    // تایید موفق پرداخت موکول شده (در روت verify پرداخت) تا موجودی برای
    // سفارش‌های PENDING که هیچ‌وقت پرداخت نمی‌شن قفل نشه.

    // ۴. محاسبه‌ی هزینه‌ی ارسال بر اساس تنظیمات فعلی (نه چیزی که کلاینت فرستاده)
    const shippingSettings = await ShippingModel.findOne().lean()
    const shippingCost = calculateShippingCost(itemsTotal, shippingSettings)
    const totalAmount = itemsTotal + shippingCost
console.log({
  itemsTotal,
  shippingSettings,
  shippingCost,
  totalAmount
})
    // ۵. ثبت سفارش
    const order = await Ordermodel.create({
      user: user._id,
      items,
      itemsTotal,
      shippingCost,
      totalAmount,
      address: user.address,
      paymentMethod: 'ONLINE'
    })

 
    user.cart.items = []
    await user.save()

    return NextResponse.json({
      success: true,
      orderId: order._id
    })
  } catch (err) {
    console.error(err)

    return NextResponse.json({ message: 'خطای سرور' }, { status: 500 })
  }
}