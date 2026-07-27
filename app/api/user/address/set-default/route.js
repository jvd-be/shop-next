import ConnectToDB from '@/app/lib/mongodb'
import { getAuthFromCookies } from '@/components/utils/authServer'
import Usermodel from '@/model/Usermodel'
import { NextResponse } from 'next/server'
export async function PUT (req) {
  try {
    await ConnectToDB()
    const authUser = await getAuthFromCookies()

    if (!authUser.isLoggedIn) {
      return NextResponse.json(
        { message: 'لطفا ابتدا وارد حساب خود شوید' },
        { status: 401 }
      )
    }

    const userId = authUser.user.userId

    await Usermodel.updateOne(
      { _id: userId },
      {
        $set: { 'addresses.$[].isDefault': false }
      }
    )
    const body = await req.json()
    const { addressId } = body
    const updatedUser = await Usermodel.findOneAndUpdate(
      {
        _id: userId,
        'addresses._id': addressId
      },
      { $set: { 'addresses.$.isDefault': true } },

      { new: true }
    ).lean()

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'کاربر یا آدرس یافت نشد' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        message: 'آدرس پیش‌فرض با موفقیت تغییر کرد',
        addresses: updatedUser.addresses
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error setting default address:', error)
    return NextResponse.json(
      { message: 'خطای سرور در تغییر آدرس پیش‌فرض' },
      { status: 500 }
    )
  }
}
