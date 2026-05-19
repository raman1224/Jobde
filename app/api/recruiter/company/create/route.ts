// app/api/recruiter/company/create/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      userId, companyName, companyEmail, panNumber, website, 
      location, address, size, industry, description,
      contactPerson, contactDesignation, contactPhone 
    } = body

    const company = await prisma.company.create({
      data: {
        name: companyName,
        email: companyEmail,
        panNumber,
        website,
        location,
        address,
        size,
        industry,
        description,
        contactPerson,
        contactDesignation,
        contactPhone,
        userId,
        isActive: true,
        isVerified: false,
      },
    })

    // Update user with companyId
    await prisma.user.update({
      where: { id: userId },
      data: { companyId: company.id, role: "RECRUITER" },
    })

    return NextResponse.json({ success: true, company })
  } catch (error) {
    console.error("Company creation error:", error)
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 })
  }
}