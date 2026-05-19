// app/api/candidate/skills/[id]/route.ts - DELETE
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

    const candidateProfile = await prisma.candidateProfile.findUnique({
      where: { userId: user.id },
    })

    if (!candidateProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Disconnect skill from candidate
    await prisma.candidateProfile.update({
      where: { id: candidateProfile.id },
      data: {
        skills: {
          disconnect: { id: params.id },
        },
      },
    })

    return NextResponse.json({ message: "Skill removed" })
  } catch (error) {
    console.error("DELETE skill error:", error)
    return NextResponse.json({ error: "Failed to remove skill" }, { status: 500 })
  }
}