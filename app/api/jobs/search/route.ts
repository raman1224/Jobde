// app/api/jobs/search/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const { title, location, category } = await req.json()

  const jobs = await prisma.job.findMany({
    where: {
      isActive: true,
      ...(title && {
        OR: [
          { title: { contains: title, mode: "insensitive" } },
          { company: { name: { contains: title, mode: "insensitive" } } },
        ],
      }),
      ...(location && { location: { contains: location, mode: "insensitive" } }),
      ...(category && { skills: { some: { name: { contains: category, mode: "insensitive" } } } }),
    },
    include: { company: true, skills: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return NextResponse.json(jobs)
}