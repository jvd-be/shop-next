import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import ConnectToDB from '@/app/lib/mongodb'
import Discountmodel from '@/model/Discountmodel'
import { getAuthFromCookies } from '@/components/utils/authServer'

export async function DELETE(req) {
  try {
    await ConnectToDB()

    const auth = await getAuthFromCookies()

    if (!auth?.isLoggedIn) {
      return NextResponse.json(
        { error: 'ابتدا وارد شوید' },
        { status: 401 }
      )
    }

    
 
    if (auth.user?.role !== 'ADMIN' &&  auth.user?.role !== 'SUPER_ADMIN' ) {
      return NextResponse.json(
        { message: 'دسترسی غیر مجاز' },
        { status: 403 }
      )
    }

    const { id } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: 'شناسه تخفیف ارسال نشده' },
        { status: 400 }
      )
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'شناسه نامعتبر است' },
        { status: 400 }
      )
    }

    const deleted = await Discountmodel.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json(
        { error: 'کد تخفیف پیدا نشد' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'کد تخفیف با موفقیت حذف شد'
    })

  } catch (error) {
    console.error('Delete Discount Error:', error)

    return NextResponse.json(
      { error: 'خطا در حذف کد تخفیف' },
      { status: 500 }
    )
  }
}
