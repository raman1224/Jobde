// app/api/candidate/saved-jobs/route.ts - COMPLETE FIXED VERSION
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const savedJobs = await prisma.savedJob.findMany({
      where: { userId: user.id },
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true,
              }
            },
            skills: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      },
      orderBy: { savedAt: "desc" },
    })

    return NextResponse.json(savedJobs)
  } catch (error) {
    console.error("GET saved jobs error:", error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { jobId } = await req.json()

    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 })
    }

    // Check if already saved
    const existing = await prisma.savedJob.findFirst({
      where: {
        userId: user.id,
        jobId: jobId,
      },
    })

    if (existing) {
      return NextResponse.json({ error: "Job already saved" }, { status: 400 })
    }

    const saved = await prisma.savedJob.create({
      data: {
        userId: user.id,
        jobId: jobId,
      },
      include: {
        job: {
          include: {
            company: true,
          }
        }
      }
    })

    return NextResponse.json(saved, { status: 201 })
  } catch (error) {
    console.error("POST saved job error:", error)
    return NextResponse.json({ error: "Failed to save job" }, { status: 500 })
  }
}