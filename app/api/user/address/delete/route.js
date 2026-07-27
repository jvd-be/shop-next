import ConnectToDB from '@/app/lib/mongodb'
import { getAuthFromCookies } from '@/components/utils/authServer'
import { NextResponse } from 'next/server'
import Usermodel from '@/model/Usermodel'
export async function DELETE (req) {
  try {
    await ConnectToDB()
    const auth = await getAuthFromCookies()
    
    
    if (!auth.isLoggedIn) {
      return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 })
    }
    const body = await req.json()
    const { addressId } = body
    if (!addressId) {
      return NextResponse.json(
        { message: 'آیدی آدرس الزامی است' },
        { status: 400 }
      )
    }

    const userId= auth.user.userId
    const updatedUser = await Usermodel.findByIdAndUpdate(
     userId,
      {
        $pull: { addresses: { _id: addressId } }
      },
      { new: true }
    )


    if (updatedUser.addresses.length > 0) {
      const hasDefault = updatedUser.addresses.some(addr => addr.isDefault)
      if (!hasDefault) {
        updatedUser.addresses[0].isDefault = true
        await updatedUser.save()
      }
    }

    return NextResponse.json(
      { message: 'آدرس با موفقیت حذف شد', addresses: updatedUser.addresses },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error adding address:', error)
    return NextResponse.json(
      { message: 'خطای سرور در ثبت آدرس' },
      { status: 500 }
    )
  }
}
