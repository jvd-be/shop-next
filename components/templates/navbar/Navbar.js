import { getAuthFromCookies } from '@/components/utils/authServer'
import Navbarwrapper from '../navbarwrapper/Navbarwrapper'
import GeneralModel from '@/model/GeneralModel'
import ConnectToDB from '@/app/lib/mongodb'
import ProductModel from '@/model/ProductModel'
import Blogmodel from '@/model/Blogmodel'
import Categorymodel from '@/model/Categorymodel'
import { Getbanners } from '@/components/utils/helperServer'

export default async function Navbar () {
  const auth = await getAuthFromCookies()
  let logoData = null
  let blogs = null
  let products = null
  let categoriesData = null
  const banners = await Getbanners()
  try {
    await ConnectToDB()
    logoData = await GeneralModel.findOne(
      {},
      { siteLogo: 1, siteName: 1 }
    ).lean()
    blogs = await Blogmodel.find({ isActive: true }).lean()
    categoriesData = await Categorymodel.find({
      isActive: true
    })
      .populate('parent', 'name slug')
      .sort({ order: 1 })
      .lean()
    let productsRow = await ProductModel.find({})
      .lean()
      .populate('category', 'name')
      .lean()
    products = productsRow.map(item => ({
      ...item,
      _id: item._id.toString(),
      createdAt: item?.createdAt?.toISOString(),
      updatedAt: item?.updatedAt?.toISOString()
    }))
  } catch (error) {}
  const logo = JSON.parse(JSON.stringify(logoData))
  let initialblogs = JSON.parse(JSON.stringify(blogs))
  let initialproducts = JSON.parse(JSON.stringify(products))
  let categories = JSON.parse(JSON.stringify(categoriesData))

  return (
    <div>
      <Navbarwrapper
        banners={banners}
        auth={auth}
        logo={logo}
        initialblogs={initialblogs}
        initialproducts={initialproducts}
        categories={categories}
      />
    </div>
  )
}
