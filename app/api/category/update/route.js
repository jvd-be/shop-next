import ConnectToDB from '@/app/lib/mongodb'
import Categorymodel from '@/model/Categorymodel'
import path from 'path'
import { writeFile, mkdir } from 'fs/promises'
import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export async function PUT(req) {
  try {
    await ConnectToDB()

    const formData = await req.formData()

    const id = formData.get('id')
    const name = formData.get('name')
    const slug = formData.get('slug')
    const parent = formData.get('parent')
    const description = formData.get('description')
    const order = formData.get('order')
    const isActive = formData.get('isActive')
    const image = formData.get('image')

    if (!id) {
      return NextResponse.json(
        { message: 'شناسه دسته‌بندی ارسال نشده است' },
        { status: 400 }
      )
    }

    if (!name || !slug) {
      return NextResponse.json(
        { message: 'نام و اسلاگ دسته‌بندی الزامی هستند' },
        { status: 400 }
      )
    }

    const trimmedName = String(name).trim()
    const trimmedSlug = String(slug).trim()

    const category = await Categorymodel.findById(id)

    if (!category) {
      return NextResponse.json(
        { message: 'دسته‌بندی یافت نشد' },
        { status: 404 }
      )
    }

    const duplicateSlug = await Categorymodel.findOne({
      slug: trimmedSlug,
      _id: { $ne: id }
    })

    if (duplicateSlug) {
      return NextResponse.json(
        { message: 'این اسلاگ قبلاً برای دسته‌بندی دیگری استفاده شده است' },
        { status: 409 }
      )
    }

    category.name = trimmedName
    category.slug = trimmedSlug
    category.description = description ? String(description).trim() : ''
    category.order = Number(order) || 0
    category.isActive = isActive === 'true' || isActive === true

    if (!parent || parent === 'null' || parent === 'undefined') {
      category.parent = null
    } else {
      category.parent = parent
    }

    if (image && typeof image !== 'string' && image.size > 0) {
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const originalName = image.name || 'category-image'
      const ext = path.extname(originalName) || '.jpg'
      const fileName = `${randomUUID()}${ext}`

      const uploadDir = path.join(
        process.cwd(),
        'public',
        'uploads',
        'categories'
      )

      await mkdir(uploadDir, { recursive: true })

      const filePath = path.join(uploadDir, fileName)

      await writeFile(filePath, buffer)

      category.image = `/uploads/categories/${fileName}`
    }

    await category.save()

    return NextResponse.json(
      {
        message: 'دسته‌بندی با موفقیت ویرایش شد',
        category
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('PUT CATEGORY ERROR:', error)

    return NextResponse.json(
      { message: 'خطای سرور در ویرایش دسته‌بندی' },
      { status: 500 }
    )
  }
}
