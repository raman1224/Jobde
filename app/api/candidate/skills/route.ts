// app/api/candidate/skills/route.ts - CREATE
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get candidate profile
    const candidateProfile = await prisma.candidateProfile.findUnique({
      where: { userId: user.id },
      include: { skills: true },
    })

    if (!candidateProfile) {
      return NextResponse.json([])
    }

    return NextResponse.json(candidateProfile.skills)
  } catch (error) {
    console.error("GET skills error:", error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name } = await req.json()
    
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Skill name is required" }, { status: 400 })
    }

    // Get or create candidate profile
    let candidateProfile = await prisma.candidateProfile.findUnique({
      where: { userId: user.id },
    })

    if (!candidateProfile) {
      candidateProfile = await prisma.candidateProfile.create({
        data: { userId: user.id },
      })
    }

    // Get or create skill
    let skill = await prisma.skill.findUnique({
      where: { name: name.trim() },
    })

    if (!skill) {
      skill = await prisma.skill.create({
        data: { name: name.trim() },
      })
    }

    // Connect skill to candidate
    await prisma.candidateProfile.update({
      where: { id: candidateProfile.id },
      data: {
        skills: {
          connect: { id: skill.id },
        },
      },
    })

    return NextResponse.json(skill, { status: 201 })
  } catch (error) {
    console.error("POST skill error:", error)
    return NextResponse.json({ error: "Failed to add skill" }, { status: 500 })
  }
}