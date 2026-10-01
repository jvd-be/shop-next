import ConnectToDB from '@/app/lib/mongodb'
import { NextResponse } from 'next/server'
import Blogmodel from '@/model/Blogmodel'
import path from 'path'
import { writeFile, mkdir } from 'fs/promises'
import { randomUUID } from 'crypto'
import { getAuthFromCookies } from '@/components/utils/authServer'

export async function POST (req) {
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
    const formData = await req.formData()
    const title = formData.get('title')
    const description = formData.get('description')
    const coverImage = formData.get('coverImage')
    const isActive = formData.get('isActive') === 'true'
    const body = JSON.parse(formData.get('body'))
    const slug = formData.get('slug')
    const author = formData.get('author')

    const errors = []
    if (!title) errors.push('وارد کردن تایتل الزامی است')
    if (!description) errors.push('وارد کردن توضیحات الزامی است')
    if (!coverImage) errors.push('وارد کردن کاور ایمج الزامی است')
    if (!body) errors.push('وارد کردن بادی الزامی است')
    if (!slug) errors.push('وارد کردن اسلاگ الزامی است')
    if (!author) errors.push('وارد کردن نام نویسنده الزامی است')

    if (errors.length > 0) {
      return NextResponse.json(
        { message: 'خطا در اعتبار سنجی', errors },
        { status: 400 }
      )
    }

    const existSlug = await Blogmodel.findOne({ slug })

    if (existSlug) {
      return NextResponse.json(
        { message: 'اسلاگ قبلا استفاده شده است' },
        { status: 400 }
      )
    }

    const pathCoverImageBlog = path.join(
      process.cwd(),
      'public',
      'images',
      'blogs',
      'cover'
    )

    const bodyDir = path.join(
      process.cwd(),
      'public',
      'images',
      'blogs',
      'body'
    )

    await mkdir(pathCoverImageBlog, { recursive: true })
    await mkdir(bodyDir, { recursive: true })

    const coverImageName = `${Date.now()}-${randomUUID()}-${coverImage.name}`
    const pathCoverImage = path.join(pathCoverImageBlog, coverImageName)
    const buffer = Buffer.from(await coverImage.arrayBuffer())
    await writeFile(pathCoverImage, buffer)

    const savedCoverImagePath = `/images/blogs/cover/${coverImageName}`

    for (let i = 0; i < body.length; i++) {
      const sectionImages = formData.getAll(`sectionImage${i}`)
      const uploadedImages = []

      for (const image of sectionImages) {
        if (!image || !image.name) continue

        const imageBodyName = `${Date.now()}-${randomUUID()}-${image.name}`
        const filePath = path.join(bodyDir, imageBodyName)
        const buffer = Buffer.from(await image.arrayBuffer())

        await writeFile(filePath, buffer)
        uploadedImages.push(`/images/blogs/body/${imageBodyName}`)
      }

      body[i].subImages = uploadedImages
    }

    const blog = await Blogmodel.create({
      title,
      description,
      slug,
      author,
      isActive,
      coverImage: savedCoverImagePath,
      body
    })

    return NextResponse.json(
      {
        message: 'بلاگ با موفقیت ساخته شد',
        blog
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'خطای داخلی سرور', error: error.message },
      { status: 500 }
    )
  }
}
