// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getAuthCookieFromRequest } from "@/lib/cookies"
import { verifyToken } from "@/lib/jwt"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public routes
  const publicRoutes = ['/', '/auth/signin', '/auth/signup', '/api/auth/login', '/api/auth/signup']
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }
  
  // Check for auth token
  const token = getAuthCookieFromRequest(request)
  
  if (!token) {
    const url = new URL('/auth/signin', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }
  
  const payload = verifyToken(token)
  
  if (!payload) {
    const response = NextResponse.redirect(new URL('/auth/signin', request.url))
    response.cookies.delete('auth_token')
    return response
  }
  
  // Role-based routing
  if (pathname.startsWith('/recruiter') && payload.role !== 'RECRUITER') {
    return NextResponse.redirect(new URL('/dashboard/candidate', request.url))
  }
  
  if (pathname.startsWith('/dashboard/candidate') && payload.role === 'RECRUITER') {
    return NextResponse.redirect(new URL('/recruiter/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}