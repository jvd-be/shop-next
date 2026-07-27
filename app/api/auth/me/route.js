import { verifyToken } from '@/components/utils/authServer'
import Usermodel from '@/model/Usermodel'
import { NextResponse } from 'next/server'

export async function GET (req) {
  try {
    const accessToken = req.cookies.get('accessToken')?.value

    if (!accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyToken(accessToken, 'access')

    if (!payload) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await ConnectToDB()
    const user = await Usermodel.findById(payload.userId).select(
      '_id name email role isActive isBanned createdAt'
    )

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }
    if (!user.isActive || user.isBanned) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error('GET /api/auth/me error:', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
