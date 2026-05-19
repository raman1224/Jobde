// components/home/job-grid.tsx
"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Briefcase, MapPin, Clock, Building2, Eye, DollarSign, TrendingUp, Bookmark, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import { toast } from "sonner"

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
  isHot?: boolean
  isUrgent?: boolean
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

export function JobGrid({ jobs, isLoading, title }: { jobs: Job[]; isLoading: boolean; title: string }) {
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())

  const handleSaveJob = (jobId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSavedJobs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(jobId)) {
        newSet.delete(jobId)
        toast.success("Job removed from saved")
      } else {
        newSet.add(jobId)
        toast.success("Job saved successfully")
      }
      return newSet
    })
  }

  const handleShare = async (job: Job, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await navigator.clipboard.writeText(`${window.location.origin}/jobs/${job.id}`)
    toast.success("Link copied to clipboard")
  }

  if (isLoading) {
    return (
      <section id="jobs-section" className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <JobCardSkeleton key={i} />)}
          </div>
        </div>
      </section>
    )
  }

  if (jobs.length === 0) {
    return (
      <section id="jobs-section" className="py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <Briefcase className="h-16 w-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="jobs-section" className="py-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-slate-500 dark:text-slate-400">Discover your next career opportunity</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Link href={`/jobs/${job.id}`}>
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer relative">
                    {/* Hot/Urgent Badge */}
                    {job.isHot && (
                      <div className="absolute top-4 right-4">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="px-2 py-1 rounded-full bg-red-500 text-white text-xs font-medium flex items-center gap-1"
                        >
                          <TrendingUp className="h-3 w-3" />
                          Hot
                        </motion.div>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex gap-4 mb-4">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500/10 to-orange-500/10 flex items-center justify-center flex-shrink-0"
                        >
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </motion.div>
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

                      <div className="flex gap-2">
                        <Button className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white">
                          <Eye className="h-4 w-4" />
                          Quick Apply
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => handleSaveJob(job.id, e)}
                          className={savedJobs.has(job.id) ? "text-blue-600 border-blue-600" : ""}
                        >
                          <Bookmark className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={(e) => handleShare(job, e)}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
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