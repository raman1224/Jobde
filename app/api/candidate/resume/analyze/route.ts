// app/api/candidate/resume/analyze/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { resumeUrl } = await req.json()

    if (!resumeUrl) {
      return NextResponse.json({ error: "Resume URL required" }, { status: 400 })
    }

    // TODO: Implement actual PDF parsing and skill extraction
    // This is a mock response for now
    const mockSkills = ["JavaScript", "TypeScript", "React", "Node.js", "Tailwind CSS"]
    const mockExperience = 3
    const mockEducation = ["Bachelor's in Computer Science"]

    // Update candidate with extracted skills
    await prisma.candidateProfile.update({
      where: { userId: user.id },
      data: {
        resumeAnalyzed: true,
      },
    })

    // Connect skills (create if not exist)
    for (const skillName of mockSkills) {
      const skill = await prisma.skill.upsert({
        where: { name: skillName },
        create: { name: skillName },
        update: {},
      })

      await prisma.candidateProfile.update({
        where: { userId: user.id },
        data: {
          skills: {
            connect: { id: skill.id },
          },
        },
      })
    }

    return NextResponse.json({
      skills: mockSkills,
      experience: mockExperience,
      education: mockEducation,
      matchScore: 85,
    })
  } catch (error) {
    console.error("Resume analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}