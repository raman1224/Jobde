

// app/page.tsx - SHOW JOBS ON HOMEPAGE
import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { Skeleton } from "@/components/ui/skeleton"
import dynamic from "next/dynamic"

const HomeClient = dynamic(() => import("./home-client"), { ssr: false })
const JobCard = dynamic(() => import("@/components/job-card").then(mod => mod.JobCard), { ssr: false })

function PageSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-4" />
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 rounded-lg" />)}
        </div>
      </div>
    </div>
  )
}

export default async function HomePage() {
  // Get all active jobs for homepage
  const allJobs = await prisma.job.findMany({
    where: { 
      isActive: true,
      applicationDeadline: { gt: new Date() }
    },
    include: { 
      company: {
        select: { id: true, name: true, logo: true }
      }, 
      skills: { take: 3 }
    },
    orderBy: { createdAt: "desc" },
    take: 12,
  })

  console.log(`🏠 Homepage showing ${allJobs.length} jobs`)

  // Get stats
  const [totalJobs, totalCompanies, totalCandidates] = await Promise.all([
    prisma.job.count({ where: { isActive: true } }),
    prisma.company.count(),
    prisma.user.count({ where: { role: "CANDIDATE" } }),
  ])

  const stats = { totalJobs, totalCompanies, totalCandidates }

  return (
    <Suspense fallback={<PageSkeleton />}>
      <HomeClient initialJobs={allJobs} stats={stats} />
    </Suspense>
  )
}