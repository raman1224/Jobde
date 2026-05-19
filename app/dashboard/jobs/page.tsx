// app/dashboard/jobs/page.tsx - FIXED TYPESCRIPT ERRORS
"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Briefcase, MapPin, DollarSign, Clock, Eye, 
  Bookmark, Search, Filter, X, Calendar, Building2,
  TrendingUp, CheckCircle, AlertCircle
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface Job {
  id: string
  title: string
  description: string
  location: string
  salaryMin: number
  salaryMax: number
  employmentType: string
  locationType: string
  experienceLevel: string
  company: { id: string; name: string; logo?: string }
  skills: { id: string; name: string }[]
  createdAt: string
  applicationDeadline: string
  isHot?: boolean
}

interface SavedJob {
  jobId?: string
  job?: { id: string }
}

interface Application {
  jobId?: string
  job?: { id: string }
}

export default function CandidateJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [experienceFilter, setExperienceFilter] = useState("")
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 200000])
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchJobs()
    fetchSavedJobs()
    fetchAppliedJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs/public")
      const data = await res.json()
      const jobsArray = Array.isArray(data) ? data : []
      setJobs(jobsArray)
      setFilteredJobs(jobsArray)
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
      toast.error("Failed to load jobs")
    } finally {
      setLoading(false)
    }
  }

  const fetchSavedJobs = async () => {
    try {
      const res = await fetch("/api/candidate/saved-jobs")
      const data = await res.json()
      // ✅ FIXED: Type assertion for saved jobs
      const savedJobsArray = data as SavedJob[]
      const savedSet = new Set<string>(
        savedJobsArray.map((sj: SavedJob) => sj.jobId || sj.job?.id || "")
      )
      setSavedJobs(savedSet)
    } catch (error) {
      console.error("Failed to fetch saved jobs:", error)
    }
  }

  const fetchAppliedJobs = async () => {
    try {
      const res = await fetch("/api/candidate/applications")
      const data = await res.json()
      // ✅ FIXED: Type assertion for applications
      const applicationsArray = data as Application[]
      const appliedSet = new Set<string>(
        applicationsArray.map((app: Application) => app.jobId || app.job?.id || "")
      )
      setAppliedJobs(appliedSet)
    } catch (error) {
      console.error("Failed to fetch applied jobs:", error)
    }
  }

  const handleSearch = useCallback(() => {
    let filtered = [...jobs]
    
    if (searchQuery) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    
    if (locationFilter) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }
    
    if (typeFilter) {
      filtered = filtered.filter(job => job.employmentType === typeFilter)
    }
    
    if (experienceFilter) {
      filtered = filtered.filter(job => job.experienceLevel === experienceFilter)
    }
    
    if (salaryRange[1] < 200000) {
      filtered = filtered.filter(job => 
        (job.salaryMin || 0) <= salaryRange[1] && (job.salaryMax || 0) >= salaryRange[0]
      )
    }
    
    setFilteredJobs(filtered)
  }, [jobs, searchQuery, locationFilter, typeFilter, experienceFilter, salaryRange])

  useEffect(() => {
    handleSearch()
  }, [handleSearch])

  const handleSaveJob = async (jobId: string, isSaved: boolean) => {
    if (isSaved) {
      try {
        await fetch(`/api/candidate/saved-jobs/${jobId}`, { method: "DELETE" })
        setSavedJobs(prev => {
          const newSet = new Set(prev)
          newSet.delete(jobId)
          return newSet
        })
        toast.success("Job removed from saved")
      } catch (error) {
        toast.error("Failed to remove")
      }
    } else {
      try {
        await fetch("/api/candidate/saved-jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId }),
        })
        setSavedJobs(prev => new Set([...prev, jobId]))
        toast.success("Job saved!")
      } catch (error) {
        toast.error("Failed to save")
      }
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setLocationFilter("")
    setTypeFilter("")
    setExperienceFilter("")
    setSalaryRange([0, 200000])
  }

  const employmentTypes = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"]
  const experienceLevels = ["ENTRY", "JUNIOR", "MID", "SENIOR", "LEAD", "EXECUTIVE"]

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 mb-3" />
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-4 w-40" />
                </CardContent>
              </Card>
            ))}
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
            Find Your Dream Job
          </h1>
          <p className="text-slate-500 mt-1">Discover opportunities from top companies</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Job title, company, or keywords"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} className="gap-2 bg-gradient-to-r from-blue-600 to-orange-500">
                <Search className="h-4 w-4" />
                Search
              </Button>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card>
                <CardContent className="p-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Employment Type</label>
                      <select 
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full p-2 border rounded-lg dark:bg-slate-900"
                      >
                        <option value="">All Types</option>
                        {employmentTypes.map(type => (
                          <option key={type} value={type}>{type.replace("_", " ")}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Experience Level</label>
                      <select 
                        value={experienceFilter}
                        onChange={(e) => setExperienceFilter(e.target.value)}
                        className="w-full p-2 border rounded-lg dark:bg-slate-900"
                      >
                        <option value="">All Levels</option>
                        {experienceLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Max Salary (NPR)</label>
                      <input
                        type="range"
                        min="0"
                        max="200000"
                        step="10000"
                        value={salaryRange[1]}
                        onChange={(e) => setSalaryRange([0, parseInt(e.target.value)])}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-slate-500 mt-1">
                        <span>0</span>
                        <span>Up to NPR {salaryRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="ghost" onClick={clearFilters} className="gap-2">
                      <X className="h-4 w-4" />
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-slate-500">Found {filteredJobs.length} jobs</p>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
              <p className="text-slate-500 mb-4">Try adjusting your search or filters</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job, index) => {
                const isSaved = savedJobs.has(job.id)
                const hasApplied = appliedJobs.has(job.id)
                const isExpired = new Date(job.applicationDeadline) < new Date()
                
                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                      <CardContent className="p-6">
                        {/* Hot Badge */}
                        {job.isHot && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-red-500 gap-1">
                              <TrendingUp className="h-3 w-3" />
                              Hot
                            </Badge>
                          </div>
                        )}

                        <div className="flex justify-between items-start mb-4">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-600 to-orange-500 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-white" />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSaveJob(job.id, isSaved)}
                            className={isSaved ? "text-pink-500" : ""}
                          >
                            <Bookmark className="h-5 w-5" />
                          </Button>
                        </div>

                        <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          <Link href={`/jobs/${job.id}`}>{job.title}</Link>
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
                            <Clock className="h-4 w-4" />
                            {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="outline" className="text-xs">
                            {job.employmentType?.replace("_", " ")}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {job.locationType}
                          </Badge>
                          {job.skills?.slice(0, 2).map((skill) => (
                            <Badge key={skill.id} variant="secondary" className="text-xs">
                              {skill.name}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/jobs/${job.id}`} className="flex-1">
                            <Button variant="outline" className="w-full gap-2">
                              <Eye className="h-4 w-4" />
                              View Details
                            </Button>
                          </Link>
                          {!isExpired && !hasApplied && (
                            <Link href={`/jobs/${job.id}`} className="flex-1">
                              <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-orange-500">
                                Apply Now
                              </Button>
                            </Link>
                          )}
                          {hasApplied && (
                            <Button disabled variant="outline" className="flex-1 gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Applied
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