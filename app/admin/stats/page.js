import Adminlayout from '@/components/templates/Admin/adminlayout/Adminlayout'
import Adminstatswrapper from '@/components/templates/Admin/adminstatswrapper/Adminstatswrapper'
import ConnectToDB from '@/app/lib/mongodb'
import Ordermodel from '@/model/Ordermodel'
import Usermodel from '@/model/Usermodel'
import ProductModel from '@/model/ProductModel'

export default async function page () {
  let orderData = null
  let newCustomers = null
  let openOrders = null
  let bestSelsData = null
  let salesData = null

  try {
    await ConnectToDB()
    orderData = await Ordermodel.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name phone addresses')
      .populate('items.product')

    const start = new Date()
    start.setDate(1)
    start.setHours(0, 0, 0, 0)

    salesData = await Ordermodel.aggregate([
      {
        $match: {
          isPaid: true
        }
      },
      {
        $project: {
          itemsTotal: 1,
          createdAt: 1
        }
      }
    ])

    newCustomers = await Usermodel.countDocuments({
      totalOrders: 1,
      updatedAt: { $gte: start }
    })

    openOrders = await Ordermodel.countDocuments({ status: 'PROCESSING' })

    bestSelsData = await ProductModel.find().sort({ soldCount: -1 }).limit(4)
  } catch (error) {}
  const orders = JSON.parse(JSON.stringify(orderData))
  const bestSels = JSON.parse(JSON.stringify(bestSelsData))
  salesData = JSON.parse(JSON.stringify(salesData))


  
  return (
    <Adminlayout>
      <Adminstatswrapper
        orders={orders}
        newCustomers={newCustomers}
        openOrders={openOrders}
        bestSels={bestSels}
        salesData={salesData}
      />
    </Adminlayout>
  )
}
