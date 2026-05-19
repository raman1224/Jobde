// app/api/recruiter/notifications/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user || user.role !== "RECRUITER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get company ID for this recruiter
    const company = await prisma.company.findFirst({
      where: { users: { some: { id: user.id } } }
    })

    if (!company) {
      return NextResponse.json([])
    }

    // Get notifications for applications to this company's jobs
    const notifications = await prisma.notification.findMany({
      where: { userId: company.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Get notifications error:", error)
    return NextResponse.json([], { status: 500 })
  }
}