// app/api/candidate/resume/route.ts - GET and DELETE
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import { unlink } from "fs/promises"
import path from "path"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get candidate profile
    const candidateProfile = await prisma.candidateProfile.findUnique({
      where: { userId: user.id },
      select: {
        resumeUrl: true,
        resumeName: true,
      }
    })

    return NextResponse.json({ 
      url: candidateProfile?.resumeUrl || "",
      name: candidateProfile?.resumeName || ""
    })
  } catch (error) {
    console.error("GET resume error:", error)
    return NextResponse.json({ url: "", name: "" })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get candidate profile
    const candidateProfile = await prisma.candidateProfile.findUnique({
      where: { userId: user.id },
    })

    if (candidateProfile?.resumeUrl && candidateProfile.resumeUrl.startsWith("/uploads/")) {
      // Delete local file
      const filepath = path.join(process.cwd(), "public", candidateProfile.resumeUrl)
      try {
        await unlink(filepath)
      } catch (unlinkError) {
        console.error("File deletion error:", unlinkError)
      }
    }

    // Update database - remove resume
    await prisma.candidateProfile.update({
      where: { userId: user.id },
      data: { 
        resumeUrl: null,
        resumeName: null,
      },
    })

    return NextResponse.json({ message: "Resume deleted" })
  } catch (error) {
    console.error("DELETE resume error:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}