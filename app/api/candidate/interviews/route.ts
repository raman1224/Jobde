// app/api/candidate/interviews/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const interviews = await prisma.interview.findMany({
      where: {
        application: {
          candidateId: user.id
        }
      },
      include: {
        application: {
          include: {
            job: {
              include: {
                company: true
              }
            }
          }
        }
      },
      orderBy: { scheduledFor: "asc" },
    })

    const formattedInterviews = interviews.map(i => ({
      id: i.id,
      applicationId: i.applicationId,
      scheduledFor: i.scheduledFor,
      type: i.type,
      status: i.status,
      job: i.application.job,
      company: i.application.job.company,
    }))

    return NextResponse.json(formattedInterviews)
  } catch (error) {
    console.error("Interviews error:", error)
    return NextResponse.json([], { status: 500 })
  }
}