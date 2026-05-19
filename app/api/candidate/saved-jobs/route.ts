// app/api/candidate/saved-jobs/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const savedJobs = await prisma.savedJob.findMany({
    where: { userId: session.user.id },
    include: {
      job: {
        include: {
          company: true,
        },
      },
    },
    orderBy: { savedAt: "desc" },
  })

  return NextResponse.json(savedJobs)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { jobId } = await req.json()

    const saved = await prisma.savedJob.create({
      data: {
        userId: session.user.id,
        jobId,
      },
    })

    return NextResponse.json(saved, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save job" },
      { status: 500 }
    )
  }
}