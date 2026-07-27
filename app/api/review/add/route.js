import ConnectToDB from '@/app/lib/mongodb'
import { getAuthFromCookies } from '@/components/utils/authServer'
import Reviewmodel from '@/model/Reviewmodel'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {

    await ConnectToDB()

    const auth = await getAuthFromCookies()

    if (!auth?.isLoggedIn) {
      return NextResponse.json(
        { message: 'ابتدا وارد شوید' },
        { status: 401 }
      )
    }

    const body = await req.json()
 
    
    const { commentBody, rating, productId } = body

 if (!productId || typeof commentBody !== 'string' || !rating) {
  return NextResponse.json(
    { message: 'اطلاعات نامعتبر است' },
    { status: 400 }
  )
}
    const review = await Reviewmodel.create({
      product: productId,
      user: auth.user.userId,
      rating,
      comment: commentBody
    })

    return NextResponse.json(
      { review },
      { status: 201 }
    )

  } catch (error) {

    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'شما قبلاً برای این محصول نظر ثبت کرده‌اید' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'خطا در ثبت نظر' },
      { status: 500 }
    )
  }
}
