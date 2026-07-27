import ConnectToDB from '@/app/lib/mongodb'
import { getAuthFromCookies } from '@/components/utils/authServer'
import Reviewmodel from '@/model/Reviewmodel'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    await ConnectToDB()

    const auth = await getAuthFromCookies()

    if (!auth?.isLoggedIn) {
      return NextResponse.json(
        { message: 'ابتدا وارد شوید' },
        { status: 401 }
      )
    }

    if (auth.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'فقط ادمین میتواند پاسخ دهد' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { commentId, reply } = body

    if (!commentId || !reply) {
      return NextResponse.json(
        { message: 'اطلاعات ناقص است' },
        { status: 400 }
      )
    }

    const comment = await Reviewmodel.findById(commentId)

    if (!comment) {
      return NextResponse.json(
        { message: 'کامنت پیدا نشد' },
        { status: 404 }
      )
    }

    comment.adminReply = {
      text: reply,
      admin: auth.user.id,
      createdAt: new Date()
    }

    const updatedComment = await comment.save()

    return NextResponse.json(
      {
        message: 'پاسخ با موفقیت ثبت شد',
        comment: updatedComment
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Reply error:', error)

    return NextResponse.json(
      { message: 'خطا در ثبت پاسخ' },
      { status: 500 }
    )
  }
}
