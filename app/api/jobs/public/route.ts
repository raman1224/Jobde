// app/api/jobs/public/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      where: { 
        isActive: true,
        applicationDeadline: { gt: new Date() }
      },
      include: { 
        company: {
          select: { id: true, name: true, logo: true }
        }, 
        skills: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Public jobs error:", error)
    return NextResponse.json([], { status: 500 })
  }
}