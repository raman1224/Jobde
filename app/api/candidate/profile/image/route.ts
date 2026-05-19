// app/api/candidate/profile/image/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import cloudinary from "@/lib/cloudinary"

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("image") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "jobportal/profiles",
          transformation: [{ width: 200, height: 200, crop: "fill" }],
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    // Update user profile image
    await prisma.user.update({
      where: { id: user.id },
      data: { image: (result as any).secure_url },
    })

    return NextResponse.json({ url: (result as any).secure_url })
  } catch (error) {
    console.error("Image upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}