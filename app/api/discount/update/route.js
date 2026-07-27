import { NextResponse } from "next/server"
import ConnectToDB from "@/app/lib/mongodb"
import Discountmodel from "@/model/Discountmodel"
import mongoose from "mongoose"
import { getAuthFromCookies } from "@/components/utils/authServer"

export async function PATCH(req) {

  try {

    await ConnectToDB()

    const auth = await getAuthFromCookies()

    // ✅ بررسی لاگین
    if (!auth?.isLoggedIn) {
      return NextResponse.json(
        { message: "ابتدا وارد شوید" },
        { status: 401 }
      )
    }

    // ✅ فقط ادمین
    if (auth.user?.role !== "ADMIN") {
      return NextResponse.json(
        { message: "دسترسی غیرمجاز" },
        { status: 403 }
      )
    }

    const body = await req.json()

    const { id, ...updateFields } = body
    
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "شناسه نامعتبر است" },
        { status: 400 }
      )
    }

    const existingDiscount = await Discountmodel.findById(id)

    if (!existingDiscount) {
      return NextResponse.json(
        { message: "کد تخفیف یافت نشد" },
        { status: 404 }
      )
    }

    const allowedFields = [
      "code",
      "typediscount",
      "value",
      "status",
      "usageLimit",
      "minPurchase",
      "perUserLimit",
      "firstPurchaseOnly",
      "products",
      "categories",
      "expiredDate"
    ]

    const sanitizedData = {}

    for (const key of allowedFields) {

      if (!(key in updateFields)) continue

      switch (key) {

        case "code":
          sanitizedData.code = updateFields.code?.trim().toUpperCase()
          break

        case "value":
        case "minPurchase":
        case "perUserLimit":
          sanitizedData[key] = Math.max(0, Number(updateFields[key]) || 0)
          break

        case "usageLimit":
          sanitizedData.usageLimit = updateFields.usageLimit
            ? Math.max(1, Number(updateFields.usageLimit))
            : null
          break

        case "expiredDate":
          sanitizedData.expiredDate = updateFields.expiredDate
            ? new Date(updateFields.expiredDate)
            : null
          break

        case "status":
        case "firstPurchaseOnly":
          sanitizedData[key] = Boolean(updateFields[key])
          break

        case "products":
        case "categories":
          sanitizedData[key] = Array.isArray(updateFields[key])
            ? updateFields[key]
            : []
          break

        case "typediscount":

          if (!["Percent", "Fixed", "Shipping"].includes(updateFields.typediscount)) {
            return NextResponse.json(
              { message: "نوع تخفیف نامعتبر است" },
              { status: 400 }
            )
          }

          sanitizedData.typediscount = updateFields.typediscount
          break

        default:
          sanitizedData[key] = updateFields[key]
      }
    }

    // ✅ محدودیت درصد
    if (
      sanitizedData.typediscount === "Percent" &&
      sanitizedData.value > 100
    ) {
      return NextResponse.json(
        { message: "درصد تخفیف نمی‌تواند بیشتر از 100 باشد" },
        { status: 400 }
      )
    }

    // ✅ جلوگیری از کد تکراری
    if (sanitizedData.code) {

      const duplicate = await Discountmodel.findOne({
        code: sanitizedData.code,
        _id: { $ne: id }
      })

      if (duplicate) {
        return NextResponse.json(
          { message: "این کد قبلاً ثبت شده است" },
          { status: 409 }
        )
      }
    }

    const updatedDiscount = await Discountmodel.findByIdAndUpdate(
      id,
      sanitizedData,
      { new: true }
    )

    return NextResponse.json(
      { discount: updatedDiscount },
      { status: 200 }
    )

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { message: "خطای سرور" },
      { status: 500 }
    )
  }
}
