import { NextResponse } from "next/server"
import ConnectToDB from "@/app/lib/mongodb"
import Discountmodel from "@/model/Discountmodel"
import { getAuthFromCookies } from "@/components/utils/authServer"

export async function POST(req) {
  try {
    await ConnectToDB()

    const auth = await getAuthFromCookies()

    // ✅ بررسی لاگین
    if (!auth?.isLoggedIn) {
      return NextResponse.json(
        { message: "ابتدا وارد شوید" },
        { status: 401 }
      )
    }

    // ✅ بررسی نقش
    if (auth.user?.role !== "ADMIN") {
      return NextResponse.json(
        { message: "دسترسی غیرمجاز" },
        { status: 403 }
      )
    }

    const body = await req.json()

    const code = body.code?.trim().toUpperCase()

    // ✅ اعتبارسنجی پایه
    if (!code || code.length < 4) {
      return NextResponse.json(
        { message: "کد تخفیف نامعتبر است" },
        { status: 400 }
      )
    }

    if (!["Percent", "Fixed", "Shipping"].includes(body.typediscount)) {
      return NextResponse.json(
        { message: "نوع تخفیف نامعتبر است" },
        { status: 400 }
      )
    }

    const value = Number(body.value)

    if (body.typediscount !== "Shipping" && (!value || value <= 0)) {
      return NextResponse.json(
        { message: "مقدار تخفیف نامعتبر است" },
        { status: 400 }
      )
    }

    if (body.typediscount === "Percent" && value > 100) {
      return NextResponse.json(
        { message: "درصد تخفیف نمی‌تواند بیشتر از 100 باشد" },
        { status: 400 }
      )
    }

    // ✅ بررسی تکراری نبودن کد
    const existingCode = await Discountmodel.findOne({ code })

    if (existingCode) {
      return NextResponse.json(
        { message: "این کد قبلاً ثبت شده است" },
        { status: 409 }
      )
    }

    const discountData = {
      code,
      typediscount: body.typediscount,
      value: body.typediscount === "Shipping" ? 0 : value,
      status: Boolean(body.status),
      usageLimit: body.usageLimit ? Number(body.usageLimit) : null,
      usedCount: 0,
      minPurchase: Number(body.minPurchase) || 0,
      perUserLimit: Number(body.perUserLimit) || 1,
      firstPurchaseOnly: Boolean(body.firstPurchaseOnly),
      products: Array.isArray(body.products) ? body.products : [],
      categories: Array.isArray(body.categories) ? body.categories : [],
      expiredDate: body.expiredDate ? new Date(body.expiredDate) : null
    }

    const discount = await Discountmodel.create(discountData)

    return NextResponse.json(
      { discount },
      { status: 201 }
    )

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { message: "خطای سرور" },
      { status: 500 }
    )
  }
}
