// app/api/recruiter/applications/list/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user || user.role !== "RECRUITER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get company for this recruiter
    const company = await prisma.company.findFirst({
      where: { users: { some: { id: user.id } } }
    })

    if (!company) {
      return NextResponse.json([])
    }

    // Get all applications for jobs of this company
    const applications = await prisma.application.findMany({
      where: {
        job: {
          companyId: company.id
        }
      },
      include: {
        candidate: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            profile: true,
            candidateProfile: {
              include: {
                skills: true,
                experience: true,
                education: true,
              }
            }
          }
        },
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            employmentType: true,
          }
        }
      },
      orderBy: { appliedAt: "desc" },
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error("GET recruiter applications error:", error)
    return NextResponse.json([], { status: 500 })
  }
}