// app/api/admin/users/[id]/status/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAuthUser(req)
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { isActive } = await req.json()

    await prisma.user.update({
      where: { id: params.id },
      data: { isActive },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin user status error:", error)
    return NextResponse.json({ error: "Failed to update user status" }, { status: 500 })
  }
}