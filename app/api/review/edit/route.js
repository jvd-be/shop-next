import ConnectToDB from '@/app/lib/mongodb'
import { getAuthFromCookies } from '@/components/utils/authServer'
import Reviewmodel from '@/model/Reviewmodel'
import { NextResponse } from 'next/server'

export async function PUT (req) {
  try {
    await ConnectToDB()

    const auth = await getAuthFromCookies()

    if (!auth?.isLoggedIn) {
      return NextResponse.json({ message: 'ابتدا وارد شوید' }, { status: 401 })
    }

    if (auth.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'فقط ادمین میتواند ادیت انجام دهد' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { id } = body
    if (!id) {
      return NextResponse.json(
        { message: 'شناسه نظر ارسال نشده است' },
        { status: 400 }
      )
    }
    const comment = await Reviewmodel.findById(id)

    comment.isApproved  = !comment.isApproved 
    const updateComment = await comment.save()

    return NextResponse.json(
      { message: 'با موفقیت  وضعیت تغییر کرد', comment: updateComment },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'خطا در تغییر وضعیت نظر' },
      { status: 500 }
    )
  }
}
