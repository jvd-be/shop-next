import { NextResponse } from 'next/server'
import { verifyToken, generateToken } from './components/utils/authServer'

export async function middleware (req) {
  const { pathname } = req.nextUrl
  const accessToken = req.cookies.get('accessToken')?.value
  const refreshToken = req.cookies.get('refreshToken')?.value

  let isAuthenticated = false
  let payload = null

  // ۱. تلاش برای احراز هویت با Access Token
  if (accessToken) {
    try {
      payload = await verifyToken(accessToken, 'access')
      isAuthenticated = true
    } catch (e) {
      // Access Token منقضی شده است
    }
  }

  // ۲. رفرش کردن توکن
  if (!isAuthenticated && refreshToken) {
    try {
      // اطلاعات کاربر رو از خودِ رفرش توکن بگیر (نه از متغیر user که وجود نداره!)
      const refreshPayload = await verifyToken(refreshToken, 'refresh')

      const newAccessToken = await generateToken(
        {
          userId: refreshPayload.userId,
          role: refreshPayload.role,
          name: refreshPayload.name || '',
          phone: refreshPayload.phone
        },
        'access'
      )

      const response = NextResponse.next()
      response.cookies.set('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60
      })

      // حالا که رفرش انجام شد، برای چک کردن ادمین در مرحله ۳، payload رو آپدیت کن
      payload = {
        userId: refreshPayload.userId,
        role: refreshPayload.role,
        name: refreshPayload.name,
        phone: refreshPayload.phone
      }
      isAuthenticated = true

      return response
    } catch (e) {
      // Refresh Token هم معتبر نیست
    }
  }

  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated || payload?.role !== 'ADMIN' && payload?.role !=="SUPER_ADMIN") {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
