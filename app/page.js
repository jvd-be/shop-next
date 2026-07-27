import Footer from '@/components/templates/footer/Footer'
import Menumobile from '@/components/templates/menuMoblie/Menumobile'
import Navbar from '@/components/templates/navbar/Navbar'
import Slidercategory from '@/components/modules/sliderCategory/Slidercategory'
import Headermobile from '@/components/modules/headermobile/Headermobile'
import Productsmain from '@/components/templates/productsmain/Productsmain'
import Banners from '@/components/templates/banners/Banners'
import { Getbanners, GetPopups, GetSliders } from '@/components/utils/helperServer'
import Popups from '@/components/templates/popups/Popups'
import Sliders from '@/components/templates/sliders/Sliders'
import GeneralModel from '@/model/GeneralModel'

export default async function Home () {
  const banners = await Getbanners()
  const popups = await GetPopups()
  const sliders = await GetSliders()
  let logoData = null

  try {
      logoData = await GeneralModel.findOne(
          {},
          { siteLogo: 1, siteName: 1 }
        ).lean()
  } catch (error) {
    
  }
  const logo = JSON.parse(JSON.stringify(logoData))


  return (
    <div className='dark:bg-gray-800'>
      <Banners banners={banners} bannerKey='Top-banner' />
      <Headermobile logo={logo}/>
      <Navbar />
      <Menumobile/>
      <Popups popups={popups} popupKey='home'/>
      <Sliders sliders={sliders} sliderKey={"home-hero"} />
      <Slidercategory />
      <Productsmain />
      <Footer />
    </div>
  )
}
