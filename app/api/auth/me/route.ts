// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuthCookieFromRequest } from '@/lib/cookies'
import { verifyToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const token = getAuthCookieFromRequest(req)
    
    if (!token) {
      return NextResponse.json({ user: null })
    }
    
    const payload = verifyToken(token)
    
    if (!payload) {
      return NextResponse.json({ user: null })
    }
    
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        profile: true,
      },
    })
    
    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ user: null })
  }
}