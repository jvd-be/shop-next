// import ConnectToDB from '@/app/lib/mongodb'
// import { getAuthFromCookies } from '@/components/utils/authServer'
// import { NextResponse } from 'next/server'
// import Ticketmodel from '@/model/Ticketmodel'
// import TicketCategorymodel from '@/model/TicketCategorymodel'
// import Ticketmessagemodel from '@/model/Ticketmessagemodel'
// import mongoose from 'mongoose'
// import Usermodel from '@/model/Usermodel'

// export async function POST(req) {
//   let session = null

//   try {
//     await ConnectToDB()

//     const auth = await getAuthFromCookies()

//     if (!auth?.isLoggedIn) {
//       return NextResponse.json(
//         { message: 'برای ارسال تیکت باید لاگین کنید.' },
//         { status: 401 }
//       )
//     }

//     const userId = auth.user?.userId

//     if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
//       return NextResponse.json(
//         { message: 'شناسه کاربر معتبر نیست.' },
//         { status: 401 }
//       )
//     }

//     const userExists = await Usermodel.exists({ _id: userId })

//     if (!userExists) {
//       return NextResponse.json(
//         { message: 'کاربر یافت نشد.' },
//         { status: 404 }
//       )
//     }

//     const body = await req.json()

//     let { category, subject, message, priority } = body

//     if (typeof category === 'string') {
//       category = category.trim()
//     }

//     if (typeof subject === 'string') {
//       subject = subject.trim()
//     }

//     if (typeof message === 'string') {
//       message = message.trim()
//     }

//     if (typeof priority === 'string') {
//       priority = priority.trim()
//     }

//     if (!category || !mongoose.Types.ObjectId.isValid(category)) {
//       return NextResponse.json(
//         { message: 'دسته‌بندی معتبر نیست.' },
//         { status: 400 }
//       )
//     }

//     if (!subject || subject.length < 3) {
//       return NextResponse.json(
//         { message: 'عنوان تیکت باید حداقل ۳ کاراکتر باشد.' },
//         { status: 400 }
//       )
//     }

//     if (subject.length > 200) {
//       return NextResponse.json(
//         { message: 'عنوان تیکت نباید بیشتر از ۲۰۰ کاراکتر باشد.' },
//         { status: 400 }
//       )
//     }

//     if (!message || message.length < 5) {
//       return NextResponse.json(
//         { message: 'متن تیکت باید حداقل ۵ کاراکتر باشد.' },
//         { status: 400 }
//       )
//     }

//     if (message.length > 4000) {
//       return NextResponse.json(
//         { message: 'متن تیکت بیش از حد طولانی است.' },
//         { status: 400 }
//       )
//     }

//     const allowedPriorities = ['low', 'normal', 'high', 'urgent']

//     if (!priority) {
//       priority = 'normal'
//     }

//     if (!allowedPriorities.includes(priority)) {
//       return NextResponse.json(
//         { message: 'اولویت انتخاب‌شده معتبر نیست.' },
//         { status: 400 }
//       )
//     }

//     const categoryExists = await TicketCategorymodel.exists({
//       _id: category
//     })

//     if (!categoryExists) {
//       return NextResponse.json(
//         { message: 'دسته‌بندی یافت نشد.' },
//         { status: 404 }
//       )
//     }

//     const openTicketsCount = await Ticketmodel.countDocuments({
//       user: userId,
//       status: { $in: ['open', 'pending'] }
//     })

//     if (openTicketsCount >= 5) {
//       return NextResponse.json(
//         { message: 'شما بیش از حد مجاز تیکت فعال دارید.' },
//         { status: 429 }
//       )
//     }

//     session = await mongoose.startSession()

//     let createdTicket = null
//     let createdMessage = null

//     await session.withTransaction(async () => {
//       const ticketDocs = await Ticketmodel.create(
//         [
//           {
//             user: userId,
//             category,
//             subject,
//             status: 'open',
//             priority,
//             lastMessage: message.slice(0, 500),
//             lastMessageAt: new Date(),
//             lastSenderRole: 'USER',
//             unreadByAdmin: 1,
//             unreadByUser: 0,
//             closedAt: null,
//             closedBy: null
//           }
//         ],
//         { session }
//       )

//       createdTicket = ticketDocs[0]

//       const messageDocs = await Ticketmessagemodel.create(
//         [
//           {
//             ticket: createdTicket._id,
//             sender: userId,
//             senderRole: 'USER',
//             message
//           }
//         ],
//         { session }
//       )

//       createdMessage = messageDocs[0]
//     })

//     const populatedTicket = await Ticketmodel.findById(createdTicket._id)
//       .populate('user', 'name phone role')
//       .populate('category', 'title name slug')
//       .lean()

//     const populatedMessage = await Ticketmessagemodel.findById(
//       createdMessage._id
//     )
//       .populate('sender', 'name phone role')
//       .lean()

//     return NextResponse.json(
//       {
//         message: 'تیکت شما با موفقیت ثبت شد',
//         ticket: populatedTicket,
//         firstMessage: populatedMessage
//       },
//       { status: 201 }
//     )
//   } catch (error) {
//     console.error('Create Ticket Error:', error)

