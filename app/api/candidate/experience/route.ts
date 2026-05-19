// app/api/candidate/experience/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const candidateProfile = await prisma.candidateProfile.findUnique({
      where: { userId: user.id },
      include: { experience: true }
    })

    if (!candidateProfile) return NextResponse.json([])
    return NextResponse.json(candidateProfile.experience)
  } catch (error) {
    console.error("GET experience error:", error)
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

    const experience = await prisma.experience.create({
      data: {
        candidateId: candidateProfile.id,
        title: body.title,
        company: body.company,
        location: body.location,
        startDate: new Date(body.startDate),
        endDate: body.current ? null : new Date(body.endDate),
        current: body.current,
        description: body.description,
      }
    })

    return NextResponse.json(experience, { status: 201 })
  } catch (error) {
    console.error("POST experience error:", error)
    return NextResponse.json({ error: "Failed to add experience" }, { status: 500 })
  }
}