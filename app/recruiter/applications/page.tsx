// app/recruiter/applications/page.tsx - COMPLETE WORKING VERSION
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Users, Eye, Calendar, MapPin, 
  Download, Filter, Search, Star, MessageSquare,
  CheckCircle, XCircle, Clock, Calendar as CalendarIcon,
  Loader2, Mail, Phone, Code
} from "lucide-react"
import { RefreshCw, Briefcase, GraduationCap, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface Application {
  id: string
  status: string
  matchScore: number
  appliedAt: string
  notes?: string
  candidate: {
    id: string
    name: string
    email: string
    image?: string
    profile?: {
      phone?: string
      location?: string
      bio?: string
    }
    candidateProfile?: {
      skills: { name: string }[]
      experience: { title: string; company: string; startDate: string; endDate?: string }[]
      education: { degree: string; institution: string; field: string }[]
      resumeUrl?: string
    }
  }
  job: {
    id: string
    title: string
    location: string
    employmentType: string
  }
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  APPLIED: { label: "Applied", color: "bg-blue-500", icon: Clock },
  REVIEWING: { label: "Reviewing", color: "bg-yellow-500", icon: Eye },
  SHORTLISTED: { label: "Shortlisted", color: "bg-purple-500", icon: Star },
  INTERVIEW_SCHEDULED: { label: "Interview", color: "bg-indigo-500", icon: CalendarIcon },
  REJECTED: { label: "Rejected", color: "bg-red-500", icon: XCircle },
  HIRED: { label: "Hired", color: "bg-green-500", icon: CheckCircle },
}

export default function RecruiterApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApps, setFilteredApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Interview form
  const [interviewData, setInterviewData] = useState({
    date: "",
    time: "",
    type: "VIDEO",
    meetingLink: "",
    notes: "",
  })

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, searchQuery, statusFilter])

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/recruiter/applications/list")
      const data = await res.json()
      setApplications(Array.isArray(data) ? data : [])
      setFilteredApps(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch applications:", error)
      toast.error("Failed to load applications")
    } finally {
      setLoading(false)
    }
  }

  const filterApplications = () => {
    let filtered = [...applications]
    
    if (searchQuery) {
      filtered = filtered.filter(app => 
        app.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.candidate.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter)
    }
    
    setFilteredApps(filtered)
  }

  const updateApplicationStatus = async (applicationId: string, newStatus: string, additionalData?: any) => {
    setIsUpdating(true)
    toast.loading("Updating application...", { id: "update" })
    
    try {
      const res = await fetch(`/api/recruiter/applications/${applicationId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, ...additionalData }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        toast.success(data.message || `Application ${newStatus.toLowerCase()}`, { id: "update" })
        fetchApplications()
        setIsInterviewModalOpen(false)
        setIsRejectModalOpen(false)
        setSelectedApp(null)
      } else {
        toast.error(data.error || "Failed to update status", { id: "update" })
      }
    } catch (error) {
      console.error("Update error:", error)
      toast.error("Something went wrong", { id: "update" })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleShortlist = (app: Application) => {
    updateApplicationStatus(app.id, "SHORTLISTED")
  }

  const handleScheduleInterview = async () => {
    if (!selectedApp) return
    
    if (!interviewData.date || !interviewData.time) {
      toast.error("Please select date and time for interview")
      return
    }
    
    const scheduledFor = new Date(`${interviewData.date}T${interviewData.time}`)
    
    await updateApplicationStatus(selectedApp.id, "INTERVIEW_SCHEDULED", {
      interview: {
        scheduledFor: scheduledFor.toISOString(),
        type: interviewData.type,
        meetingLink: interviewData.meetingLink,
        notes: interviewData.notes,
        duration: 60,
      }
    })
  }

  const handleReject = () => {
    if (!selectedApp) return
    updateApplicationStatus(selectedApp.id, "REJECTED")
  }

  const handleHire = (app: Application) => {
    updateApplicationStatus(app.id, "HIRED")
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

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === "APPLIED").length,
    reviewing: applications.filter(a => a.status === "REVIEWING").length,
    shortlisted: applications.filter(a => a.status === "SHORTLISTED").length,
    interview: applications.filter(a => a.status === "INTERVIEW_SCHEDULED").length,
    hired: applications.filter(a => a.status === "HIRED").length,
    rejected: applications.filter(a => a.status === "REJECTED").length,
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Applications
            </h1>
            <p className="text-slate-500 mt-1">Manage and review candidate applications</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-6">
          <StatCard title="Total" value={stats.total} color="blue" />
          <StatCard title="Applied" value={stats.applied} color="gray" />
          <StatCard title="Reviewing" value={stats.reviewing} color="yellow" />
          <StatCard title="Shortlisted" value={stats.shortlisted} color="purple" />
          <StatCard title="Interview" value={stats.interview} color="indigo" />
          <StatCard title="Hired" value={stats.hired} color="green" />
          <StatCard title="Rejected" value={stats.rejected} color="red" />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by candidate name, job title, or email..."
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
              <SelectItem value="all">All Status ({stats.total})</SelectItem>
              <SelectItem value="APPLIED">Applied ({stats.applied})</SelectItem>
              <SelectItem value="REVIEWING">Reviewing ({stats.reviewing})</SelectItem>
              <SelectItem value="SHORTLISTED">Shortlisted ({stats.shortlisted})</SelectItem>
              <SelectItem value="INTERVIEW_SCHEDULED">Interview ({stats.interview})</SelectItem>
              <SelectItem value="HIRED">Hired ({stats.hired})</SelectItem>
              <SelectItem value="REJECTED">Rejected ({stats.rejected})</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchApplications} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredApps.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-semibold mb-2">No applications found</h3>
                  <p className="text-slate-500">When candidates apply, they'll appear here</p>
                </CardContent>
              </Card>
            ) : (
              filteredApps.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Card className="hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row justify-between gap-6">
                        {/* Candidate Info */}
                        <div className="flex gap-4 flex-1">
                          <Avatar className="h-14 w-14">
                            <AvatarImage src={app.candidate.image} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-orange-500 text-white text-lg">
                              {app.candidate.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-lg">{app.candidate.name}</h3>
                                <p className="text-sm text-slate-500">{app.candidate.email}</p>
                                <p className="text-sm text-slate-500 mt-1">
                                  Applied for: <span className="font-medium">{app.job.title}</span>
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                  Applied {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                                </p>
                              </div>
                              {getStatusBadge(app.status)}
                            </div>

                            {/* Match Score */}
                            {app.matchScore > 0 && (
                              <div className="mt-3">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>AI Match Score</span>
                                  <span className={getMatchScoreColor(app.matchScore)}>
                                    {app.matchScore}%
                                  </span>
                                </div>
                                <Progress value={app.matchScore} className="h-2" />
                              </div>
                            )}

                            {/* Skills Preview */}
                            {app.candidate.candidateProfile?.skills && app.candidate.candidateProfile.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-3">
                                {app.candidate.candidateProfile.skills.slice(0, 5).map((skill, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {skill.name}
                                  </Badge>
                                ))}
                                {app.candidate.candidateProfile.skills.length > 5 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{app.candidate.candidateProfile.skills.length - 5}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 items-start">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="gap-1" onClick={() => setSelectedApp(app)}>
                                <Eye className="h-4 w-4" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <CandidateDetailsModal candidate={app.candidate} job={app.job} />
                            </DialogContent>
                          </Dialog>

                          {app.status === "APPLIED" && (
                            <Button 
                              size="sm" 
                              className="gap-1 bg-purple-600 hover:bg-purple-700"
                              onClick={() => handleShortlist(app)}
                              disabled={isUpdating}
                            >
                              <Star className="h-4 w-4" />
                              Shortlist
                            </Button>
                          )}

                          {(app.status === "APPLIED" || app.status === "REVIEWING" || app.status === "SHORTLISTED") && (
                            <Button 
                              size="sm" 
                              className="gap-1 bg-indigo-600 hover:bg-indigo-700"
                              onClick={() => {
                                setSelectedApp(app)
                                setIsInterviewModalOpen(true)
                              }}
                              disabled={isUpdating}
                            >
                              <CalendarIcon className="h-4 w-4" />
                              Schedule Interview
                            </Button>
                          )}

                          {app.status === "SHORTLISTED" && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="gap-1 text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleHire(app)}
                              disabled={isUpdating}
                            >
                              <CheckCircle className="h-4 w-4" />
                              Hire
                            </Button>
                          )}

                          {app.status !== "REJECTED" && app.status !== "HIRED" && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="gap-1 text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => {
                                setSelectedApp(app)
                                setIsRejectModalOpen(true)
                              }}
                              disabled={isUpdating}
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      <Dialog open={isInterviewModalOpen} onOpenChange={setIsInterviewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Input 
                  type="date" 
                  value={interviewData.date}
                  onChange={(e) => setInterviewData({ ...interviewData, date: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <Label>Time</Label>
                <Input 
                  type="time" 
                  value={interviewData.time}
                  onChange={(e) => setInterviewData({ ...interviewData, time: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Interview Type</Label>
              <Select value={interviewData.type} onValueChange={(v) => setInterviewData({ ...interviewData, type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIDEO">Video Call</SelectItem>
                  <SelectItem value="PHONE">Phone Call</SelectItem>
                  <SelectItem value="ONSITE">Onsite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Meeting Link (Optional)</Label>
              <Input 
                placeholder="https://meet.google.com/..." 
                value={interviewData.meetingLink}
                onChange={(e) => setInterviewData({ ...interviewData, meetingLink: e.target.value })}
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea 
                placeholder="Additional notes for the candidate..."
                rows={3}
                value={interviewData.notes}
                onChange={(e) => setInterviewData({ ...interviewData, notes: e.target.value })}
              />
            </div>
            <Button onClick={handleScheduleInterview} disabled={isUpdating} className="w-full">
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Schedule Interview
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-600 mb-4">
              Are you sure you want to reject <strong>{selectedApp?.candidate.name}</strong>'s application for <strong>{selectedApp?.job.title}</strong>?
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsRejectModalOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleReject} disabled={isUpdating} className="flex-1 bg-red-600 hover:bg-red-700">
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Confirm Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Helper Components
function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: "from-blue-500 to-cyan-500",
    gray: "from-gray-500 to-slate-500",
    yellow: "from-yellow-500 to-amber-500",
    purple: "from-purple-500 to-pink-500",
    indigo: "from-indigo-500 to-blue-500",
    green: "from-green-500 to-emerald-500",
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

function CandidateDetailsModal({ candidate, job }: { candidate: Application["candidate"]; job: Application["job"] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={candidate.image} />
          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-orange-500 text-white text-xl">
            {candidate.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold">{candidate.name}</h2>
          <p className="text-slate-500">{candidate.email}</p>
          {candidate.profile?.phone && (
            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
              <Phone className="h-3 w-3" /> {candidate.profile.phone}
            </p>
          )}
        </div>
      </div>

      {/* Bio */}
      {candidate.profile?.bio && (
        <div>
          <h3 className="font-semibold mb-2">About</h3>
          <p className="text-sm text-slate-600">{candidate.profile.bio}</p>
        </div>
      )}

      {/* Skills */}
      {candidate.candidateProfile?.skills && candidate.candidateProfile.skills.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Code className="h-4 w-4" />
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {candidate.candidateProfile.skills.map((skill, i) => (
              <Badge key={i} variant="secondary">{skill.name}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {candidate.candidateProfile?.experience && candidate.candidateProfile.experience.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Experience
          </h3>
          <div className="space-y-3">
            {candidate.candidateProfile.experience.map((exp, i) => (
              <div key={i} className="border-l-2 border-blue-300 pl-3">
                <p className="font-medium">{exp.title}</p>
                <p className="text-sm text-slate-500">{exp.company}</p>
                <p className="text-xs text-slate-400">
                  {exp.startDate} - {exp.endDate || "Present"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {candidate.candidateProfile?.education && candidate.candidateProfile.education.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Education
          </h3>
          <div className="space-y-3">
            {candidate.candidateProfile.education.map((edu, i) => (
              <div key={i} className="border-l-2 border-green-300 pl-3">
                <p className="font-medium">{edu.degree} in {edu.field}</p>
                <p className="text-sm text-slate-500">{edu.institution}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resume Link */}
      {candidate.candidateProfile?.resumeUrl && (
        <div>
          <h3 className="font-semibold mb-2">Resume</h3>
          <a 
            href={candidate.candidateProfile.resumeUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            <FileText className="h-4 w-4" />
            View Resume
          </a>
        </div>
      )}
    </div>
  )
}

// Missing imports
