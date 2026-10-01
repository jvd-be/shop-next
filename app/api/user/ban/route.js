import ConnectToDB from '@/app/lib/mongodb'
import { NextResponse } from 'next/server'
import Usermodel from '@/model/Usermodel'
import { getAuthFromCookies } from '@/components/utils/authServer'
export async function PUT (req) {
  try {
    const auth = await getAuthFromCookies()

    if (!auth?.isLoggedIn) {
      return NextResponse.json({ message: 'ابتدا وارد شوید' }, { status: 401 })
    }

    if (auth.user?.role !== 'ADMIN' && auth.user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'دسترسی غیر مجاز' }, { status: 403 })
    }
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
    console.log(error)

    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
