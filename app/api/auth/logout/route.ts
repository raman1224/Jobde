// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/cookies'

export async function POST() {
  const response = NextResponse.json({ success: true })
  return clearAuthCookie(response)
}