//     return NextResponse.json(
//       { message: 'خطای سرور در ثبت تیکت' },
//       { status: 500 }
//     )
//   } finally {
//     if (session) {
//       session.endSession()
//     }
//   }
// }






import ConnectToDB from '@/app/lib/mongodb'
import { getAuthFromCookies } from '@/components/utils/authServer'
import { NextResponse } from 'next/server'
import Ticketmodel from '@/model/Ticketmodel'
import TicketCategorymodel from '@/model/TicketCategorymodel'
import Ticketmessagemodel from '@/model/Ticketmessagemodel'
import mongoose from 'mongoose'
import Usermodel from '@/model/Usermodel'

export async function POST(req) {
  try {
    await ConnectToDB()

    const auth = await getAuthFromCookies()

 

    if (!auth?.isLoggedIn) {
      return NextResponse.json(
        { message: 'برای ارسال تیکت باید لاگین کنید.' },
        { status: 401 }
      )
    }

    const userId = auth.user?.userId
  
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: 'شناسه کاربر معتبر نیست.' },
        { status: 401 }
      )
    }

    const userExists = await Usermodel.exists({ _id: userId })

    if (!userExists) {
      return NextResponse.json(
        { message: 'کاربر یافت نشد.' },
        { status: 404 }
      )
    }

    const url = new URL(req.url)

    let body = {}

    try {
      body = await req.json()
    } catch (error) {
      body = {}
    }

    let category =
      body.category ||
      url.searchParams.get('category') ||
      ''

    let subject =
      body.subject ||
      url.searchParams.get('subject') ||
      ''

    let message =
      body.message ||
      url.searchParams.get('message') ||
      ''

    let priority =
      body.priority ||
      url.searchParams.get('priority') ||
      'normal'

    if (typeof category === 'string') {
      category = category.trim()
    }

    if (typeof subject === 'string') {
      subject = subject.trim()
    }

    if (typeof message === 'string') {
      message = message.trim()
    }

    if (typeof priority === 'string') {
      priority = priority.trim()
    }

    if (!category || !mongoose.Types.ObjectId.isValid(category)) {
      return NextResponse.json(
        { message: 'دسته‌بندی معتبر نیست.' },
        { status: 400 }
      )
    }

    if (!subject && message) {
      subject = message.slice(0, 80)
    }

    if (!subject || subject.length < 3) {
      return NextResponse.json(
        { message: 'عنوان تیکت باید حداقل ۳ کاراکتر باشد.' },
        { status: 400 }
      )
    }

    if (subject.length > 200) {
      return NextResponse.json(
        { message: 'عنوان تیکت نباید بیشتر از ۲۰۰ کاراکتر باشد.' },
        { status: 400 }
      )
    }

    if (!message || message.length < 5) {
      return NextResponse.json(
        { message: 'متن تیکت باید حداقل ۵ کاراکتر باشد.' },
        { status: 400 }
      )
    }

    if (message.length > 4000) {
      return NextResponse.json(
        { message: 'متن تیکت بیش از حد طولانی است.' },
        { status: 400 }
      )
    }

    const allowedPriorities = ['low', 'normal', 'high', 'urgent']

    if (!priority) {
      priority = 'normal'
    }

    if (!allowedPriorities.includes(priority)) {
      return NextResponse.json(
        { message: 'اولویت انتخاب‌شده معتبر نیست.' },
        { status: 400 }
      )
    }

    const categoryExists = await TicketCategorymodel.exists({
      _id: category
    })

    if (!categoryExists) {
      return NextResponse.json(
        { message: 'دسته‌بندی یافت نشد.' },
        { status: 404 }
      )
    }

    const openTicketsCount = await Ticketmodel.countDocuments({
      user: userId,
      status: { $in: ['open', 'pending'] }
    })

    if (openTicketsCount >= 5) {
      return NextResponse.json(
        { message: 'شما بیش از حد مجاز تیکت فعال دارید.' },
        { status: 429 }
      )
    }

    const createdTicket = await Ticketmodel.create({
      user: userId,
      category,
      subject,
      status: 'open',
      priority,
      lastMessage: message.slice(0, 500),
      lastMessageAt: new Date(),
      lastSenderRole: 'USER',
      unreadByAdmin: 1,
      unreadByUser: 0,
      closedAt: null,
      closedBy: null
    })

    const createdMessage = await Ticketmessagemodel.create({
      ticket: createdTicket._id,
      sender: userId,
      senderRole: 'USER',
      message
    })

    const populatedTicket = await Ticketmodel.findById(createdTicket._id)
      .populate('user', 'name phone role')
      .populate('category', 'title name slug')
      .lean()

    const populatedMessage = await Ticketmessagemodel.findById(
      createdMessage._id
    )
      .populate('sender', 'name phone role')
      .lean()

    return NextResponse.json(
      {
        message: 'تیکت شما با موفقیت ثبت شد',
        ticket: populatedTicket,
        firstMessage: populatedMessage
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create Ticket Error:', error)

    return NextResponse.json(
      {
        message: 'خطای سرور در ثبت تیکت',
        error: error.message
      },
      { status: 500 }
    )
  }
}
