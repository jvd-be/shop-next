import Footer from '@/components/templates/footer/Footer'
import Menumobile from '@/components/templates/menuMoblie/Menumobile'
import Navbar from '@/components/templates/navbar/Navbar'
import Slidercategory from '@/components/modules/sliderCategory/Slidercategory'
import Headermobile from '@/components/modules/headermobile/Headermobile'
import Productsmain from '@/components/templates/productsmain/Productsmain'

import {
  Getbanners,
  GetPopups,
  GetSliders
} from '@/components/utils/helperServer'
import Popups from '@/components/templates/popups/Popups'
import Sliders from '@/components/templates/sliders/Sliders'
import GeneralModel from '@/model/GeneralModel'
import Categorymodel from '@/model/Categorymodel'

export default async function Home () {

  const popups = await GetPopups()
  const sliders = await GetSliders()
  let logoData = null
  let categoryData = null

  try {
    logoData = await GeneralModel.findOne(
      {},
      { siteLogo: 1, siteName: 1 }
    ).lean()

    categoryData = await Categorymodel.find({
   
      isActive: true,
      parent: null
    }).lean()
  } catch (error) {}
  const logo = JSON.parse(JSON.stringify(logoData))
  const category = JSON.parse(JSON.stringify(categoryData))
  const banners = await Getbanners()

  
  return (
    <div className='dark:bg-gray-800'>

      <Headermobile logo={logo} banners={banners}/>
      <Navbar />
      <Menumobile />
      <Popups popups={popups} popupKey='home' />
      <Sliders sliders={sliders} sliderKey={'home-hero'} />
      <Slidercategory category={category} />
      <Productsmain />
      <Footer />
    </div>
  )
}
