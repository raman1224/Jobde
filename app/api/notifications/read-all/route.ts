// app/api/notifications/read-all/route.ts - FIXED
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.notification.updateMany({
      where: { userId: user.id, read: false },
      data: { read: true },
    })

    return NextResponse.json({ message: "All notifications marked as read" })
  } catch (error) {
    console.error("Mark all notifications read error:", error)
    return NextResponse.json({ error: "Failed to mark all as read" }, { status: 500 })
  }
}