// app/dashboard/interviews/page.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Calendar, Clock, Video, Phone, MapPin, 
  Briefcase, Users, CheckCircle, XCircle, 
  AlertCircle, ExternalLink
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
  job: {
    id: string
    title: string
    company: { name: string; logo?: string }
  }
}

export default function CandidateInterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("upcoming")

  useEffect(() => {
    fetchInterviews()
  }, [])

  const fetchInterviews = async () => {
    try {
      const res = await fetch("/api/candidate/interviews")
      const data = await res.json()
      setInterviews(Array.isArray(data) ? data : [])
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
      case "RESCHEDULED":
        return <Badge className="bg-yellow-500">Rescheduled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "VIDEO": return <Video className="h-4 w-4" />
      case "PHONE": return <Phone className="h-4 w-4" />
      case "ONSITE": return <MapPin className="h-4 w-4" />
      default: return <Video className="h-4 w-4" />
    }
  }

  const upcomingInterviews = interviews.filter(i => i.status === "SCHEDULED")
  const pastInterviews = interviews.filter(i => i.status === "COMPLETED" || i.status === "CANCELLED")

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-lg mb-4" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            My Interviews
          </h1>
          <p className="text-slate-500 mt-1">Track and manage your upcoming interviews</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{upcomingInterviews.length}</p>
              <p className="text-sm text-slate-500">Upcoming Interviews</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{pastInterviews.length}</p>
              <p className="text-sm text-slate-500">Completed Interviews</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-900">
            <TabsTrigger value="upcoming">Upcoming ({upcomingInterviews.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastInterviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingInterviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-semibold mb-2">No upcoming interviews</h3>
                  <p className="text-slate-500">When you get shortlisted, interviews will appear here</p>
                </CardContent>
              </Card>
            ) : (
              upcomingInterviews.map((interview, index) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold">{interview.job?.title}</h3>
                              <p className="text-slate-500">{interview.job?.company?.name}</p>
                            </div>
                            {getStatusBadge(interview.status)}
                          </div>

                          <div className="flex flex-wrap gap-4 mt-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">
                                {new Date(interview.scheduledFor).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-blue-500" />
                              <span>{new Date(interview.scheduledFor).toLocaleTimeString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              {getTypeIcon(interview.type)}
                              <span>{interview.type}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4" />
                              <span>{interview.duration} minutes</span>
                            </div>
                          </div>

                          {interview.location && (
                            <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                              <p className="text-sm flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {interview.location}
                              </p>
                            </div>
                          )}

                          {interview.meetingLink && (
                            <div className="mt-3">
                              <a 
                                href={interview.meetingLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Join Meeting
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/jobs/${interview.job?.id}`}>
                            <Button variant="outline" size="sm">
                              View Job
                            </Button>
                          </Link>
                          {interview.meetingLink && (
                            <Button className="bg-gradient-to-r from-blue-600 to-orange-500" size="sm">
                              Join Now
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

          <TabsContent value="past" className="space-y-4">
            {pastInterviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-lg font-semibold mb-2">No past interviews</h3>
                  <p className="text-slate-500">Completed interviews will appear here</p>
                </CardContent>
              </Card>
            ) : (
              pastInterviews.map((interview, index) => (
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
                          <h3 className="text-lg font-semibold">{interview.job?.title}</h3>
                          <p className="text-slate-500">{interview.job?.company?.name}</p>
                          <p className="text-sm text-slate-400 mt-2">
                            {new Date(interview.scheduledFor).toLocaleDateString()}
                          </p>
                        </div>
                        {getStatusBadge(interview.status)}
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