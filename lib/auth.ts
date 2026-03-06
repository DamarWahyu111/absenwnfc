import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
)

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

/**
 * Create a JWT token
 */
export async function createToken(payload: JWTPayload): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)

  return token
}

/**
 * Verify a JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload as JWTPayload
  } catch (err) {
    console.error('[v0] Token verification failed:', err)
    return null
  }
}

/**
 * Get token from cookies
 */
export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  return token || null
}

/**
 * Set auth token in cookies
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })
}

/**
 * Clear auth cookie (logout)
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}

/**
 * Get current user from token
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getTokenFromCookies()
  if (!token) return null

  return verifyToken(token)
}

/**
 * Hash password with bcrypt (using Node.js built-in crypto as fallback)
 * For production, use bcryptjs package
 */
export async function hashPassword(password: string): Promise<string> {
  // This is a simplified implementation using native crypto
  // For production use, install 'bcryptjs' and use:
  // import bcrypt from 'bcryptjs'
  // return bcrypt.hash(password, 10)

  const encoder = new TextEncoder()
  const data = encoder.encode(password + process.env.SALT || 'default-salt')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  const hashedPassword = await hashPassword(password)
  return hashedPassword === hash
}
