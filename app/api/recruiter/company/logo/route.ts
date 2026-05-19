

// app/api/recruiter/company/logo/route.ts - FIXED
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import cloudinary from "@/lib/cloudinary"

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("logo") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 2MB" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "jobportal/company-logos",
          transformation: [{ width: 200, height: 200, crop: "fill" }],
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    // Find company
    let company = await prisma.company.findFirst({
      where: {
        users: {
          some: { id: user.id }
        }
      }
    })

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: `${user.name}'s Company`,
          email: user.email,
          logo: (result as any).secure_url,
          isVerified: false,
          isActive: true,
          users: {
            connect: { id: user.id }
          }
        },
      })
    } else {
      company = await prisma.company.update({
        where: { id: company.id },
        data: { logo: (result as any).secure_url },
      })
    }

    return NextResponse.json({ 
      success: true, 
      logoUrl: (result as any).secure_url,
      company
    })
  } catch (error) {
    console.error("Logo upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}