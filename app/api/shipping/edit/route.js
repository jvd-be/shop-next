import { NextResponse } from "next/server"
import ConnectToDB from "@/app/lib/mongodb"
import ShippingModel from "@/model/Shippingmodel"
import { getAuthFromCookies } from "@/components/utils/authServer"

export async function PUT(req) {

  try {

    await ConnectToDB()

    const auth = await getAuthFromCookies()

    if (!auth?.isLoggedIn) {
      return NextResponse.json(
        { error: "ابتدا وارد شوید" },
        { status: 401 }
      )
    }


    if (auth.user?.role !== 'ADMIN' &&  auth.user?.role !== 'SUPER_ADMIN' ) {
      return NextResponse.json(
        { message: 'دسترسی غیر مجاز' },
        { status: 403 }
      )
    }

    const body = await req.json()

    const shipping = await ShippingModel.findOneAndUpdate(
      {},
      body,
      {
        new: true,
        upsert: true
      }
    )

    return NextResponse.json({
      success: true,
      message: "تنظیمات ارسال بروزرسانی شد",
      shipping
    })

  } catch (error) {

    return NextResponse.json(
      { error: "خطا در بروزرسانی تنظیمات ارسال" },
      { status: 500 }
    )
  }
}
