// app/api/notifications/[id]/read/route.ts - FIXED
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.notification.update({
      where: { id: params.id, userId: user.id },
      data: { read: true },
    })

    return NextResponse.json({ message: "Marked as read" })
  } catch (error) {
    console.error("Mark notification read error:", error)
    return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 })
  }
}