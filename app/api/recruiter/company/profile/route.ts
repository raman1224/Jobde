
// app/api/recruiter/company/profile/route.ts - FINAL WORKING VERSION
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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
          isVerified: false,
          isActive: true,
          users: {
            connect: { id: user.id }
          }
        },
      })
    }

    // Return only fields that exist
    return NextResponse.json({
      id: company.id,
      name: company.name,
      logo: company.logo,
      website: company.website,
      location: company.headquarters,
      size: company.size,
      industry: company.industry,
      description: company.description,
      foundedYear: company.foundedYear,
      isVerified: company.isVerified,
    })
  } catch (error) {
    console.error("GET company profile error:", error)
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
    const {
      name,
      website,
      location,
      size,
      industry,
      description,
      foundedYear,
    } = body

    let company = await prisma.company.findFirst({
      where: {
        users: {
          some: { id: user.id }
        }
      }
    })

    // Only update fields that exist in database
    const updateData: any = {
      name: name !== undefined ? name : company?.name,
      website: website !== undefined ? website : company?.website,
      headquarters: location !== undefined ? location : (company as any)?.headquarters,
      size: size !== undefined ? size : company?.size,
      industry: industry !== undefined ? industry : company?.industry,
      description: description !== undefined ? description : company?.description,
      foundedYear: foundedYear !== undefined ? parseInt(foundedYear.toString()) : company?.foundedYear,
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    )

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: name || `${user.name}'s Company`,
          isVerified: false,
          isActive: true,
          users: {
            connect: { id: user.id }
          },
          ...updateData,
        },
      })
    } else {
      company = await prisma.company.update({
        where: { id: company.id },
        data: updateData,
      })
    }

    return NextResponse.json({
      id: company.id,
      name: company.name,
      logo: company.logo,
      website: company.website,
      location: (company as any).headquarters,
      size: company.size,
      industry: company.industry,
      description: company.description,
      foundedYear: company.foundedYear,
      isVerified: company.isVerified,
    })
  } catch (error) {
    console.error("PUT company profile error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}