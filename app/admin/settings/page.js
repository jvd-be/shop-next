import ConnectToDB from '@/app/lib/mongodb'
import Adminlayout from '@/components/templates/Admin/adminlayout/Adminlayout'
import Adminsettingswrapper from '@/components/templates/Admin/adminsettingswrapper/Adminsettingswrapper'
import { Getbanners } from '@/components/utils/helper'
import Bannermodel from '@/model/Bannermodel'
import Contactmodel from '@/model/Contactmodel'
import Discountmodel from '@/model/Discountmodel'
import GeneralModel from '@/model/GeneralModel'
import PopupModel from '@/model/Popupmodel'
import ShippingModel from '@/model/Shippingmodel'
import SliderModel from '@/model/Slidermodel'
import Socialmodel from '@/model/Socialmodel'
import React from 'react'

export default async function Adminsettingspage () {
  let discountsData = null
  let shippingData = null
  let bannersData = null
  let popupsData = null
  let slidersData = null
  let contactData = null
  let socialsData = null
  let generalSeoData = null

  try {
    await ConnectToDB()
    discountsData = await Discountmodel.find().lean()
    shippingData = await ShippingModel.findOne().lean()
    bannersData = await Bannermodel.find().lean()
    popupsData = await PopupModel.find().lean()
    slidersData = await SliderModel.find().lean()
    contactData = await Contactmodel.find().lean()
    socialsData = await Socialmodel.find().lean()
    generalSeoData = await GeneralModel.find().lean()
  } catch (error) {
    return false
  }
  let discounts = JSON.parse(JSON.stringify(discountsData))
  let shippings = JSON.parse(JSON.stringify(shippingData))
  let banners = JSON.parse(JSON.stringify(bannersData))
  let popups = JSON.parse(JSON.stringify(popupsData))
  let sliders = JSON.parse(JSON.stringify(slidersData))
  let contacts = JSON.parse(JSON.stringify(contactData[0]))
  let socials = JSON.parse(JSON.stringify(socialsData[0]))
  let generalSeo = JSON.parse(JSON.stringify(generalSeoData))


  return (
    <Adminlayout>
      <Adminsettingswrapper
        discounts={discounts}
        shippings={shippings}
        banners={banners}
        popups={popups}
        sliders={sliders}
        contacts={contacts}
        socials={socials}
        generalSeo={generalSeo}
      />
    </Adminlayout>
  )
}
