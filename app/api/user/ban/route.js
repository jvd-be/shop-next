import ConnectToDB from '@/app/lib/mongodb'
import { NextResponse } from 'next/server'
import Usermodel from '@/model/Usermodel'
export async function PUT (req) {
  try {
    await ConnectToDB()

    const body = await req.json()
    const { id } = body

    const user = await Usermodel.findById(id)

    if (!user) {
      return NextResponse.json(
        { message: 'کاربری با همچین ایدی وجود ندارد' },
        { status: 404 }
      )
    }

    user.isBanned = !user.isBanned

    const updatedUser = await user.save()

    return NextResponse.json(
      { message: 'با موفقیت وضعیت تغییر کرد', user: updatedUser },
      { status: 200 }
    )
  } catch (error) {
    console.log(error);
    
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
