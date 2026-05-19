// app/api/candidate/messages/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const messages = await prisma.message.findMany({
      where: { receiverId: user.id },
      include: {
        sender: {
          select: { id: true, name: true, image: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Messages error:", error)
    return NextResponse.json([], { status: 500 })
  }
}