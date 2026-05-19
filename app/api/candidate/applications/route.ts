// app/api/candidate/applications/route.ts - COMPLETE FIXED
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const applications = await prisma.application.findMany({
      where: { candidateId: user.id },
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
            skills: true,
          }
        },
        interview: true,
      },
      orderBy: { appliedAt: "desc" },
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error("GET applications error:", error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({ error: "Please login to apply" }, { status: 401 })
    }

    const body = await req.json()
    const { jobId } = body

    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 })
    }

    // Check if already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_candidateId: {
          jobId: jobId,
          candidateId: user.id,
        }
      }
    })

    if (existingApplication) {
      return NextResponse.json({ error: "You have already applied for this job" }, { status: 400 })
    }

    // Get job details with company
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { 
        skills: true,
        company: {
          include: {
            users: true  // ✅ Get users associated with company
          }
        }
      }
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Get candidate skills for match score
    const candidateProfile = await prisma.candidateProfile.findUnique({
      where: { userId: user.id },
      include: { skills: true }
    })

    // Calculate match score
    let matchScore = 0
    if (candidateProfile && job.skills.length > 0) {
      const candidateSkills = candidateProfile.skills.map(s => s.name.toLowerCase())
      const jobSkills = job.skills.map(s => s.name.toLowerCase())
      const matchedSkills = candidateSkills.filter(s => jobSkills.includes(s))
      matchScore = Math.round((matchedSkills.length / jobSkills.length) * 100)
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        jobId: jobId,
        candidateId: user.id,
        status: "APPLIED",
        matchScore: matchScore,
        appliedAt: new Date(),
      },
      include: {
        job: {
          include: {
            company: true
          }
        }
      }
    })

    // ✅ FIXED: Send notification to recruiter (get first user from company)
    if (job.company && job.company.users && job.company.users.length > 0) {
      const recruiterId = job.company.users[0].id
      
      await prisma.notification.create({
        data: {
          userId: recruiterId,
          type: "APPLICATION_UPDATE",
          title: "New Application Received",
          message: `${user.name} applied for ${job.title} at ${job.company.name}`,
          read: false,
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: "Application submitted successfully",
      application 
    }, { status: 201 })
    
  } catch (error) {
    console.error("POST application error:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}