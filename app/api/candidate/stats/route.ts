// app/api/candidate/stats/route.ts - FIXED
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [applications, savedJobs, interviews] = await Promise.all([
      prisma.application.count({
        where: { candidateId: user.id },
      }),
      prisma.savedJob.count({
        where: { userId: user.id },
      }),
      prisma.interview.count({
        where: {
          application: {
            candidateId: user.id,
          },
          status: "SCHEDULED",
        },
      }),
    ])

    return NextResponse.json({
      applications,
      savedJobs,
      interviews,
      profileViews: 0,
    })
  } catch (error) {
    console.error("Get candidate stats error:", error)
    return NextResponse.json({ 
      applications: 0, 
      savedJobs: 0, 
      interviews: 0, 
      profileViews: 0 
    }, { status: 500 })
  }
}