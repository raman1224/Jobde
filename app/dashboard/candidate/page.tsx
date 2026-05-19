

// app/dashboard/candidate/page.tsx - COMPLETE WORKING VERSION
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Briefcase, Heart, Bell, User, FileText, 
  MapPin, DollarSign, Clock, Eye, Bookmark, 
  CheckCircle, XCircle, Calendar, MessageSquare,
  Settings, LogOut, Search, Filter, TrendingUp
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

interface Job {
  id: string
  title: string
  description: string
  location: string
  salaryMin: number
  salaryMax: number
  employmentType: string
  company: { name: string; logo?: string }
  skills: { name: string }[]
  createdAt: string
  applicationDeadline: string
}

interface Application {
  id: string
  job: Job
  status: string
  matchScore: number
  appliedAt: string
}

interface SavedJob {
  id: string
  job: Job
  savedAt: string
}

interface Interview {
  id: string
  applicationId: string
  scheduledFor: string
  type: string
  status: string
  job: { title: string }
  company: { name: string }
}

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string
}

interface Message {
  id: string
  senderId: string
  content: string
  read: boolean
  createdAt: string
  sender?: { name: string; image?: string }
}

export default function CandidateDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("jobs")
  
  // Jobs
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [loadingJobs, setLoadingJobs] = useState(true)
  
  // Applications
  const [applications, setApplications] = useState<Application[]>([])
  const [loadingApps, setLoadingApps] = useState(true)
  
  // Saved Jobs
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [loadingSaved, setLoadingSaved] = useState(true)
  
  // Interviews
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loadingInterviews, setLoadingInterviews] = useState(true)
  
  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  
  // Messages
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingMessages, setLoadingMessages] = useState(true)

  // Stats
  const [stats, setStats] = useState({
    applications: 0,
    savedJobs: 0,
    interviews: 0,
    profileViews: 0,
  })

  useEffect(() => {
    fetchJobs()
    fetchApplications()
    fetchSavedJobs()
    fetchInterviews()
    fetchNotifications()
    fetchMessages()
    fetchStats()
  }, [])

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs/public")
      const data = await res.json()
      const jobsArray = Array.isArray(data) ? data : data.jobs || []
      setJobs(jobsArray)
      setFilteredJobs(jobsArray)
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
      setJobs([])
      setFilteredJobs([])
    } finally {
      setLoadingJobs(false)
    }
  }

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/candidate/applications")
      const data = await res.json()
      setApplications(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch applications:", error)
      setApplications([])
    } finally {
      setLoadingApps(false)
    }
  }

  const fetchSavedJobs = async () => {
    try {
      const res = await fetch("/api/candidate/saved-jobs")
      const data = await res.json()
      setSavedJobs(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch saved jobs:", error)
      setSavedJobs([])
    } finally {
      setLoadingSaved(false)
    }
  }

  const fetchInterviews = async () => {
    try {
      const res = await fetch("/api/candidate/interviews")
      const data = await res.json()
      setInterviews(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch interviews:", error)
      setInterviews([])
    } finally {
      setLoadingInterviews(false)
    }
  }

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications")
      const data = await res.json()
      const notifs = Array.isArray(data) ? data : []
      setNotifications(notifs)
      setUnreadCount(notifs.filter((n: Notification) => !n.read).length)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
      setNotifications([])
    }
  }

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/candidate/messages")
      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch messages:", error)
      setMessages([])
    } finally {
      setLoadingMessages(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/candidate/stats")
      const data = await res.json()
      setStats({
        applications: data.applications || 0,
        savedJobs: data.savedJobs || 0,
        interviews: data.interviews || 0,
        profileViews: data.profileViews || 0,
      })
    } catch (error) {
      console.error("Failed to fetch stats:", error)
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
        fetchApplications()
        fetchStats()
      } else {
        const error = await res.json()
        toast.error(error.error || "Failed to apply", { id: "apply" })
      }
    } catch (error) {
      toast.error("Something went wrong", { id: "apply" })
    }
  }

  const handleSaveJob = async (jobId: string, isSaved: boolean) => {
    if (isSaved) {
      // Remove from saved
      try {
        await fetch(`/api/candidate/saved-jobs/${jobId}`, { method: "DELETE" })
        toast.success("Job removed from saved")
        fetchSavedJobs()
        fetchStats()
      } catch (error) {
        toast.error("Failed to remove")
      }
    } else {
      // Save job
      try {
        await fetch("/api/candidate/saved-jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId }),
        })
        toast.success("Job saved!")
        fetchSavedJobs()
        fetchStats()
      } catch (error) {
        toast.error("Failed to save")
      }
    }
  }

  const handleSearch = () => {
    let filtered = [...jobs]
    
    if (searchQuery) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    if (locationFilter) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      )
    }
    
    setFilteredJobs(filtered)
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      APPLIED: { label: "Applied", color: "bg-blue-500" },
      REVIEWING: { label: "Reviewing", color: "bg-yellow-500" },
      SHORTLISTED: { label: "Shortlisted", color: "bg-purple-500" },
      INTERVIEW_SCHEDULED: { label: "Interview", color: "bg-indigo-500" },
      REJECTED: { label: "Rejected", color: "bg-red-500" },
      HIRED: { label: "Hired", color: "bg-green-500" },
    }
    const c = config[status] || { label: status, color: "bg-gray-500" }
    return <Badge className={c.color}>{c.label}</Badge>
  }

  const markNotificationRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  const StatCards = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Applications</p>
            <p className="text-2xl font-bold">{stats.applications}</p>
          </div>
          <Briefcase className="h-8 w-8 text-blue-500" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Saved Jobs</p>
            <p className="text-2xl font-bold">{stats.savedJobs}</p>
          </div>
          <Heart className="h-8 w-8 text-pink-500" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Interviews</p>
            <p className="text-2xl font-bold">{stats.interviews}</p>
          </div>
          <Calendar className="h-8 w-8 text-green-500" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Profile Views</p>
            <p className="text-2xl font-bold">{stats.profileViews}</p>
          </div>
          <Eye className="h-8 w-8 text-purple-500" />
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            Welcome back, {user?.name?.split(" ")[0] || "Candidate"}!
          </h1>
          <p className="text-slate-500 mt-1">Find your dream job and track your applications</p>
        </div>

        {/* Stats */}
        <StatCards />

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-900">
            <TabsTrigger value="jobs" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Browse Jobs
            </TabsTrigger>
            <TabsTrigger value="applications" className="gap-2">
              <FileText className="h-4 w-4" />
              Applications ({applications.length})
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2">
              <Heart className="h-4 w-4" />
              Saved Jobs ({savedJobs.length})
            </TabsTrigger>
            <TabsTrigger value="interviews" className="gap-2">
              <Calendar className="h-4 w-4" />
              Interviews ({interviews.length})
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 relative">
              <Bell className="h-4 w-4" />
              Notifications
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Browse Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            {/* Search Bar */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search by job title or company"
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
                  <Button onClick={handleSearch} className="gap-2">
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Jobs Grid */}
            {loadingJobs ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
              </div>
            ) : filteredJobs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                  <p className="text-slate-500">Try adjusting your search criteria</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredJobs.map((job) => {
                  const isSaved = savedJobs.some(sj => sj.job.id === job.id)
                  const hasApplied = applications.some(app => app.job.id === job.id)
                  const isExpired = new Date(job.applicationDeadline) < new Date()
                  
                  return (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group"
                    >
                      <Card className="hover:shadow-xl transition-all h-full">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                                {job.title}
                              </h3>
                              <p className="text-sm text-slate-500">{job.company?.name}</p>
                            </div>
                            <Badge variant="outline">{job.employmentType?.replace("_", " ")}</Badge>
                          </div>
                          
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
                              Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.skills?.slice(0, 3).map((skill) => (
                              <Badge key={skill.name} variant="secondary" className="text-xs">
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

                              <Button 
                                // onClick={() => handleApply(job.id)}
                                className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-orange-500"
                              >
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
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleSaveJob(job.id, isSaved)}
                              className={isSaved ? "text-pink-500 border-pink-500" : ""}
                            >
                              <Bookmark className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {isExpired && (
                            <p className="text-xs text-red-500 mt-3 text-center">Application closed</p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            {loadingApps ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
              </div>
            ) : applications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                  <p className="text-slate-500 mb-4">Start applying to jobs to see them here</p>
                  <Button onClick={() => setActiveTab("jobs")}>Browse Jobs</Button>
                </CardContent>
              </Card>
            ) : (
              applications.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-lg">{app.job.title}</h3>
                          <p className="text-sm text-slate-500">{app.job.company?.name}</p>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {app.job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> Applied {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                            </span>
                          </div>
                          {app.matchScore > 0 && (
                            <div className="mt-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Match Score</span>
                                <span className={app.matchScore >= 70 ? "text-green-600" : "text-yellow-600"}>
                                  {app.matchScore}%
                                </span>
                              </div>
                              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${app.matchScore >= 70 ? "bg-green-500" : "bg-yellow-500"}`} style={{ width: `${app.matchScore}%` }} />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(app.status)}
                          <Link href={`/jobs/${app.job.id}`}>
                            <Button variant="outline" size="sm">View Job</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>

          {/* Saved Jobs Tab */}
          <TabsContent value="saved" className="space-y-4">
            {loadingSaved ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
              </div>
            ) : savedJobs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-semibold mb-2">No saved jobs</h3>
                  <p className="text-slate-500 mb-4">Save jobs you're interested in to apply later</p>
                  <Button onClick={() => setActiveTab("jobs")}>Browse Jobs</Button>
                </CardContent>
              </Card>
            ) : (
              savedJobs.map((saved, index) => (
                <motion.div
                  key={saved.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{saved.job.title}</h3>
                          <p className="text-sm text-slate-500">{saved.job.company?.name}</p>
                          <p className="text-sm text-slate-500 mt-1">{saved.job.location}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleApply(saved.job.id)} size="sm" className="bg-green-600">
                            Apply Now
                          </Button>
                          <Button onClick={() => handleSaveJob(saved.job.id, true)} variant="outline" size="sm">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>

          {/* Interviews Tab */}
          <TabsContent value="interviews" className="space-y-4">
            {loadingInterviews ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
              </div>
            ) : interviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-semibold mb-2">No interviews scheduled</h3>
                  <p className="text-slate-500">When you get shortlisted, interviews will appear here</p>
                </CardContent>
              </Card>
            ) : (
              interviews.map((interview, index) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-lg">{interview.job?.title}</h3>
                          <p className="text-sm text-slate-500">{interview.company?.name}</p>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1 text-blue-600">
                              <Calendar className="h-4 w-4" />
                              {new Date(interview.scheduledFor).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1 text-blue-600">
                              <Clock className="h-4 w-4" />
                              {new Date(interview.scheduledFor).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <Badge className={interview.status === "SCHEDULED" ? "bg-green-500" : "bg-gray-500"}>
                          {interview.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            {loadingMessages ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
              </div>
            ) : messages.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                  <p className="text-slate-500">When recruiters message you, they'll appear here</p>
                </CardContent>
              </Card>
            ) : (
              messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={!message.read ? "border-l-4 border-l-blue-500" : ""}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-orange-500 flex items-center justify-center text-white font-bold">
                          {message.sender?.name?.charAt(0) || "R"}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{message.sender?.name || "Recruiter"}</p>
                              <p className="text-sm text-slate-600 mt-1">{message.content}</p>
                            </div>
                            <p className="text-xs text-slate-400">
                              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-3">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                  <p className="text-slate-500">You're all caught up!</p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all ${!notification.read ? "border-l-4 border-l-blue-500 bg-blue-50/10" : ""}`}
                    onClick={() => markNotificationRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          {notification.type === "APPLICATION_UPDATE" && <Briefcase className="h-5 w-5 text-blue-500" />}
                          {notification.type === "INTERVIEW_SCHEDULED" && <Calendar className="h-5 w-5 text-green-500" />}
                          {notification.type === "JOB_ALERT" && <Bell className="h-5 w-5 text-orange-500" />}
                          {notification.type === "NEW_MESSAGE" && <MessageSquare className="h-5 w-5 text-purple-500" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{notification.title}</p>
                          <p className="text-sm text-slate-500">{notification.message}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        {!notification.read && <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />}
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