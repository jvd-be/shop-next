import { NextResponse } from 'next/server'
import ConnectToDB from '@/app/lib/mongodb'
import Ticketmodel from '@/model/Ticketmodel'
import { getAuthFromCookies } from '@/components/utils/authServer'

export async function PATCH (req, { params }) {
  try {
    await ConnectToDB()

    const auth = await getAuthFromCookies()

    if (!auth.isLoggedIn) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    if (auth.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const { status } = await req.json()

    const { id } = await params

    const updatedTicket = await Ticketmodel.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    )

    if (!updatedTicket) {
      return NextResponse.json({ message: 'Ticket not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Status updated successfully',
      ticket: updatedTicket
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    )
  }
}
