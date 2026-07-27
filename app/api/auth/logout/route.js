import ConnectToDB from '@/app/lib/mongodb'
import { getAuthFromCookies } from '@/components/utils/authServer'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST (req) {
  try {
    await ConnectToDB()

    const auth = await getAuthFromCookies()

    if (!auth) {
      return NextResponse.json({ message: 'شما لاگین نیستید' }, { status: 404 })
    }
    const cookieStore=await cookies()

    cookieStore.delete("refreshToken")
    cookieStore.delete("accessToken")

    const response = NextResponse.json(
      { message: 'خروج با موفقیت انجام شد' },
      { status: 200 }
    )
    return response
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      { message: error.message || 'خطای سرور' },
      { status: 500 }
    )
  }
}
