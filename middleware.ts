import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './lib/auth'

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/admin']

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Verify token
    try {
      const payload = await verifyToken(token)

      if (!payload) {
        // Invalid token, redirect to login
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }

      // Check admin routes
      if (pathname.startsWith('/admin') && payload.role !== 'admin') {
        // Non-admin trying to access admin routes
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (err) {
      console.error('[v0] Middleware token verification error:', err)
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (public auth pages)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
}
