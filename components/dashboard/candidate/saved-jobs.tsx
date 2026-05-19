// components/dashboard/candidate/saved-jobs.tsx
"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, MapPin, Building2, DollarSign, Trash2, Briefcase, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import Link from "next/link"

interface SavedJob {
  id: string
  job: {
    id: string
    title: string
    company: { name: string; logo?: string }
    location: string
    salaryMin: number
    salaryMax: number
    employmentType: string
    locationType: string
  }
  savedAt: string
}

export const SavedJobs = memo(function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSavedJobs = useCallback(async () => {
    try {
      const response = await fetch("/api/candidate/saved-jobs")
      const data = await response.json()
      setSavedJobs(data)
    } catch (error) {
      console.error("Failed to fetch saved jobs:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSavedJobs()
  }, [fetchSavedJobs])

  const removeSavedJob = useCallback(async (jobId: string) => {
    try {
      const response = await fetch(`/api/candidate/saved-jobs/${jobId}`, {
        method: "DELETE",
      })
      
      if (response.ok) {
        setSavedJobs(prev => prev.filter(job => job.job.id !== jobId))
        toast.success("Job removed from saved list")
      }
    } catch (error) {
      toast.error("Failed to remove job")
    }
  }, [])

  const applyToJob = useCallback(async (jobId: string) => {
    try {
      const response = await fetch("/api/candidate/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      })
      
      if (response.ok) {
        toast.success("Application submitted successfully!")
        removeSavedJob(jobId)
      }
    } catch (error) {
      toast.error("Failed to apply")
    }
  }, [removeSavedJob])

  const getEmploymentBadge = (type: string) => {
    const colors = {
      FULL_TIME: "bg-green-500",
      PART_TIME: "bg-blue-500",
      CONTRACT: "bg-orange-500",
      INTERNSHIP: "bg-purple-500",
      FREELANCE: "bg-pink-500",
    }
    return <Badge className={colors[type as keyof typeof colors] || "bg-gray-500"}>
      {type.replace("_", " ")}
    </Badge>
  }

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-32 mb-3" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-4 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (savedJobs.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No saved jobs</h3>
          <p className="text-muted-foreground mb-4">
            Save jobs you're interested in to apply later
          </p>
          <Link href="/dashboard/jobs">
            <Button>Browse Jobs</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <AnimatePresence mode="popLayout">
        {savedJobs.map((saved, index) => (
          <motion.div
            key={saved.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="h-full hover:shadow-lg transition-all duration-200">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg line-clamp-1">
                      <Link href={`/jobs/${saved.job.id}`} className="hover:text-primary">
                        {saved.job.title}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Building2 className="h-3 w-3" />
                      {saved.job.company.name}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSavedJob(saved.job.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>{saved.job.location}</span>
                    <Badge variant="outline" className="ml-auto">
                      {saved.job.locationType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    <span>${saved.job.salaryMin?.toLocaleString()} - ${saved.job.salaryMax?.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    {getEmploymentBadge(saved.job.employmentType)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => applyToJob(saved.job.id)}
                  >
                    <Briefcase className="h-4 w-4" />
                    Apply Now
                  </Button>
                  <Link href={`/jobs/${saved.job.id}`} className="flex-1">
                    <Button variant="outline" className="w-full gap-2">
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
    </div>
  )
})