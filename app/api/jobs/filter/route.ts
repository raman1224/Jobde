



// app/api/jobs/filter/route.ts - COMPLETE FIXED VERSION
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const type = searchParams.get("type")
    const value = searchParams.get("value")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const skip = (page - 1) * limit

    let whereClause: any = { isActive: true }

    // Build filter based on type
    if (type === "company") {
      whereClause.company = {
        name: { contains: value, mode: "insensitive" }
      }
    } else if (type === "industry") {
      whereClause.skills = {
        some: { name: { contains: value, mode: "insensitive" } }
      }
    } else if (type === "location") {
      whereClause.location = { contains: value, mode: "insensitive" }
    } else if (type === "jobType") {
      whereClause.employmentType = value as any
    } else if (type === "experience") {
      whereClause.experienceLevel = value as any
    }

    // Get total count
    const total = await prisma.job.count({ where: whereClause })

    // Get filtered jobs
    const jobs = await prisma.job.findMany({
      where: whereClause,
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
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    })

    // Get related categories using raw queries instead of groupBy
    const topCompaniesRaw = await prisma.$queryRaw<any[]>`
      SELECT c.name, COUNT(j.id) as count
      FROM "Job" j
      JOIN "Company" c ON j."companyId" = c.id
      WHERE j."isActive" = true
      GROUP BY c.id, c.name
      ORDER BY count DESC
      LIMIT 5
    `

    const topLocationsRaw = await prisma.$queryRaw<any[]>`
      SELECT location, COUNT(*) as count
      FROM "Job"
      WHERE "isActive" = true
      GROUP BY location
      ORDER BY count DESC
      LIMIT 5
    `

    const topIndustriesRaw = await prisma.$queryRaw<any[]>`
      SELECT s.name, COUNT(sj."jobId") as count
      FROM "Skill" s
      JOIN "_JobSkills" sj ON s.id = sj."B"
      JOIN "Job" j ON sj."A" = j.id
      WHERE j."isActive" = true
      GROUP BY s.id, s.name
      ORDER BY count DESC
      LIMIT 5
    `

    return NextResponse.json({
      success: true,
      jobs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasMore: skip + jobs.length < total,
      },
      relatedCategories: {
        companies: topCompaniesRaw.map(c => ({ name: c.name, count: Number(c.count) })),
        industries: topIndustriesRaw.map(i => ({ name: i.name, count: Number(i.count) })),
        locations: topLocationsRaw.map(l => ({ name: l.location, count: Number(l.count) })),
      },
    })
  } catch (error) {
    console.error("Filter error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to filter jobs" },
      { status: 500 }
    )
  }
}