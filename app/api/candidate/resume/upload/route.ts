// app/api/candidate/resume/upload/route.ts - COMPLETE WORKING
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("resume") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "uploads", "resumes")
    await mkdir(uploadDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${user.id}_${timestamp}.pdf`
    const filepath = path.join(uploadDir, filename)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Public URL
    const publicUrl = `/uploads/resumes/${filename}`

    // Get or create candidate profile
    let candidateProfile = await prisma.candidateProfile.findUnique({
      where: { userId: user.id },
    })

    if (!candidateProfile) {
      candidateProfile = await prisma.candidateProfile.create({
        data: { 
          userId: user.id,
          resumeUrl: publicUrl,
          resumeName: file.name,
        },
      })
    } else {
      // Update existing profile
      candidateProfile = await prisma.candidateProfile.update({
        where: { userId: user.id },
        data: {
          resumeUrl: publicUrl,
          resumeName: file.name,
        },
      })
    }

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      name: file.name,
      message: "Resume uploaded successfully" 
    })
  } catch (error) {
    console.error("Resume upload error:", error)
    return NextResponse.json({ error: "Upload failed: " + (error as Error).message }, { status: 500 })
  }
}