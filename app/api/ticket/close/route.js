import { NextResponse } from 'next/server'
import ConnectToDB from '@/app/lib/mongodb'
import Ticketmodel from '@/model/Ticketmodel'
import { getAuthFromCookies } from '@/components/utils/authServer'

export async function PATCH (req) {
  try {
    await ConnectToDB()

    const { isLoggedIn, user } = await getAuthFromCookies()

    if (!isLoggedIn) {
      return NextResponse.json(
        {
          success: false,
          message: 'برای بستن تیکت باید وارد حساب کاربری شوید.'
        },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { ticketId } = body

    if (!ticketId) {
      return NextResponse.json(
        {
          success: false,
          message: 'شناسه تیکت ارسال نشده است.'
        },
        { status: 400 }
      )
    }

    const ticket = await Ticketmodel.findById(ticketId)

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          message: 'تیکت مورد نظر پیدا نشد.'
        },
        { status: 404 }
      )
    }

    const userId = user.userId
    if (String(ticket.user) !== String(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'شما اجازه بستن این تیکت را ندارید.'
        },
        { status: 403 }
      )
    }

    if (ticket.status === 'closed') {
      return NextResponse.json(
        {
          success: false,
          message: 'این تیکت قبلاً بسته شده است.'
        },
        { status: 409 }
      )
    }

    ticket.status = 'closed'
    ticket.closedAt = new Date()

    await ticket.save()

    return NextResponse.json(
      {
        success: true,
        message: 'تیکت با موفقیت بسته شد.',
        data: ticket
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Close user ticket error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'خطای سرور در بستن تیکت.'
      },
      { status: 500 }
    )
  }
}
