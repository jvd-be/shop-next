import ConnectToDB from '@/app/lib/mongodb'
import Bannermodel from '@/model/Bannermodel'
import PopupModel from '@/model/Popupmodel'
import SliderModel from '@/model/Slidermodel'
export async function Getbanners () {
  try {
    await ConnectToDB()

    const now = new Date()
    const bannersData = await Bannermodel.find({
      isActive: true,

      $and: [
        {
          $or: [
            {
              startDate: {
                $exists: false
              }
            },
            {
              startDate: {
                $lte: now
              }
            }
          ]
        },

        {
          $or: [
            {
              endDate: {
                $exists: false
              }
            },
            {
              endDate: {
                $gte: now
              }
            }
          ]
        }
      ]
    }).lean()
    const banners = JSON.parse(JSON.stringify(bannersData))
    return banners
  } catch (error) {
    console.log(error)
  }
}

export async function GetPopups () {
  try {
    await ConnectToDB()

    const now = new Date()

    const popupsData = await PopupModel.find({
      isActive: true,

      $and: [
        {
          $or: [
            {
              startDate: {
                $exists: false
              }
            },
            {
              startDate: {
                $lte: now
              }
            }
          ]
        },

        {
          $or: [
            {
              endDate: {
                $exists: false
              }
            },
            {
              endDate: {
                $gte: now
              }
            }
          ]
        }
      ]
    }).lean()

    const popups = JSON.parse(JSON.stringify(popupsData))
    return popups
  } catch (error) {
    console.log(error)
  }
}

export async function GetSliders () {
  try {
    await ConnectToDB()

    const now = new Date()

    const slidersData = await SliderModel.find({
      isActive: true,
      $and: [
        {
          $or: [
            { startDate: { $exists: false } },
            { startDate: null },
            { startDate: { $lte: now } }
          ]
        },
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: null },
            { endDate: { $gte: now } }
          ]
        }
      ]
    }).lean()


    const sliders = JSON.parse(JSON.stringify(slidersData))
    return sliders
  } catch (error) {
    console.log('GET SLIDERS ERROR:', error)
    return []
  }
}
