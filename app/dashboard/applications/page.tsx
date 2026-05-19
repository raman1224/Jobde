// app/dashboard/applications/page.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Briefcase, MapPin, Calendar, CheckCircle, XCircle, 
  Clock, Eye, TrendingUp, ChevronRight, AlertCircle
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"

interface Application {
  id: string
  status: string
  matchScore: number
  appliedAt: string
  job: {
    id: string
    title: string
    location: string
    salaryMin: number
    salaryMax: number
    employmentType: string
    company: { name: string; logo?: string }
  }
  interview?: {
    scheduledFor: string
    type: string
    meetingLink?: string
  }
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  APPLIED: { label: "Applied", color: "bg-blue-500", icon: Clock },
  REVIEWING: { label: "Reviewing", color: "bg-yellow-500", icon: Eye },
  SHORTLISTED: { label: "Shortlisted", color: "bg-purple-500", icon: TrendingUp },
  INTERVIEW_SCHEDULED: { label: "Interview Scheduled", color: "bg-indigo-500", icon: Calendar },
  REJECTED: { label: "Rejected", color: "bg-red-500", icon: XCircle },
  HIRED: { label: "Hired", color: "bg-green-500", icon: CheckCircle },
}

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/candidate/applications")
      const data = await res.json()
      setApplications(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch applications:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || statusConfig.APPLIED
    const Icon = config.icon
    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const filteredApplications = applications.filter(app => {
    if (activeTab === "all") return true
    if (activeTab === "active") return !["REJECTED", "HIRED"].includes(app.status)
    return app.status === activeTab
  })

  const stats = {
    total: applications.length,
    active: applications.filter(a => !["REJECTED", "HIRED"].includes(a.status)).length,
    shortlisted: applications.filter(a => a.status === "SHORTLISTED").length,
    interviewing: applications.filter(a => a.status === "INTERVIEW_SCHEDULED").length,
    hired: applications.filter(a => a.status === "HIRED").length,
    rejected: applications.filter(a => a.status === "REJECTED").length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-lg mb-4" />)}
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
            My Applications
          </h1>
          <p className="text-slate-500 mt-1">Track your job applications and their status</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <StatCard title="Total" value={stats.total} color="blue" />
          <StatCard title="Active" value={stats.active} color="green" />
          <StatCard title="Shortlisted" value={stats.shortlisted} color="purple" />
          <StatCard title="Interview" value={stats.interviewing} color="indigo" />
          <StatCard title="Hired" value={stats.hired} color="emerald" />
          <StatCard title="Rejected" value={stats.rejected} color="red" />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="bg-white dark:bg-slate-900">
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
            <TabsTrigger value="SHORTLISTED">Shortlisted ({stats.shortlisted})</TabsTrigger>
            <TabsTrigger value="INTERVIEW_SCHEDULED">Interview ({stats.interviewing})</TabsTrigger>
            <TabsTrigger value="HIRED">Hired ({stats.hired})</TabsTrigger>
            <TabsTrigger value="REJECTED">Rejected ({stats.rejected})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredApplications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-semibold mb-2">No applications found</h3>
                  <p className="text-slate-500 mb-4">Start applying to jobs to see them here</p>
                  <Link href="/dashboard/jobs">
                    <Button>Browse Jobs</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              filteredApplications.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between flex-wrap gap-2">
                            <div>
                              <h3 className="text-xl font-semibold hover:text-blue-600 transition-colors">
                                <Link href={`/jobs/${app.job.id}`}>{app.job.title}</Link>
                              </h3>
                              <p className="text-slate-500">{app.job.company.name}</p>
                            </div>
                            {getStatusBadge(app.status)}
                          </div>

                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {app.job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {app.job.employmentType?.replace("_", " ")}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Applied {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                            </div>
                          </div>

                          {app.matchScore > 0 && (
                            <div className="mt-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span>AI Match Score</span>
                                <span className={app.matchScore >= 70 ? "text-green-600" : "text-yellow-600"}>
                                  {app.matchScore}%
                                </span>
                              </div>
                              <Progress value={app.matchScore} className="h-2" />
                            </div>
                          )}

                          {app.interview && (
                            <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
                              <p className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-indigo-500" />
                                Interview Scheduled: {new Date(app.interview.scheduledFor).toLocaleString()}
                              </p>
                              {app.interview.meetingLink && (
                                <a 
                                  href={app.interview.meetingLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-indigo-600 hover:underline mt-1 inline-block"
                                >
                                  Join Meeting →
                                </a>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/jobs/${app.job.id}`}>
                            <Button variant="outline" className="gap-2">
                              <Eye className="h-4 w-4" />
                              View Job
                            </Button>
                          </Link>
                          {app.status === "SHORTLISTED" && (
                            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-orange-500">
                              Prepare for Interview
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500",
    purple: "from-purple-500 to-pink-500",
    indigo: "from-indigo-500 to-blue-500",
    emerald: "from-emerald-500 to-teal-500",
    red: "from-red-500 to-orange-500",
  }
  
  return (
    <Card>
      <CardContent className="p-3 text-center">
        <p className="text-xs text-slate-500">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}