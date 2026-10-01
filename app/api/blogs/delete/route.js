import ConnectToDB from '@/app/lib/mongodb'
import { getAuthFromCookies } from '@/components/utils/authServer'
import Blogmodel from '@/model/Blogmodel'
import { NextResponse } from 'next/server'
export async function DELETE (req) {
    const auth = await getAuthFromCookies()
  
      if (!auth?.isLoggedIn) {
        return NextResponse.json(
          { message: "ابتدا وارد شوید" },
          { status: 401 }
        )
      }
  
     
      if (auth.user?.role !== 'ADMIN' &&  auth.user?.role !== 'SUPER_ADMIN' ) {
        return NextResponse.json(
          { message: 'دسترسی غیر مجاز' },
          { status: 403 }
        )
      }
  await ConnectToDB()

  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ message: 'آیدی نامعتبر است' }, { status: 400 })
    }

    const blogDelete = await Blogmodel.findOneAndDelete({ _id: id })

    if (!blogDelete) {
      return NextResponse.json({ message: 'بلاگ پیدا نشد' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'حذف بلاگ با موفقیت انجام شد' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ message: 'internal error' }, { status: 500 })
  }
}
