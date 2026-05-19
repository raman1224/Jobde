// app/api/recruiter/jobs/list/route.ts - COMPLETE FIXED VERSION
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find company for this user
    const company = await prisma.company.findFirst({
      where: {
        users: {
          some: { id: user.id }
        }
      }
    })

    if (!company) {
      // Return empty array instead of error
      return NextResponse.json([])
    }

    // Get all jobs for this company
    const jobs = await prisma.job.findMany({
      where: { 
        companyId: company.id,
        isActive: true
      },
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
        },
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: "desc" },
    })

    // Format jobs for frontend
    const formattedJobs = jobs.map(job => ({
      id: job.id,
      title: job.title,
      description: job.description,
      location: job.location,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      employmentType: job.employmentType,
      status: job.isActive ? "ACTIVE" : "INACTIVE",
      applicantsCount: job._count.applications,
      views: job.views,
      createdAt: job.createdAt.toISOString(),
      applicationDeadline: job.applicationDeadline.toISOString(),
      company: job.company,
      skills: job.skills,
    }))

    console.log(`📊 Found ${formattedJobs.length} jobs for company: ${company.name}`)
    
    return NextResponse.json(formattedJobs)
  } catch (error) {
    console.error("Jobs list error:", error)
    // Return empty array on error
    return NextResponse.json([])
  }
}