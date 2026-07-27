import ConnectToDB from '@/app/lib/mongodb'
import Blogmodel from '@/model/Blogmodel'
import { NextResponse } from 'next/server'
export async function DELETE (req) {
  await ConnectToDB()

  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ message: 'آیدی نامعتبر است' }, { status: 400 })
    }

    const blogDelete = await Blogmodel.findOneAndDelete({ _id: id })

    if (!blogDelete) {
      return NextResponse.json({ message: 'بلاگ پیدا نشد' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'حذف بلاگ با موفقیت انجام شد' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ message: 'internal error' }, { status: 500 })
  }
}
