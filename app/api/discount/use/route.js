import { NextResponse } from 'next/server'
import ConnectToDB from '@/app/lib/mongodb'
import Discountmodel from '@/model/Discountmodel'
import Ordermodel from '@/model/Ordermodel'
import ProductModel from '@/model/ProductModel'
import { getAuthFromCookies } from '@/components/utils/authServer'

export async function POST (req) {
  try {
    await ConnectToDB()

    const auth = await getAuthFromCookies()

    if (!auth?.isLoggedIn) {
      return NextResponse.json(
        { error: 'برای استفاده از کد تخفیف باید وارد شوید' },
        { status: 401 }
      )
    }

    const userId = auth.user?.userId

    let body

    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: 'بدنه درخواست نامعتبر است' },
        { status: 400 }
      )
    }

    const code = body.code?.trim()?.toUpperCase()
    const items = body.items

    if (!code || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'اطلاعات سبد خرید نامعتبر است' },
        { status: 400 }
      )
    }

    const productIds = items.map(i => i.productId).filter(Boolean)

    if (!productIds.length) {
      return NextResponse.json(
        { error: 'محصولات نامعتبر هستند' },
        { status: 400 }
      )
    }

    const products = await ProductModel.find(
      { _id: { $in: productIds } },
      { price: 1, variants: 1 }
    ).lean()

    if (!products.length) {
      return NextResponse.json({ error: 'محصولی پیدا نشد' }, { status: 404 })
    }

    let cartTotal = 0

    for (const item of items) {
      const product = products.find(p => p._id.toString() === item.productId)

      if (!product) {
        return NextResponse.json(
          { error: 'یکی از محصولات وجود ندارد' },
          { status: 400 }
        )
      }

      const quantity = Number(item.quantity)

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return NextResponse.json(
          { error: 'تعداد محصول نامعتبر است' },
          { status: 400 }
        )
      }

      let price = Number(product.price) || 0

      if (item.variantId && product.variants?.length) {
        const variant = product.variants.find(
          v => v._id.toString() === item.variantId
        )

        if (!variant) {
          return NextResponse.json(
            { error: 'واریانت محصول نامعتبر است' },
            { status: 400 }
          )
        }

        // اگر variant price مستقل داشت
        if (variant.price !== undefined && variant.price !== null) {
          price = Number(variant.price)
        }

        // اگر اختلاف قیمت داشت
        else if (variant.additionalPrice !== undefined) {
          price = Number(product.price) + Number(variant.additionalPrice)
        }

        // fallback
        else {
          price = Number(product.price)
        }
      }

      if (!Number.isFinite(price) || price <= 0) {
        return NextResponse.json(
          { error: 'قیمت محصول نامعتبر است' },
          { status: 400 }
        )
      }

      cartTotal += price * quantity
    }

    if (!Number.isFinite(cartTotal) || cartTotal <= 0) {
      return NextResponse.json(
        { error: 'خطا در محاسبه مبلغ سبد خرید' },
        { status: 500 }
      )
    }

    const discount = await Discountmodel.findOne({ code, status: true }).lean()

    if (!discount) {
      return NextResponse.json(
        { error: 'کد تخفیف معتبر نیست' },
        { status: 404 }
      )
    }

    if (discount.expiredDate && new Date(discount.expiredDate) < new Date()) {
      return NextResponse.json(
        { error: 'کد تخفیف منقضی شده است' },
        { status: 400 }
      )
    }

    if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
      return NextResponse.json(
        { error: 'ظرفیت استفاده از این کد تکمیل شده' },
        { status: 400 }
      )
    }

    const minPurchase = Number(discount.minPurchase || 0)

    if (cartTotal < minPurchase) {
      return NextResponse.json(
        { error: 'حداقل مبلغ خرید رعایت نشده است' },
        { status: 400 }
      )
    }

    if (discount.firstPurchaseOnly) {
      const userOrdersCount = await Ordermodel.countDocuments({
        user: userId,
        isPaid: true
      })

      if (userOrdersCount > 0) {
        return NextResponse.json(
          { error: 'این کد فقط برای اولین خرید است' },
          { status: 400 }
        )
      }
    }

    let discountAmount = 0

    switch (discount.typediscount) {
      case 'Percent': {
        const percent = Number(discount.value)

        if (!percent || percent > 100) {
          return NextResponse.json(
            { error: 'مقدار درصد تخفیف نامعتبر است' },
            { status: 400 }
          )
        }

        discountAmount = Math.round((cartTotal * percent) / 100 / 1000) * 1000

        break
      }

      case 'Fixed': {
        const fixedValue = Number(discount.value)

        discountAmount = Math.min(fixedValue, cartTotal)

        break
      }

      case 'Shipping':
        discountAmount = 0
        break

      default:
        return NextResponse.json(
          { error: 'نوع تخفیف نامعتبر است' },
          { status: 400 }
        )
    }
console.log(  cartTotal,
      discountAmount)
    return NextResponse.json({
      success: true,
      code: discount.code,
      type: discount.typediscount,
      value: discount.value,
      cartTotal,
      discountAmount
    })
    
  } catch (error) {
    console.error('Apply Discount Error:', error)

    return NextResponse.json(
      { error: 'خطا در بررسی کد تخفیف' },
      { status: 500 }
    )
  }
}
