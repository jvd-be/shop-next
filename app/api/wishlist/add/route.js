import ConnectToDB from '@/app/lib/mongodb'
import { getAuthFromCookies } from '@/components/utils/authServer'
import ProductModel from '@/model/ProductModel'
import Usermodel from '@/model/Usermodel'
import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

export async function POST(req) {
  try {
    await ConnectToDB()

    const auth = await getAuthFromCookies()


    if (!auth?.isLoggedIn) {
      return NextResponse.json(
        {
          message:
            'برای اضافه کردن محصول به لیست محصولات مورد علاقه ابتدا باید وارد حساب کاربری شوید'
        },
        { status: 401 }
      )
    }

    const userId = auth?.user?.userId

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: 'شناسه کاربر معتبر نیست' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { productId } = body

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { message: 'شناسه محصول معتبر نمی‌باشد' },
        { status: 400 }
      )
    }

    const productExists = await ProductModel.exists({ _id: productId })
    if (!productExists) {
      return NextResponse.json(
        { message: 'محصول مورد نظر یافت نشد' },
        { status: 404 }
      )
    }

    const user = await Usermodel.findById(userId).select('wishlist')
    if (!user) {
      return NextResponse.json(
        { message: 'کاربر یافت نشد' },
        { status: 404 }
      )
    }

    const isWishlist = user.wishlist.some(
      id => String(id) === String(productId)
    )

    const updatedUser = await Usermodel.findByIdAndUpdate(
      userId,
      isWishlist
        ? { $pull: { wishlist: productId } }
        : { $addToSet: { wishlist: productId } },
      { new: true }
    ).select('wishlist')


    return NextResponse.json(
      {
        message: isWishlist
          ? 'از لیست علاقه‌مندی‌ها حذف شد'
          : 'به لیست علاقه‌مندی‌ها اضافه شد',
        isAdded: !isWishlist,
        wishlist: updatedUser?.wishlist || []
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Wishlist Error:', error)
    return NextResponse.json(
      {
        message: 'خطای سرور در پردازش درخواست',
        error: error.message
      },
      { status: 500 }
    )
  }
}
