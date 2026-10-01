import { NextResponse } from "next/server"
import ConnectToDB from "@/app/lib/mongodb"
import ShippingModel from "@/model/Shippingmodel"


export async function GET() {
  try {

    await ConnectToDB()

    const shipping = await ShippingModel.findOne({}).lean()

    return NextResponse.json({ shipping })

  } catch (error) {

    return NextResponse.json(
      { error: "خطا در دریافت تنظیمات ارسال" },
      { status: 500 }
    )
  }
}


