import { NextResponse } from "next/server"
import ConnectToDB from "@/app/lib/mongodb"
import Socialmodel from "@/model/Socialmodel"
import { getAuthFromCookies } from "@/components/utils/authServer"

export async function PUT(req) {
  try {
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
    const body = await req.json()


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
