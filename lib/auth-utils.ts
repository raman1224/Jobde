// lib/auth-utils.ts
import { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/jwt"
import { prisma } from "@/lib/prisma"

export async function getAuthUser(req?: NextRequest) {
  let token: string | undefined

  if (req) {
    // Get from request cookies
    token = req.cookies.get("auth_token")?.value
  } else {
    // Get from server cookies (for Server Components)
    const cookieStore = await cookies()
    token = cookieStore.get("auth_token")?.value
  }

  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      isActive: true,
    },
  })

  if (!user || !user.isActive) return null

  return user
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
            isActive: true,

    },
  })
  if (!user || !user.isActive) return null

  return user
}