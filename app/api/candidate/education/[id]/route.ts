// app/api/candidate/education/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    
    const education = await prisma.education.update({
      where: { id: params.id },
      data: {
        degree: body.degree,
        institution: body.institution,
        field: body.field,
        startDate: new Date(body.startDate),
        endDate: body.current ? null : new Date(body.endDate),
        current: body.current,
      }
    })

    return NextResponse.json(education)
  } catch (error) {
    console.error("PUT education error:", error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await prisma.education.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Deleted" })
  } catch (error) {
    console.error("DELETE education error:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}