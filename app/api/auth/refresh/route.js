import { NextResponse } from 'next/server'
import { verifyToken, generateToken } from '@/components/utils/authServer'
import Usermodel from '@/model/Usermodel'
import ConnectToDB from '@/app/lib/mongodb'

export async function POST (req) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value
    
    if (!refreshToken) {
      return NextResponse.json(
        { message: 'Refresh token missing' },
        { status: 401 }
      )
    }
    
    const payload = await verifyToken(refreshToken, 'refresh')
    
    if (!payload)
      return NextResponse.json(
    { message: 'Invalid refresh token' },
    { status: 401 }
  )
  
  await ConnectToDB()
  
  
    const user = await Usermodel.findById(payload.userId)
    if (!user)
      return NextResponse.json({ message: 'User not found' }, { status: 401 })
    const userPayload = {
      userId: user._id.toString(),
      role: user.role,
      name: user.name || '',
      phone: user.phone
    }
    const newAccessToken = await generateToken(userPayload, 'access')
    const response = NextResponse.json(
      { message: 'Token refreshed' },
      { status: 200 }
    )
    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 1
    })
    return response
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
