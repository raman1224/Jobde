// app/api/candidate/education/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const candidateProfile = await prisma.candidateProfile.findUnique({
      where: { userId: user.id },
      include: { education: true }
    })

    if (!candidateProfile) return NextResponse.json([])
    return NextResponse.json(candidateProfile.education)
  } catch (error) {
    console.error("GET education error:", error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    
    let candidateProfile = await prisma.candidateProfile.findUnique({
      where: { userId: user.id }
    })

    if (!candidateProfile) {
      candidateProfile = await prisma.candidateProfile.create({
        data: { userId: user.id }
      })
    }

    const education = await prisma.education.create({
      data: {
        candidateId: candidateProfile.id,
        degree: body.degree,
        institution: body.institution,
        field: body.field,
        startDate: new Date(body.startDate),
        endDate: body.current ? null : new Date(body.endDate),
        current: body.current,
      }
    })

    return NextResponse.json(education, { status: 201 })
  } catch (error) {
    console.error("POST education error:", error)
    return NextResponse.json({ error: "Failed to add education" }, { status: 500 })
  }
}