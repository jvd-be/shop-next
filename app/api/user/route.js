import ConnectToDB from '@/app/lib/mongodb'
import Usermodel from '@/model/Usermodel'
import { NextResponse } from 'next/server'

export async function GET(req) {
  try {
    await ConnectToDB()

    const users = await Usermodel.find({}).select('-password')
    console.log(users);
    
    return NextResponse.json(
      { message: 'دریافت همه کاربران', users },
      { status: 200 }
    )

  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    )
  }
}
