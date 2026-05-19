// app/api/jobs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id

    const job = await prisma.job.findFirst({
      where: { id: jobId, isActive: true },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            description: true,
            website: true,
            location: true,
          }
        },
        skills: {
          select: { id: true, name: true }
        },
        applications: {
          take: 5,
          include: {
            candidate: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              }
            }
          }
        },
        _count: {
          select: { applications: true }
        }
      }
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Increment view count
    await prisma.job.update({
      where: { id: jobId },
      data: { views: { increment: 1 } }
    })

    return NextResponse.json(job)
  } catch (error) {
    console.error("Get job error:", error)
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 })
  }
}