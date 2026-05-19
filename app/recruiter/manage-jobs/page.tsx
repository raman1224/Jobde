// app/recruiter/manage-jobs/page.tsx - COMPLETE WORKING VERSION
"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Briefcase, MapPin, DollarSign, Clock, Eye, 
  Edit, Trash2, Copy, CheckCircle, XCircle,
  Calendar, Users, MoreVertical, Search, Filter,
  TrendingUp, AlertCircle, RefreshCw, FileText
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

interface Job {
  id: string
  title: string
  location: string
  salaryMin: number
  salaryMax: number
  employmentType: string
  status: string
  applicantsCount: number
  views: number
  createdAt: string
  applicationDeadline: string
  company: { name: string; logo?: string }
  description?: string
  skills?: { name: string }[]
}

export default function ManageJobsPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/recruiter/jobs/list")
      
      if (!res.ok) {
        throw new Error("Failed to fetch jobs")
      }
      
      const data = await res.json()
      
      // Ensure data is an array
      const jobsArray = Array.isArray(data) ? data : []
      setJobs(jobsArray)
      setFilteredJobs(jobsArray)
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
      toast.error("Failed to load jobs")
      setJobs([])
      setFilteredJobs([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  // Filter jobs based on tab, search, and status filter
  useEffect(() => {
    let result = [...jobs]
    
    // Apply tab filter
    result = result.filter(job => {
      const isExpired = new Date(job.applicationDeadline) < new Date()
      if (activeTab === "active") return job.status === "ACTIVE" && !isExpired
      if (activeTab === "expired") return isExpired
      if (activeTab === "inactive") return job.status === "INACTIVE" && !isExpired
      return true
    })
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(job => job.status === statusFilter)
    }
    
    setFilteredJobs(result)
  }, [jobs, activeTab, searchQuery, statusFilter])

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("⚠️ Are you sure you want to delete this job? This action cannot be undone.")) return
    
    setIsDeleting(jobId)
    try {
      const res = await fetch(`/api/recruiter/jobs/${jobId}`, { method: "DELETE" })
      
      if (res.ok) {
        toast.success("Job deleted successfully")
        fetchJobs()
      } else {
        const error = await res.json()
        toast.error(error.error || "Failed to delete job")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsDeleting(null)
    }
  }

  const handleToggleStatus = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE"
    const actionText = newStatus === "ACTIVE" ? "activated" : "deactivated"
    
    try {
      const res = await fetch(`/api/recruiter/jobs/${jobId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (res.ok) {
        toast.success(`Job ${actionText} successfully`)
        fetchJobs()
      } else {
        toast.error(`Failed to ${actionText} job`)
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const handleDuplicateJob = async (job: Job) => {
    toast.loading("Duplicating job...", { id: "duplicate" })
    
    try {
      const res = await fetch("/api/recruiter/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${job.title} (Copy)`,
          description: job.description,
          requirements: "",
          location: job.location,
          locationType: "ONSITE",
          employmentType: job.employmentType,
          experienceLevel: "MID",
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          skills: job.skills?.map(s => s.name) || [],
          benefits: [],
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          companyId: job.company?.name ? undefined : undefined,
        }),
      })
      
      if (res.ok) {
        toast.success("Job duplicated successfully!", { id: "duplicate" })
        fetchJobs()
      } else {
        toast.error("Failed to duplicate job", { id: "duplicate" })
      }
    } catch (error) {
      toast.error("Something went wrong", { id: "duplicate" })
    }
  }

  const getStatusBadge = (status: string, deadline: string) => {
    const isExpired = new Date(deadline) < new Date()
    if (isExpired) return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" />Expired</Badge>
    if (status === "ACTIVE") return <Badge className="bg-green-500 gap-1"><CheckCircle className="h-3 w-3" />Active</Badge>
    return <Badge variant="secondary" className="gap-1"><XCircle className="h-3 w-3" />Inactive</Badge>
  }

  const getCounts = () => {
    const active = jobs.filter(j => j.status === "ACTIVE" && new Date(j.applicationDeadline) >= new Date()).length
    const expired = jobs.filter(j => new Date(j.applicationDeadline) < new Date()).length
    const inactive = jobs.filter(j => j.status === "INACTIVE" && new Date(j.applicationDeadline) >= new Date()).length
    return { active, expired, inactive, total: jobs.length }
  }

  const counts = getCounts()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
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
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Manage Jobs
            </h1>
            <p className="text-slate-500 mt-1">View, edit, and manage all your job postings</p>
          </div>
          <Link href="/recruiter/post-job">
            <Button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 gap-2">
              <Briefcase className="h-4 w-4" />
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Jobs" value={counts.total} icon={Briefcase} color="blue" />
          <StatCard title="Active Jobs" value={counts.active} icon={CheckCircle} color="green" />
          <StatCard title="Expired" value={counts.expired} icon={AlertCircle} color="red" />
          <StatCard title="Inactive" value={counts.inactive} icon={XCircle} color="orange" />
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by title, company, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-slate-900"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-white dark:bg-slate-900">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchJobs} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="bg-white dark:bg-slate-900">
            <TabsTrigger value="active" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Active ({counts.active})
            </TabsTrigger>
            <TabsTrigger value="expired" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              Expired ({counts.expired})
            </TabsTrigger>
            <TabsTrigger value="inactive" className="gap-2">
              <XCircle className="h-4 w-4" />
              Inactive ({counts.inactive})
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-2">
              <Briefcase className="h-4 w-4" />
              All ({counts.total})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredJobs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card>
                    <CardContent className="text-center py-12">
                      <Briefcase className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                      <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                      <p className="text-slate-500 mb-4">
                        {searchQuery ? "Try adjusting your search criteria" : "Get started by posting your first job"}
                      </p>
                      {searchQuery ? (
                        <Button variant="outline" onClick={() => setSearchQuery("")}>
                          Clear Search
                        </Button>
                      ) : (
                        <Link href="/recruiter/post-job">
                          <Button>Post a Job</Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row justify-between gap-4">
                          {/* Left Section - Job Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between flex-wrap gap-2">
                              <div>
                                <h3 className="text-xl font-semibold hover:text-blue-600 transition-colors">
                                  <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                                </h3>
                                <p className="text-slate-500">{job.company?.name || "Company"}</p>
                              </div>
                              {getStatusBadge(job.status, job.applicationDeadline)}
                            </div>

                            <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location || "Location not specified"}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {job.salaryMin && job.salaryMax 
                                  ? `NPR ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`
                                  : "Salary not specified"}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {job.employmentType?.replace("_", " ") || "Full Time"}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                              </div>
                            </div>

                            <div className="flex gap-4 mt-4">
                              <div className="flex items-center gap-1 text-sm">
                                <Users className="h-4 w-4 text-blue-500" />
                                <span>{job.applicantsCount || 0} applicants</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <Eye className="h-4 w-4 text-green-500" />
                                <span>{job.views || 0} views</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Section - Actions */}
                          <div className="flex flex-wrap gap-2">
                            <Link href={`/recruiter/jobs/${job.id}/applicants`}>
                              <Button variant="outline" size="sm" className="gap-1">
                                <Users className="h-4 w-4" />
                                Applicants
                              </Button>
                            </Link>
                            <Link href={`/recruiter/jobs/${job.id}/edit`}>
                              <Button variant="outline" size="sm" className="gap-1">
                                <Edit className="h-4 w-4" />
                                Edit
                              </Button>
                            </Link>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-1"
                              onClick={() => handleDuplicateJob(job)}
                            >
                              <Copy className="h-4 w-4" />
                              Duplicate
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className={`gap-1 ${job.status === "ACTIVE" ? "text-yellow-600" : "text-green-600"}`}
                              onClick={() => handleToggleStatus(job.id, job.status)}
                            >
                              {job.status === "ACTIVE" ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                              {job.status === "ACTIVE" ? "Deactivate" : "Activate"}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-1 text-red-500 hover:text-red-600 hover:border-red-300"
                              onClick={() => handleDeleteJob(job.id)}
                              disabled={isDeleting === job.id}
                            >
                              {isDeleting === job.id ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, color }: { title: string; value: number; icon: any; color: string }) {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500",
    red: "from-red-500 to-pink-500",
    orange: "from-orange-500 to-yellow-500",
  }
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`h-10 w-10 rounded-lg bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}