// app/api/candidate/stats/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [applications, savedJobs, interviews] = await Promise.all([
    prisma.application.count({
      where: { candidateId: session.user.id },
    }),
    prisma.savedJob.count({
      where: { userId: session.user.id },
    }),
    prisma.interview.count({
      where: {
        application: {
          candidateId: session.user.id,
        },
        status: "SCHEDULED",
      },
    }),
  ])

  return NextResponse.json({
    applications,
    savedJobs,
    interviews,
    profileViews: 0, // Would need additional tracking
  })
}