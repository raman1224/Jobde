// lib/redis.ts - FIXED
import { Redis } from "@upstash/redis"
import { prisma } from "@/lib/prisma"
// impoer {redis} from ''
const redis = Redis.fromEnv()

const CACHE_TTL = 60 * 5 // 5 minutes
const CATEGORY_CACHE_TTL = 60 * 60 // 1 hour

export async function getCachedJobs() {
  try {
    const cached = await redis.get("featured-jobs")
    if (cached) return cached as any[]
    
    const jobs = await prisma.job.findMany({
      where: { isActive: true, isFeatured: true },
      include: { company: true, skills: true },
      orderBy: { createdAt: "desc" },
      take: 12,
    })
    
    await redis.setex("featured-jobs", CACHE_TTL, jobs)
    return jobs
  } catch (error) {
    console.error("Redis error:", error)
    return null
  }
}

export async function getCachedCategories() {
  try {
    const cached = await redis.get("job-categories")
    if (cached) return cached as any
    
    // Get top companies by job count - FIXED ORDER BY
    const companies = await prisma.job.groupBy({
      by: ["companyId"],
      where: { isActive: true },
      _count: { companyId: true },
      orderBy: {
        _count: {
          companyId: "desc"
        }
      },
      take: 8,
    })

    const companyIds = companies.map(c => c.companyId).filter(Boolean)
    const companiesData = await prisma.company.findMany({
      where: { id: { in: companyIds as string[] } },
      select: { id: true, name: true, logo: true },
    })

    const enrichedCompanies = companies.map(tc => ({
      name: companiesData.find(c => c.id === tc.companyId)?.name || "Unknown",
      count: tc._count.companyId,
      logo: companiesData.find(c => c.id === tc.companyId)?.logo,
    }))

    // Get top industries by employment type - FIXED ORDER BY
    const industriesRaw = await prisma.$queryRaw<any[]>`
      SELECT "employmentType", COUNT(*) as count
      FROM "Job"
      WHERE "isActive" = true
      GROUP BY "employmentType"
      ORDER BY count DESC
      LIMIT 6
    `

    const industries = industriesRaw.map(i => ({
      name: i.employmentType,
      count: Number(i.count)
    }))

    // Get top locations - FIXED ORDER BY
    const locationsRaw = await prisma.$queryRaw<any[]>`
      SELECT location, COUNT(*) as count
      FROM "Job"
      WHERE "isActive" = true
      GROUP BY location
      ORDER BY count DESC
      LIMIT 6
    `

    const locations = locationsRaw.map(l => ({
      name: l.location,
      count: Number(l.count)
    }))

    // Get hot categories (trending skills)
    const hotCategories = await prisma.skill.findMany({
      where: {
        jobs: { some: { isActive: true } }
      },
      include: {
        _count: { select: { jobs: true } }
      },
      orderBy: {
        jobs: {
          _count: "desc"
        }
      },
      take: 6,
    })

    const categories = {
      companies: enrichedCompanies,
      industries: industries,
      locations: locations,
      hot: hotCategories.map(h => ({ name: h.name, count: h._count.jobs })),
    }
    
    await redis.setex("job-categories", CATEGORY_CACHE_TTL, categories)
    return categories
  } catch (error) {
    console.error("Redis category error:", error)
    return {
      companies: [],
      industries: [],
      locations: [],
      hot: []
    }
  }
}

export async function clearJobCache() {
  await redis.del("featured-jobs")
  await redis.del("job-categories")
}

export async function cacheJobSearch(query: string, results: any[]) {
  const key = `search:${query}`
  await redis.setex(key, 60, results)
}

export async function getCachedJobSearch(query: string) {
  const key = `search:${query}`
  return await redis.get(key)
}