// components/dashboard/candidate/job-applications.tsx - FIXED
"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Briefcase, MapPin, Calendar, CheckCircle, XCircle, Clock, Eye, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useInView } from "react-intersection-observer"
import Link from "next/link"

interface Application {
  id: string
  job: {
    title: string
    company: { name: string }
    location: string
    salaryMin: number
    salaryMax: number
  }
  status: string
  matchScore: number
  appliedAt: string
  interview?: { scheduledFor: string }
}

const statusConfig = {
  APPLIED: { label: "Applied", color: "bg-blue-500", icon: Clock },
  REVIEWING: { label: "Reviewing", color: "bg-yellow-500", icon: Eye },
  SHORTLISTED: { label: "Shortlisted", color: "bg-purple-500", icon: CheckCircle },
  INTERVIEW_SCHEDULED: { label: "Interview", color: "bg-indigo-500", icon: Calendar },
  REJECTED: { label: "Rejected", color: "bg-red-500", icon: XCircle },
  HIRED: { label: "Hired", color: "bg-green-500", icon: CheckCircle },
}

export const JobApplications = memo(function JobApplications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { ref, inView } = useInView()

  const fetchApplications = useCallback(async (pageNum: number) => {
    try {
      const response = await fetch(`/api/candidate/applications?page=${pageNum}&limit=10`)
      const data = await response.json()
      
      if (pageNum === 1) {
        setApplications(data.applications || [])
      } else {
        setApplications(prev => [...prev, ...(data.applications || [])])
      }
      
      setHasMore(data.hasMore || false)
    } catch (error) {
      console.error("Failed to fetch applications:", error)
      setApplications([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchApplications(1)
  }, [fetchApplications])

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage(prev => prev + 1)
      fetchApplications(page + 1)
    }
  }, [inView, hasMore, loading, page, fetchApplications])

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config?.icon || Clock
    
    return (
      <Badge className={`${config?.color || "bg-gray-500"} text-white`}>
        <Icon className="h-3 w-3 mr-1" />
        {config?.label || status}
      </Badge>
    )
  }

  // Check if applications exists and is array
  if (loading && (!applications || applications.length === 0)) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!applications || applications.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
          <p className="text-muted-foreground mb-4">
            Start applying to jobs to see them here
          </p>
          <Link href="/dashboard/jobs">
            <Button>Browse Jobs</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {applications.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                          <Link href={`/jobs/${app.job?.title || app.id}`}>
                            {app.job?.title || "Job Title"}
                          </Link>
                        </h3>
                        <p className="text-muted-foreground">{app.job?.company?.name || "Company"}</p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {app.job?.location || "Location"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                      {app.job?.salaryMin && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          ${app.job.salaryMin.toLocaleString()} - ${app.job.salaryMax?.toLocaleString()}
                        </div>
                      )}
                    </div>

                    {app.matchScore > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Match Score</span>
                          <span className={app.matchScore >= 70 ? "text-green-500" : "text-yellow-500"}>
                            {app.matchScore}%
                          </span>
                        </div>
                        <Progress value={app.matchScore} className="h-2" />
                      </div>
                    )}

                    {app.interview && (
                      <div className="p-3 bg-indigo-500/10 rounded-lg">
                        <p className="text-sm font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-indigo-500" />
                          Interview Scheduled: {new Date(app.interview.scheduledFor).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <Link href={`/dashboard/applications/${app.id}`}>
                    <Button variant="outline" className="gap-2">
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {hasMore && (
        <div ref={ref} className="py-4 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  )
})