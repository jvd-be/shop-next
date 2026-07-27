import ConnectToDB from '@/app/lib/mongodb'
import Categorymodel from '@/model/Categorymodel'
import path from 'path'
import { writeFile } from 'fs/promises'
import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export async function POST(req) {

  try {

    await ConnectToDB()

    const formData = await req.formData()

    const name = formData.get('name')?.trim()
    const slug = formData.get('slug')?.trim().toLowerCase()
    const order = Number(formData.get('order'))
    const parent = formData.get('parent') || null
    const level = Number(formData.get('level'))
    const image = formData.get('image')
    const description = formData.get('description')?.trim()

    const errors = []

    if (!name) errors.push('نام الزامی است')
    if (!slug) errors.push('اسلاگ الزامی است')
    if (!order && order !== 0) errors.push('ترتیب نمایش الزامی است')
    if (!description) errors.push('توضیحات الزامی است')
    if (!image || typeof image === "string") errors.push('تصویر الزامی است')

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    // ✅ جلوگیری از slug تکراری
    const slugExists = await Categorymodel.findOne({ slug })

    if (slugExists) {
      return NextResponse.json(
        { message: 'این اسلاگ قبلا ثبت شده است' },
        { status: 409 }
      )
    }

    // ✅ بررسی نوع فایل
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        { message: 'فرمت تصویر مجاز نیست' },
        { status: 400 }
      )
    }

    // ✅ محدودیت حجم (2MB)
    const maxSize = 2 * 1024 * 1024

    if (image.size > maxSize) {
      return NextResponse.json(
        { message: 'حجم تصویر بیشتر از حد مجاز است' },
        { status: 400 }
      )
    }

    // ✅ ذخیره فایل
    const pathImage = path.join(process.cwd(), 'public', 'images', 'category')

    const safeFileName = `${Date.now()}-${randomUUID()}.${image.type.split('/')[1]}`

    const filepath = path.join(pathImage, safeFileName)

    const buffer = Buffer.from(await image.arrayBuffer())

    await writeFile(filepath, buffer)

    const savedImagePath = `/images/category/${safeFileName}`

    await Categorymodel.create({
      name,
      slug,
      order,
      level,
      image: savedImagePath,
      description,
      parent
    })

    return NextResponse.json(
      { message: 'دسته بندی با موفقیت ایجاد شد' },
      { status: 201 }
    )

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { message: 'خطای سرور' },
      { status: 500 }
    )
  }
}
