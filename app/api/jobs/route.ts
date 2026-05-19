


// app/api/jobs/route.ts - FIXED
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const skip = (page - 1) * limit

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: { isActive: true },
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
      }),
      prisma.job.count({ where: { isActive: true } })
    ])

    return NextResponse.json({
      jobs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasMore: skip + jobs.length < total,
      }
    })
  } catch (error) {
    console.error("Jobs fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}