import Footer from '@/components/templates/footer/Footer'
import Menumobile from '@/components/templates/menuMoblie/Menumobile'
import Navbar from '@/components/templates/navbar/Navbar'
import Profilewrapper from '@/components/templates/profilewrapper/Profilewrapper'
import { getAuthFromCookies } from '@/components/utils/authServer'
import { redirect } from 'next/navigation'
import Usermodel from '@/model/Usermodel'
import Ordermodel from '@/model/Ordermodel'
import ConnectToDB from '@/app/lib/mongodb'
import TicketCategorymodel from '@/model/TicketCategorymodel'
import Ticketmodel from '@/model/Ticketmodel'
import Ticketmessagemodel from '@/model/Ticketmessagemodel'
import Popups from '@/components/templates/popups/Popups'
import { GetPopups } from '@/components/utils/helperServer'

export default async function page () {
  const { isLoggedIn, user } = await getAuthFromCookies()
  const popups = await GetPopups()
  if (!isLoggedIn || !user?.userId) {
    redirect('/signup')
  }

  await ConnectToDB()

  let fullUserData = null
  let userOrders = []
  let categoryTicket = []
  let tickets = []
const userData = await Usermodel.findById(user.userId).populate('wishlist').lean()

if (!userData) {
  redirect('/signup')
}
  try {
    const [ ordersData, categoryTicketData, ticketsData] =
      await Promise.all([
       

        Ordermodel.find({ user: user.userId }).sort({ _id: -1 }).lean(),

        TicketCategorymodel.find({
          isActive: true
        }).lean(),

        Ticketmodel.find({ user: user.userId })
          .populate('category')
          .sort({ lastMessageAt: -1, createdAt: -1 })
          .lean()
      ])

 

    const ticketIds = ticketsData.map(ticket => ticket._id)

    const ticketMessagesData =
      ticketIds.length > 0
        ? await Ticketmessagemodel.find({
            ticket: {
              $in: ticketIds
            }
          })
            .sort({ createdAt: 1 })
            .lean()
        : []

    const messagesByTicketId = ticketMessagesData.reduce((acc, message) => {
      const ticketId = String(message.ticket)

      if (!acc[ticketId]) {
        acc[ticketId] = []
      }

      acc[ticketId].push(message)

      return acc
    }, {})

    const ticketsWithMessages = ticketsData.map(ticket => {
      const ticketId = String(ticket._id)

      return {
        ...ticket,
        messages: messagesByTicketId[ticketId] || []
      }
    })

    fullUserData = JSON.parse(JSON.stringify(userData))
    userOrders = JSON.parse(JSON.stringify(ordersData || []))
    categoryTicket = JSON.parse(JSON.stringify(categoryTicketData || []))
    tickets = JSON.parse(JSON.stringify(ticketsWithMessages || []))
  } catch (error) {
    console.error('Error fetching profile data:', error)
  }

  return (
    <>
      <Navbar />
      <Menumobile />
    
      <Profilewrapper
        user={fullUserData}
        orders={userOrders}
        categoryTicket={categoryTicket}
        ticketsData={tickets}
        popups={popups}
      />
      <Footer />
    </>
  )
}
