// lib/cookies.ts
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'auth_token'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
  return response
}

export function getAuthCookie(): string | undefined {
  const cookieStore = cookies()
  return cookieStore.get(COOKIE_NAME)?.value
}

export function getAuthCookieFromRequest(req: NextRequest): string | undefined {
  return req.cookies.get(COOKIE_NAME)?.value
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.delete(COOKIE_NAME)
  return response
}