// app/api/notifications/[id]/route.ts - DELETE NOTIFICATION
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.notification.delete({
      where: { id: params.id, userId: user.id },
    })

    return NextResponse.json({ message: "Notification deleted" })
  } catch (error) {
    console.error("Delete notification error:", error)
    return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 })
  }
}