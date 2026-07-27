import ConnectToDB from '@/app/lib/mongodb'
import { getAuthFromCookies } from '@/components/utils/authServer'
import Categorymodel from '@/model/Categorymodel'
import { NextResponse } from 'next/server'

export async function PATCH (req) {
  try {
    await ConnectToDB()
    const auth = await getAuthFromCookies()

    if (!auth?.isLoggedIn) {
      return NextResponse.json({ message: 'ابتدا وارد شوید' }, { status: 401 })
    }

    if (auth.user?.role !== 'ADMIN') {
      return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 403 })
    }
    const body = await req.json()
    const { id } = body


    if (!id) {
      return NextResponse.json({ message: 'ID ارسال نشده' }, { status: 400 })
    }

    const category = await Categorymodel.findById(id)

    if (!category) {
      return NextResponse.json({ message: 'دسته پیدا نشد' }, { status: 404 })
    }

    category.isActive = !category.isActive

    await category.save()

    return NextResponse.json(
      {
        message: 'وضعیت با موفقیت تغییر کرد',
        category
      },
      { status: 200 }
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json({ message: 'خطا در تغییر وضعیت' }, { status: 500 })
  }
}
