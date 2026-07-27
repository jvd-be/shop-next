import { NextResponse } from "next/server"
import ConnectToDB from "@/app/lib/mongodb"
import Socialmodel from "@/model/Socialmodel"

export async function PUT(req) {
  try {
    await ConnectToDB()

    const body = await req.json()
    console.log("BODY:", body)

    const { data } = body

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { message: "data باید آرایه باشد" },
        { status: 400 }
      )
    }

    const updated = await Socialmodel.findOneAndUpdate(
      {},
      { items: data },
      { new: true }
    )

    return NextResponse.json({
      success: true,
      data: updated
    })

  } catch (error) {

    console.error("SOCIAL UPDATE ERROR:", error)

    return NextResponse.json(
      {
        message: "خطای سرور",
        error: error.message
      },
      { status: 500 }
    )
  }
}
