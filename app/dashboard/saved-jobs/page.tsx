// app/dashboard/saved-jobs/page.tsx
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { 
  Briefcase, MapPin, DollarSign, Clock, Heart, 
  Trash2, Eye, Calendar, Building2, AlertCircle
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface SavedJob {
  id: string
  job: {
    id: string
    title: string
    location: string
    salaryMin: number
    salaryMax: number
    employmentType: string
    locationType: string
    company: { name: string; logo?: string }
    createdAt: string
    applicationDeadline: string
  }
  savedAt: string
}

export default function CandidateSavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    fetchSavedJobs()
  }, [])

  const fetchSavedJobs = async () => {
    try {
      const res = await fetch("/api/candidate/saved-jobs")
      const data = await res.json()
      setSavedJobs(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch saved jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (jobId: string) => {
    setRemovingId(jobId)
    try {
      await fetch(`/api/candidate/saved-jobs/${jobId}`, { method: "DELETE" })
      setSavedJobs(prev => prev.filter(sj => sj.job.id !== jobId))
      toast.success("Job removed from saved")
    } catch (error) {
      toast.error("Failed to remove")
    } finally {
      setRemovingId(null)
    }
  }

  const handleApply = async (jobId: string) => {
    toast.loading("Applying...", { id: "apply" })
    try {
      const res = await fetch("/api/candidate/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      })
      
      if (res.ok) {
        toast.success("Application submitted!", { id: "apply" })
        handleRemove(jobId)
      } else {
        toast.error("Failed to apply", { id: "apply" })
      }
    } catch (error) {
      toast.error("Something went wrong", { id: "apply" })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 rounded-lg" />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            Saved Jobs
          </h1>
          <p className="text-slate-500 mt-1">Jobs you've saved for later</p>
        </div>

        {savedJobs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-semibold mb-2">No saved jobs</h3>
              <p className="text-slate-500 mb-4">Save jobs you're interested in to apply later</p>
              <Link href="/dashboard/jobs">
                <Button>Browse Jobs</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {savedJobs.map((saved, index) => {
                const job = saved.job
                const isExpired = new Date(job.applicationDeadline) < new Date()
                
                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <Card className="h-full hover:shadow-xl transition-all">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-600 to-orange-500 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-white" />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(job.id)}
                            disabled={removingId === job.id}
                            className="text-red-500 hover:text-red-600"
                          >
                            {removingId === job.id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                            ) : (
                              <Trash2 className="h-5 w-5" />
                            )}
                          </Button>
                        </div>

                        <h3 className="font-bold text-lg mb-1 line-clamp-1">
                          <Link href={`/jobs/${job.id}`} className="hover:text-blue-600">
                            {job.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-slate-500 mb-3">{job.company.name}</p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <DollarSign className="h-4 w-4" />
                            NPR {job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Calendar className="h-4 w-4" />
                            Saved {formatDistanceToNow(new Date(saved.savedAt), { addSuffix: true })}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="outline" className="text-xs">
                            {job.employmentType?.replace("_", " ")}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {job.locationType}
                          </Badge>
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/jobs/${job.id}`} className="flex-1">
                            <Button variant="outline" className="w-full gap-2">
                              <Eye className="h-4 w-4" />
                              View Details
                            </Button>
                          </Link>
                          {!isExpired && (
                            <Button 
                              onClick={() => handleApply(job.id)}
                              className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-orange-500"
                            >
                              Apply Now
                            </Button>
                          )}
                        </div>

                        {isExpired && (
                          <p className="text-xs text-red-500 text-center mt-3 flex items-center justify-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Application closed
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}