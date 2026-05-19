// app/recruiter/interviews/page.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Calendar, Clock, Video, Phone, MapPin, 
  Users, CheckCircle, XCircle, Clock as ClockIcon,
  Plus, Video as VideoIcon
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"

interface Interview {
  id: string
  applicationId: string
  scheduledFor: string
  duration: number
  type: string
  meetingLink?: string
  location?: string
  status: string
  candidate: {
    id: string
    name: string
    email: string
    image?: string
  }
  job: {
    id: string
    title: string
  }
}

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("upcoming")

  useEffect(() => {
    fetchInterviews()
  }, [])

  const fetchInterviews = async () => {
    try {
      const res = await fetch("/api/recruiter/interviews")
      const data = await res.json()
      setInterviews(data)
    } catch (error) {
      console.error("Failed to fetch interviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return <Badge className="bg-blue-500">Scheduled</Badge>
      case "COMPLETED":
        return <Badge className="bg-green-500">Completed</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "VIDEO": return <Video className="h-4 w-4" />
      case "PHONE": return <Phone className="h-4 w-4" />
      case "ONSITE": return <MapPin className="h-4 w-4" />
      default: return <VideoIcon className="h-4 w-4" />
    }
  }

  const filteredInterviews = interviews.filter(i => {
    if (activeTab === "upcoming") return i.status === "SCHEDULED"
    if (activeTab === "completed") return i.status === "COMPLETED"
    return true
  })

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Interviews
            </h1>
            <p className="text-slate-500 mt-1">Schedule and manage candidate interviews</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Schedule Interview
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming ({interviews.filter(i => i.status === "SCHEDULED").length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({interviews.filter(i => i.status === "COMPLETED").length})</TabsTrigger>
            <TabsTrigger value="all">All ({interviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredInterviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-semibold mb-2">No interviews scheduled</h3>
                  <p className="text-slate-500 mb-4">Schedule interviews with your shortlisted candidates</p>
                  <Button>Schedule Interview</Button>
                </CardContent>
              </Card>
            ) : (
              filteredInterviews.map((interview, index) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{interview.candidate?.name}</h3>
                              <p className="text-slate-500">{interview.job?.title}</p>
                            </div>
                            {getStatusBadge(interview.status)}
                          </div>

                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(interview.scheduledFor).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {new Date(interview.scheduledFor).toLocaleTimeString()} ({interview.duration} min)
                            </div>
                            <div className="flex items-center gap-1">
                              {getTypeIcon(interview.type)}
                              {interview.type}
                            </div>
                          </div>

                          {interview.meetingLink && (
                            <a 
                              href={interview.meetingLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                            >
                              Join Meeting →
                            </a>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Reschedule</Button>
                          <Button variant="outline" size="sm" className="text-red-500">Cancel</Button>
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