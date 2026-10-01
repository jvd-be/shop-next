import ConnectToDB from '@/app/lib/mongodb'
import { NextResponse } from 'next/server'
import ProductModel from '@/model/ProductModel'

import path from 'path'
import { randomUUID } from 'crypto'
import { writeFile, mkdir } from 'fs/promises'
import { getAuthFromCookies } from '@/components/utils/authServer'

export async function PUT(req) {
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

    const id = formData.get('id')

    const title = formData.get('title')?.trim()
    const slug = formData.get('slug')?.trim()?.toLowerCase()
    const description = formData.get('description')?.trim()

    const category = formData.get('category')

    const price = Number(formData.get('price'))
    const discount = Number(formData.get('discount') || 0)

    const isFeatured = formData.get('isFeatured') === 'true'
    const isActive = formData.get('isActive') === 'true'

    const images = formData.getAll('images')
    const existingImages = formData.getAll('existingImages')

    const variantsStr = formData.get('variants')

    let variants = []

    if (variantsStr) {
      try {
        variants = JSON.parse(variantsStr)
      } catch {
        return NextResponse.json(
          { message: 'فرمت variants نامعتبر است' },
          { status: 400 }
        )
      }
    }

    // validation
    const errors = []

    if (!id) errors.push('شناسه محصول الزامی است')
    if (!title) errors.push('عنوان محصول الزامی است')
    if (!slug) errors.push('اسلاگ محصول الزامی است')
    if (!description) errors.push('توضیحات محصول الزامی است')
    if (!category) errors.push('دسته‌بندی الزامی است')

    if (isNaN(price) || price < 0) {
      errors.push('قیمت نامعتبر است')
    }

    if (isNaN(discount) || discount < 0 || discount > 100) {
      errors.push('تخفیف باید بین 0 تا 100 باشد')
    }

    if (!Array.isArray(variants) || variants.length === 0) {
      errors.push('حداقل یک variant الزامی است')
    }

    const isInvalidVariant = variants.some(
      (variant) =>
        !variant.color ||
        !variant.size ||
        variant.quantity == null ||
        Number(variant.quantity) < 0
    )

    if (isInvalidVariant) {
      errors.push('اطلاعات رنگ، سایز یا موجودی نامعتبر است')
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          message: 'خطا در اعتبارسنجی',
          errors
        },
        { status: 400 }
      )
    }

    const product = await ProductModel.findById(id)

    if (!product) {
      return NextResponse.json(
        { message: 'محصول پیدا نشد' },
        { status: 404 }
      )
    }

    // محاسبه موجودی کل
    const totalQuantity = variants.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    )

    // محاسبه قیمت نهایی
    const finalPrice =
      price - (price * discount) / 100

    // مدیریت تصاویر
    let finalImages = [...existingImages]

    if (
      images &&
      images.length > 0 &&
      images[0] &&
      images[0].size > 0
    ) {
      const savedImagePaths = []

      const dir = path.join(
        process.cwd(),
        'public',
        'images',
        'products'
      )

      await mkdir(dir, { recursive: true })

      for (const file of images) {
        if (!(file instanceof File) || file.size === 0) {
          continue
        }

        const safeOriginalName = (
          file.name || 'image'
        ).replaceAll('/', '_')

        const imageName = `${Date.now()}-${randomUUID()}-${safeOriginalName}`

        const filePath = path.join(dir, imageName)

        const buffer = Buffer.from(
          await file.arrayBuffer()
        )

        await writeFile(filePath, buffer)

        savedImagePaths.push(
          `/images/products/${imageName}`
        )
      }

      finalImages = [
        ...existingImages,
        ...savedImagePaths
      ]
    }

    const editedProduct =
      await ProductModel.findByIdAndUpdate(
        id,
        {
          title,
          slug,
          description,
          images: finalImages,

          category,

          price,
          discount,
          finalPrice,

          variants,
          totalQuantity,

          isFeatured,
          isActive
        },
        {
          new: true,
          runValidators: true
        }
      ).populate('category')

    return NextResponse.json(
      {
        message: 'محصول با موفقیت ویرایش شد',
        product: editedProduct
      },
      { status: 200 }
    )
  } catch (error) {
    console.log('PUT PRODUCT ERROR:', error)

    return NextResponse.json(
      {
        message: 'خطای داخلی سرور',
        error: error.message
      },
      { status: 500 }
    )
  }
}