// components/home/job-listings.tsx
"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Briefcase, MapPin, Clock, Building2, Eye, Lock, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface Job {
  id: string
  title: string
  company: { name: string; logo?: string }
  location: string
  salaryMin: number
  salaryMax: number
  employmentType: string
  skills: { name: string }[]
  createdAt: Date
}

interface JobListingsProps {
  jobs: Job[]
  isLoading: boolean
  title?: string
  subtitle?: string
}

function JobCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 animate-pulse">
      <div className="flex gap-4">
        <div className="h-12 w-12 rounded-lg bg-slate-200 dark:bg-slate-700" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}

export function JobListings({ jobs, isLoading, title = "Featured Jobs", subtitle = "Discover your next career opportunity" }: JobListingsProps) {
  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">{title}</h2>
            <p className="text-slate-500 mt-2">{subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <JobCardSkeleton key={i} />)}
          </div>
        </div>
      </section>
    )
  }

  if (jobs.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <Briefcase className="h-16 w-16 mx-auto mb-4 text-slate-400" />
          <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
          <p className="text-slate-500">Try adjusting your search criteria</p>
        </div>
      </section>
    )
  }
//   if (jobs.length === 0) {
//   <div className="text-center py-16">
//     <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
//       <Search className="h-10 w-10 text-slate-400" />
//     </div>
//     <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
//     <p className="text-slate-500 max-w-md mx-auto">
//       We couldn't find any jobs matching "{searchQuery}" in "{locationFilter}". 
//       Try adjusting your search or browse all jobs.
//     </p>
//     <Button onClick={clearFilters} className="mt-4 gap-2">
//       <X className="h-4 w-4" />
//       Clear Search
//     </Button>
//   </div>
// }
  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-slate-500 dark:text-slate-400">{subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex gap-4 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500/10 to-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg mb-1 truncate group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm text-slate-500 truncate">{job.company.name}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <DollarSign className="h-4 w-4" />
                    <span>${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="h-4 w-4" />
                    <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {job.employmentType}
                  </Badge>
                  {job.skills.slice(0, 2).map((skill) => (
                    <Badge key={skill.name} variant="outline" className="text-xs">
                      {skill.name}
                    </Badge>
                  ))}
                  {job.skills.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{job.skills.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-3">
                  <Link href={`/jobs/${job.id}`} className="flex-1">
                    <Button variant="outline" className="w-full gap-2">
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </Link>
                  <Button className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
                    Apply Now
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/jobs">
            <Button variant="outline" size="lg" className="gap-2">
              Browse All Jobs
              <Briefcase className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}