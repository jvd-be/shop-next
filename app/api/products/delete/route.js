import ConnectToDB from '@/app/lib/mongodb'
import ProductModel from '@/model/ProductModel'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE (req) {
  await ConnectToDB()
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ message: 'آیدی نامعتبر است' }, { status: 400 })
    }
     const deletedProduct = await ProductModel.findByIdAndDelete(id)

    if (!deletedProduct) {
      return NextResponse.json(
        { message: 'محصول پیدا نشد' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'حذف با موفقیت انجام شد' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ message: 'internal error' }, { status: 500 })
  }
}
