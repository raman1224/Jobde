// app/admin/jobs/page.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Briefcase, Search, Filter, Trash2, Eye, 
  MapPin, DollarSign, Clock, Building2
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface Job {
  id: string
  title: string
  location: string
  salaryMin: number
  salaryMax: number
  employmentType: string
  isActive: boolean
  isFeatured: boolean
  createdAt: string
  company: { name: string; logo?: string }
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    filterJobs()
  }, [jobs, searchQuery, statusFilter])

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/admin/jobs")
      const data = await res.json()
      setJobs(data)
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
      toast.error("Failed to load jobs")
    } finally {
      setLoading(false)
    }
  }

  const filterJobs = () => {
    let filtered = [...jobs]
    
    if (searchQuery) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(job => 
        statusFilter === "active" ? job.isActive : !job.isActive
      )
    }
    
    setFilteredJobs(filtered)
  }

  const deleteJob = async (jobId: string) => {
    if (!confirm("Are you sure? This will remove the job permanently.")) return
    
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Job deleted")
        fetchJobs()
      } else {
        toast.error("Failed to delete job")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const toggleJobStatus = async (jobId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      })
      
      if (res.ok) {
        toast.success(`Job ${!currentStatus ? "activated" : "deactivated"}`)
        fetchJobs()
      }
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
          Manage Jobs
        </h1>
        <p className="text-slate-500 mt-1">View and moderate all job postings</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by job title or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Jobs Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-red-600 to-purple-600 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <Badge className={job.isActive ? "bg-green-500" : "bg-red-500"}>
                    {job.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <h3 className="font-bold text-lg mb-1">{job.title}</h3>
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
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => toggleJobStatus(job.id, job.isActive)}
                  >
                    {job.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500"
                    onClick={() => deleteJob(job.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}