// app/api/candidate/saved-jobs/[jobId]/route.ts - FIXED
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.savedJob.deleteMany({
      where: {
        userId: user.id,
        jobId: params.jobId,
      },
    })

    return NextResponse.json({ message: "Job removed from saved" })
  } catch (error) {
    console.error("Delete saved job error:", error)
    return NextResponse.json({ error: "Failed to remove job" }, { status: 500 })
  }
}