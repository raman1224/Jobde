// app/api/candidate/profile/route.ts - FIXED
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Make fields optional to avoid validation errors
const profileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  website: z.string().url().optional().nullable().or(z.literal("")),
  linkedin: z.string().url().optional().nullable().or(z.literal("")),
  github: z.string().url().optional().nullable().or(z.literal("")),
})

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    })

    return NextResponse.json({
      name: user.name,
      email: user.email,
      phone: profile?.phone || "",
      location: profile?.location || "",
      bio: profile?.bio || "",
      website: profile?.website || "",
      linkedin: profile?.linkedin || "",
      github: profile?.github || "",
    })
  } catch (error) {
    console.error("GET profile error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    
    // Validate but don't require URLs
    const validated = profileSchema.parse(body)

    // Update user name
    if (validated.name) {
      await prisma.user.update({
        where: { id: user.id },
        data: { name: validated.name },
      })
    }

    // Update or create profile
    await prisma.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        phone: validated.phone || null,
        location: validated.location || null,
        bio: validated.bio || null,
        website: validated.website || null,
        linkedin: validated.linkedin || null,
        github: validated.github || null,
      },
      update: {
        phone: validated.phone || null,
        location: validated.location || null,
        bio: validated.bio || null,
        website: validated.website || null,
        linkedin: validated.linkedin || null,
        github: validated.github || null,
      },
    })

    return NextResponse.json({ message: "Profile updated" })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}