// app/api/candidate/experience/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    
    const experience = await prisma.experience.update({
      where: { id: params.id },
      data: {
        title: body.title,
        company: body.company,
        location: body.location,
        startDate: new Date(body.startDate),
        endDate: body.current ? null : new Date(body.endDate),
        current: body.current,
        description: body.description,
      }
    })

    return NextResponse.json(experience)
  } catch (error) {
    console.error("PUT experience error:", error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await prisma.experience.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Deleted" })
  } catch (error) {
    console.error("DELETE experience error:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}