import ConnectToDB from '@/app/lib/mongodb'
import Blogmodel from '@/model/Blogmodel'
import { NextResponse } from 'next/server'
import path from 'path'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { randomUUID } from 'crypto'

function publicPathToFilePath(fileUrl) {
  if (!fileUrl || typeof fileUrl !== 'string') return null
  return path.join(process.cwd(), 'public', fileUrl.replace(/^\/+/, ''))
}

async function removeFile(fileUrl) {
  const filePath = publicPathToFilePath(fileUrl)
  if (!filePath) return

  try {
    await unlink(filePath)
  } catch (error) {
    // اگر فایل وجود نداشت، خطا را نادیده می گیریم
  }
}

export async function PUT(req) {
  await ConnectToDB()

  try {
    const formData = await req.formData()

    const id = formData.get('id')
    const title = formData.get('title')
    const description = formData.get('description')
    const coverImage = formData.get('coverImage')
    const isActive = formData.get('isActive') === 'true'
    const slug = formData.get('slug')
    const author = formData.get('author')

    let body = []

    try {
      body = JSON.parse(formData.get('body'))
    } catch {
      return NextResponse.json(
        { message: 'فرمت بادی نامعتبر است' },
        { status: 400 }
      )
    }

    const errors = []

    if (!id) errors.push('شناسه بلاگ الزامی است')
    if (!title) errors.push('وارد کردن تایتل الزامی است')
    if (!description) errors.push('وارد کردن توضیحات الزامی است')
    if (!body || !Array.isArray(body)) errors.push('وارد کردن بادی الزامی است')
    if (!slug) errors.push('وارد کردن اسلاگ الزامی است')
    if (!author) errors.push('وارد کردن نام نویسنده الزامی است')

    if (errors.length > 0) {
      return NextResponse.json(
        { message: 'خطا در اعتبار سنجی', errors },
        { status: 400 }
      )
    }

    const blog = await Blogmodel.findById(id)

    if (!blog) {
      return NextResponse.json(
        { message: 'بلاگ پیدا نشد' },
        { status: 404 }
      )
    }

    const existSlug = await Blogmodel.findOne({
      slug,
      _id: { $ne: id }
    })

    if (existSlug) {
      return NextResponse.json(
        { message: 'اسلاگ قبلا استفاده شده است' },
        { status: 400 }
      )
    }

    const coverDir = path.join(process.cwd(), 'public', 'images', 'blogs', 'cover')
    const bodyDir = path.join(process.cwd(), 'public', 'images', 'blogs', 'body')

    await mkdir(coverDir, { recursive: true })
    await mkdir(bodyDir, { recursive: true })

    let updatedCoverImage = blog.coverImage
    const oldCoverImage = blog.coverImage

    if (coverImage && coverImage.name) {
      const coverImageName = `${Date.now()}-${randomUUID()}-${coverImage.name}`
      const coverImagePath = path.join(coverDir, coverImageName)
      const buffer = Buffer.from(await coverImage.arrayBuffer())

      await writeFile(coverImagePath, buffer)
      updatedCoverImage = `/images/blogs/cover/${coverImageName}`
    }

    const oldBodyImages = Array.isArray(blog.body)
      ? blog.body.flatMap(section =>
          Array.isArray(section.subImages) ? section.subImages : []
        )
      : []

    const newBody = []

    for (let i = 0; i < body.length; i++) {
      const section = body[i]
      const keptImages = Array.isArray(section.oldImages) ? [...section.oldImages] : []
      const files = formData.getAll(`sectionImage${i}`)

      for (const file of files) {
        if (!file || !file.name) continue

        const fileName = `${Date.now()}-${randomUUID()}-${file.name}`
        const filePath = path.join(bodyDir, fileName)
        const buffer = Buffer.from(await file.arrayBuffer())

        await writeFile(filePath, buffer)
        keptImages.push(`/images/blogs/body/${fileName}`)
      }

      newBody.push({
        subTitle: section.subTitle,
        subDescription: section.subDescription,
        subImages: keptImages
      })
    }

    const newBodyImages = newBody.flatMap(section =>
      Array.isArray(section.subImages) ? section.subImages : []
    )

    const removedBodyImages = oldBodyImages.filter(
      image => !newBodyImages.includes(image)
    )

    const updatedBlog = await Blogmodel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        slug,
        author,
        isActive,
        coverImage: updatedCoverImage,
        body: newBody
      },
      { new: true }
    )

    if (
      oldCoverImage &&
      updatedCoverImage !== oldCoverImage
    ) {
      await removeFile(oldCoverImage)
    }

    await Promise.all(removedBodyImages.map(removeFile))

    return NextResponse.json(
      {
        message: 'بلاگ با موفقیت ویرایش شد',
        blog: updatedBlog
      },
      { status: 200 }
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
