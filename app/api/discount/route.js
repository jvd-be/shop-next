import { NextResponse } from 'next/server'
import ConnectToDB from '@/app/lib/mongodb'
import Discountmodel from '@/model/Discountmodel'

export async function GET() {
  try {

    await ConnectToDB()

    const discounts = await Discountmodel.find({})
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      discounts
    })

  } catch (error) {

    console.error('Get Discounts Error:', error)

    return NextResponse.json(
      { error: 'خطا در دریافت کدهای تخفیف' },
      { status: 500 }
    )
  }
}
