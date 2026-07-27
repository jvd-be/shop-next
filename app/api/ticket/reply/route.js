import ConnectToDB from '@/app/lib/mongodb'
import { getAuthFromCookies } from '@/components/utils/authServer'
import { NextResponse } from 'next/server'
import Ticketmodel from '@/model/Ticketmodel'
import Ticketmessagemodel from '@/model/Ticketmessagemodel'
import mongoose from 'mongoose'

export async function POST(req) {
  try {
    await ConnectToDB()

    const auth = await getAuthFromCookies()

    if (!auth?.isLoggedIn) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = auth.user?.userId
    const role = auth.user?.role

    if (!userId || !role) {
      return NextResponse.json(
        { message: 'اطلاعات کاربر معتبر نیست' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { ticketId, message } = body

    if (!ticketId || !mongoose.Types.ObjectId.isValid(ticketId)) {
      return NextResponse.json(
        { message: 'شناسه تیکت معتبر نیست' },
        { status: 400 }
      )
    }

    const cleanMessage = message?.trim()

    if (!cleanMessage) {
      return NextResponse.json(
        { message: 'متن پیام خالی است' },
        { status: 400 }
      )
    }

    const ticket = await Ticketmodel.findById(ticketId)

    if (!ticket) {
      return NextResponse.json(
        { message: 'تیکت پیدا نشد' },
        { status: 404 }
      )
    }

    const isAdmin = role === 'ADMIN'

    const ticketOwnerId = ticket.user?.toString()
    const currentUserId = userId.toString()

    const isTicketOwner = ticketOwnerId === currentUserId

    // ادمین آزاد است، ولی کاربر فقط به تیکت خودش دسترسی دارد
    if (!isAdmin && !isTicketOwner) {
      return NextResponse.json(
        { message: 'شما اجازه پاسخ دادن به این تیکت را ندارید' },
        { status: 403 }
      )
    }

    // اگر می‌خواهی کاربر فقط بعد از جواب ادمین بتواند پاسخ بدهد
    if (!isAdmin) {
      const hasAdminReply = await Ticketmessagemodel.exists({
        ticket: ticketId,
        senderRole: 'ADMIN'
      })

      if (!hasAdminReply) {
        return NextResponse.json(
          { message: 'تا زمانی که ادمین پاسخ نداده، امکان ارسال پاسخ وجود ندارد' },
          { status: 403 }
        )
      }
    }

    const senderRole = isAdmin ? 'ADMIN' : 'USER'

    const newMessage = await Ticketmessagemodel.create({
      ticket: ticketId,
      sender: userId,
      senderRole,
      message: cleanMessage
    })

    ticket.lastMessage = cleanMessage.slice(0, 500)
    ticket.lastMessageAt = new Date()
    ticket.lastSenderRole = senderRole

    ticket.unreadByUser = ticket.unreadByUser || 0
    ticket.unreadByAdmin = ticket.unreadByAdmin || 0

    if (senderRole === 'ADMIN') {
      ticket.unreadByUser += 1
      ticket.unreadByAdmin = 0

      // فقط اگر داخل enum مدل Ticket داری
      // ticket.status = 'pending'
    } else {
      ticket.unreadByAdmin += 1
      ticket.unreadByUser = 0

      // فقط اگر داخل enum مدل Ticket داری
      // ticket.status = 'open'
    }

    await ticket.save()

    const populatedMessage = await Ticketmessagemodel
      .findById(newMessage._id)
      .populate('sender', 'name phone role')
      .lean()

    return NextResponse.json(
      {
        success: true,
        message: populatedMessage
      },
      { status: 201 }
    )
  } catch (error) {
    console.log('Ticket reply error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Server error',
        error: error.message
      },
      { status: 500 }
    )
  }
}
