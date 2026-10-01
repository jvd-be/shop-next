import ConnectToDB from '@/app/lib/mongodb'
import ProductModel from '@/model/ProductModel'
import { writeFile, mkdir } from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'
import { randomUUID } from 'crypto'
import { getAuthFromCookies } from '@/components/utils/authServer'

export async function POST (req) {
  await ConnectToDB()
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
  try {
    const formData = await req.formData()

    const title = formData.get('title')
    const slug = formData.get('slug')
    const description = formData.get('description')
    const images = formData.getAll('images')
    const category = formData.get('category')
    const price = Number(formData.get('price'))
    const discount = Number(formData.get('discount') || 0)
    const totalQuantity = Number(formData.get('totalQuantity'))
    const soldCount = Number(formData.get('soldCount') || 0)
    const reviews = formData.getAll('reviews') || []
    const averageRating = Number(formData.get('averageRating') || 0)
    const isFeatured = formData.get('isFeatured') === 'true'
    const isActive = formData.get('isActive') === 'true'

    const variantsStr = formData.get('variants')
    let variants = []

    if (variantsStr) {
      try {
        variants = JSON.parse(variantsStr)
      } catch (err) {
        return NextResponse.json(
          { message: 'فرمت variants نامعتبر است' },
          { status: 400 }
        )
      }
    }

    // ---------- Validation ----------
    const errors = []
    if (!title) errors.push('عنوان محصول الزامی است')
    if (!slug) errors.push('اسلاگ برای محصول الزامی است')
    if (!description) errors.push('توضیحات برای محصول الزامی است')
    if (!images || images.length === 0)
      errors.push('عکس ها برای محصولات الزامی است')
    if (!category) errors.push('تعیین کتگوری الزامی است')
    if (!price) errors.push('تعیین قیمت الزامی است')
    if (!variants || variants.length === 0)
      errors.push('تعیین رنگ و سایز الزامی است')
    if (!totalQuantity) errors.push('تعیین مقدار الزامی است')

    if (errors.length > 0) {
      return NextResponse.json(
        { message: 'خطا در اعتبار سنجی', errors },
        { status: 400 }
      )
    }

    // ---------- SAVE IMAGES ----------
    const savedImagePaths = []
    const pathImage = path.join(process.cwd(), 'public', 'images', 'products')

    for (const file of images) {
      const imagename = `${Date.now()}-${randomUUID()}-${file.name}`
      const filepath = path.join(pathImage, imagename)
      const buffer = Buffer.from(await file.arrayBuffer())

      await writeFile(filepath, buffer)

      savedImagePaths.push(`/images/products/${imagename}`)
    }

    // ---------- CALCULATE finalPrice ----------
    const discountAmount = Math.round((price * discount) / 100)
    const finalPrice = Math.round((price - discountAmount) / 1000) * 1000

    // ---------- CREATE PRODUCT ----------
    const newProduct = await ProductModel.create({
      title,
      slug,
      description,
      images: savedImagePaths,
      category,
      price,
      discount,
      finalPrice, 
      variants,
      totalQuantity,
      soldCount,
      reviews,
      isFeatured,
      isActive,
      averageRating
    })

    return NextResponse.json(
      {
        message: 'محصول با موفقیت ایجاد شد',
        product: newProduct
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: 'خطای داخلی سرور',
        error: error.message
      },
      { status: 500 }
    )
  }
}
