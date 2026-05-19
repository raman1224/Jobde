// app/api/notifications/send/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId, type, title, message } = await req.json()

    // Create notification for recruiter
    await prisma.notification.create({
      data: {
        userId: userId,
        type: type,
        title: title,
        message: message,
        read: false,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Send notification error:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}