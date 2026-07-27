import ConnectToDB from '@/app/lib/mongodb'
import Adminlayout from '@/components/templates/Admin/adminlayout/Adminlayout'
import Adminticketswrapper from '@/components/templates/Admin/adminticketswrapper/Adminticketswrapper'
import Ticketmodel from '@/model/Ticketmodel'
import Ticketmessagemodel from '@/model/Ticketmessagemodel'
import React from 'react'

export default async function page () {
  let ticketData = []

  try {
    await ConnectToDB()

    const tickets = await Ticketmodel.find()
      .populate('user', 'name phone avatar')
      .populate('category', 'title')
      .sort({ lastMessageAt: -1, createdAt: -1 })
      .lean()

    const ticketIds = tickets.map(ticket => ticket._id)

    const ticketMessages = await Ticketmessagemodel.find({
      ticket: { $in: ticketIds }
    })
      .populate('sender', 'name phone avatar')
      .sort({ createdAt: 1 })
      .lean()

    const messagesByTicket = ticketMessages.reduce((acc, message) => {
      const ticketId = message.ticket.toString()

      if (!acc[ticketId]) {
        acc[ticketId] = []
      }

      acc[ticketId].push(message)

      return acc
    }, {})

    ticketData = tickets.map(ticket => {
      const ticketId = ticket._id.toString()

      return {
        ...ticket,
        messages: messagesByTicket[ticketId] || []
      }
    })
  } catch (error) {
    console.error(error)
  }

  const ticketsList = JSON.parse(JSON.stringify(ticketData || []))

  return (
    <Adminlayout>
      <Adminticketswrapper ticketsList={ticketsList} />
    </Adminlayout>
  )
}
