

// app/api/recruiter/jobs/create/route.ts - COMPLETE WORKING VERSION
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    if (user.role !== "RECRUITER") {
      return NextResponse.json({ error: "Only recruiters can post jobs" }, { status: 403 })
    }

    const body = await req.json()
    console.log("📝 Creating job with data:", body)
    
    const {
      title,
      description,
      requirements,
      location,
      locationType,
      employmentType,
      experienceLevel,
      salaryMin,
      salaryMax,
      skills,
      benefits,
      applicationDeadline,
    } = body

    // Validation
    if (!title) return NextResponse.json({ error: "Job title is required" }, { status: 400 })
    if (!description) return NextResponse.json({ error: "Job description is required" }, { status: 400 })
    if (!location) return NextResponse.json({ error: "Location is required" }, { status: 400 })

    // Find company for this user
    const company = await prisma.company.findFirst({
      where: {
        users: {
          some: { id: user.id }
        }
      }
    })

    if (!company) {
      return NextResponse.json({ error: "Company not found. Please set up your company profile first." }, { status: 404 })
    }

    // Create job
    const job = await prisma.job.create({
      data: {
        title,
        description,
        requirements: requirements || "",
        location,
        locationType: locationType || "ONSITE",
        employmentType: employmentType || "FULL_TIME",
        experienceLevel: experienceLevel || "MID",
        salaryMin: salaryMin ? parseInt(salaryMin.toString()) : null,
        salaryMax: salaryMax ? parseInt(salaryMax.toString()) : null,
        benefits: benefits || [],
        applicationDeadline: new Date(applicationDeadline),
        isActive: true,
        companyId: company.id,
        skills: {
          connectOrCreate: (skills || []).map((skillName: string) => ({
            where: { name: skillName },
            create: { name: skillName },
          })),
        },
      },
      include: {
        company: true,
        skills: true,
      },
    })

    console.log(`✅ Job created successfully: ${job.id} - ${job.title}`)

    // Clear Redis cache if using
    try {
      const { clearJobCache } = await import("@/lib/redis")
      await clearJobCache()
    } catch (e) {
      console.log("Redis not configured, skipping cache clear")
    }

    return NextResponse.json({ 
      success: true, 
      message: "Job posted successfully",
      job 
    }, { status: 201 })
    
  } catch (error) {
    console.error("Job creation error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to create job" 
    }, { status: 500 })
  }
}