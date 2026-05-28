// app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [
      totalUsers,
      totalRecruiters,
      totalCandidates,
      totalJobs,
      activeJobs,
      totalApplications,
      totalCompanies,
      verifiedCompanies,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "RECRUITER" } }),
      prisma.user.count({ where: { role: "CANDIDATE" } }),
      prisma.job.count(),
      prisma.job.count({ where: { isActive: true } }),
      prisma.application.count(),
      prisma.company.count(),
      prisma.company.count({ where: { isVerified: true } }),
    ])

    return NextResponse.json({
      totalUsers,
      totalRecruiters,
      totalCandidates,
      totalJobs,
      activeJobs,
      totalApplications,
      totalCompanies,
      verifiedCompanies,
      monthlyGrowth: 15,
    })
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}