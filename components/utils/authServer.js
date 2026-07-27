import { hash, compare } from 'bcryptjs'
import { SignJWT } from 'jose'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

export async function hashPassword (password) {
  if (!password) throw new Error('پسورد نمی‌تواند خالی باشد')
  const hashedPassword = await hash(password, 12)
  return hashedPassword
}
export async function verifyPassword (password, hashedPassword) {
  if (!password || !hashedPassword) return false
  const verifyedPassword = await compare(password, hashedPassword)
  return verifyedPassword
}

const getSecretKey = type => {
  const secret =
    type === 'access'
      ? process.env.SECRET_KEY_ACCSESS_TOKEN
      : process.env.SECRET_KEY_REFRESH_TOKEN
  return new TextEncoder().encode(secret)
}

export async function verifyToken (token, type = 'access') {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(type))
    return payload
  } catch (err) {
    return null
  }
}

export async function generateToken (payload, type = 'access') {
  const secretKey = getSecretKey(type)

  const exp = type === 'access' ? '1h' : '7d'

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(secretKey)
}

export async function getAuthFromCookies () {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  if (!accessToken) return { isLoggedIn: false, user: null }

  const payload = await verifyToken(accessToken, 'access')


  if (!payload) return { isLoggedIn: false, user: null }

  return {
    isLoggedIn: true,
    user: {
      userId: payload.userId,
      role: payload.role,
      name: payload?.name || "",
      phone: payload.phone
    }
  }
}
