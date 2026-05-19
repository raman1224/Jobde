// app/api/recruiter/jobs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(req)
    
    if (!user || user.role !== "RECRUITER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const jobId = params.id

    // Find job and verify ownership
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        company: {
          users: { some: { id: user.id } }
        }
      }
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Delete job
    await prisma.job.delete({
      where: { id: jobId }
    })

    // Clear cache
    try {
      const { clearJobCache } = await import("@/lib/redis")
      await clearJobCache()
    } catch (e) {}

    return NextResponse.json({ success: true, message: "Job deleted successfully" })
  } catch (error) {
    console.error("Delete job error:", error)
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(req)
    
    if (!user || user.role !== "RECRUITER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { status } = body
    const jobId = params.id

    // Find job and verify ownership
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        company: {
          users: { some: { id: user.id } }
        }
      }
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Update job status
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: { isActive: status === "ACTIVE" }
    })

    return NextResponse.json({ 
      success: true, 
      message: `Job ${status === "ACTIVE" ? "activated" : "deactivated"}`,
      job: updatedJob
    })
  } catch (error) {
    console.error("Update job error:", error)
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
  }
}

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
          include: {
            candidate: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              }
            }
          },
          take: 10
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