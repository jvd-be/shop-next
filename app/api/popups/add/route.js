import { NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import { randomUUID } from "crypto"
import ConnectToDB from "@/app/lib/mongodb"
import PopupModel from "@/model/Popupmodel"
import { getAuthFromCookies } from "@/components/utils/authServer"

const UPLOAD_DIR = path.join(process.cwd(), "public/images/popup")
const UPLOAD_PREFIX = "/images/popup"
const MAX_FILE_SIZE = 5 * 1024 * 1024

function toBool(value) {
  return value === "true"
}

function toNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === "") return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toDate(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function sanitizeFileName(fileName) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-")
}

async function saveFile(file) {
  await fs.mkdir(UPLOAD_DIR, { recursive: true })

  const safeName = sanitizeFileName(file.name || "popup-image")
  const fileName = `${Date.now()}-${randomUUID()}-${safeName}`
  const filePath = path.join(UPLOAD_DIR, fileName)

  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(filePath, buffer)

  return `${UPLOAD_PREFIX}/${fileName}`
}

async function removeFile(fileUrl) {
  if (!fileUrl || typeof fileUrl !== "string" || !fileUrl.startsWith("/")) return

  const filePath = path.join(process.cwd(), "public", fileUrl)

  try {
    await fs.unlink(filePath)
  } catch (error) {
    console.error("POPUP FILE CLEANUP ERROR:", error)
  }
}

function validateInput(data) {
  if (!data.key?.trim()) return "فیلد key الزامی است"
  if (!data.title?.trim()) return "عنوان الزامی است"

  if (data.overlayOpacity < 0 || data.overlayOpacity > 100) {
    return "مقدار overlayOpacity باید بین 0 تا 100 باشد"
  }

  if (data.priority < 0) {
    return "مقدار priority نامعتبر است"
  }

  if (data.delay < 0) {
    return "مقدار delay نامعتبر است"
  }

  if (data.startDate && data.endDate && data.startDate > data.endDate) {
    return "تاریخ شروع نباید بعد از تاریخ پایان باشد"
  }

  return null
}

export async function POST(req) {
  let savedImagePath = ""

  try {
    const auth = await getAuthFromCookies()

    if (!auth?.isLoggedIn) {
      return NextResponse.json(
        { message: "ابتدا وارد شوید" },
        { status: 401 }
      )
    }

    if (auth.user?.role !== "ADMIN") {
      return NextResponse.json(
        { message: "دسترسی غیرمجاز" },
        { status: 403 }
      )
    }

    const formData = await req.formData()

    const key = formData.get("key")?.toString().trim() || ""
    const title = formData.get("title")?.toString().trim() || ""
    const description = formData.get("description")?.toString().trim() || ""
    const buttonText = formData.get("buttonText")?.toString().trim() || ""
    const buttonLink = formData.get("buttonLink")?.toString().trim() || ""
    const backgroundType = formData.get("backgroundType")?.toString().trim() || ""
    const backgroundColor = formData.get("backgroundColor")?.toString().trim() || ""
    const textColor = formData.get("textColor")?.toString().trim() || ""
    const buttonColor = formData.get("buttonColor")?.toString().trim() || ""
    const triggerType = formData.get("triggerType")?.toString().trim() || ""
    const frequency = formData.get("frequency")?.toString().trim() || ""
    const deviceTarget = formData.get("deviceTarget")?.toString().trim() || ""

    const overlayOpacity = toNumber(formData.get("overlayOpacity"), 0)
    const delay = toNumber(formData.get("delay"), 0)
    const priority = toNumber(formData.get("priority"), 0)

    const onlyGuest = toBool(formData.get("onlyGuest"))
    const isActive = toBool(formData.get("isActive"))
    const closable = toBool(formData.get("closable"))

    const startDate = toDate(formData.get("startDate"))
    const endDate = toDate(formData.get("endDate"))

    const imageFile = formData.get("image")

    const inputData = {
      key,
      title,
      description,
      buttonText,
      buttonLink,
      backgroundType,
      backgroundColor,
      textColor,
      buttonColor,
      overlayOpacity,
      triggerType,
      delay,
      onlyGuest,
      isActive,
      frequency,
      deviceTarget,
      priority,
      startDate,
      endDate,
      closable
    }

    const validationError = validateInput(inputData)
    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      )
    }

    await ConnectToDB()

    const existingPopup = await PopupModel.findOne({ key })
    if (existingPopup) {
      return NextResponse.json(
        { success: false, message: "این key قبلا ثبت شده است" },
        { status: 409 }
      )
    }

    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
      if (!imageFile.type?.startsWith("image/")) {
        return NextResponse.json(
          { success: false, message: "فایل انتخاب شده باید تصویر باشد" },
          { status: 400 }
        )
      }

      if (imageFile.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, message: "حجم تصویر بیشتر از حد مجاز است" },
          { status: 400 }
        )
      }

      savedImagePath = await saveFile(imageFile)
    }

    const popup = await PopupModel.create({
      ...inputData,
      image: savedImagePath
    })

    return NextResponse.json({
      success: true,
      popup
    })
  } catch (error) {
    if (savedImagePath) {
      await removeFile(savedImagePath)
    }

    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, message: "این key قبلا ثبت شده است" },
        { status: 409 }
      )
    }

    console.error("ADD POPUP ERROR:", error)

    return NextResponse.json(
      { success: false, message: "خطا در ساخت پاپ آپ" },
      { status: 500 }
    )
  }
}
