// app/recruiter/analytics/page.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  TrendingUp, Users, Briefcase, Eye, Calendar, 
  Download, Filter, ArrowUp, ArrowDown, Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

interface AnalyticsData {
  totalJobs: number
  totalApplications: number
  totalViews: number
  averageMatchScore: number
  applicationsByDay: { date: string; count: number }[]
  jobsByStatus: { status: string; count: number }[]
  topPerformingJobs: { title: string; applications: number; views: number }[]
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("7d")

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/recruiter/analytics?period=${period}`)
      const analytics = await res.json()
      setData(analytics)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-lg" />)}
          </div>
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    )
  }

  const stats = [
    { title: "Total Jobs", value: data?.totalJobs || 0, icon: Briefcase, trend: "+12%", color: "blue" },
    { title: "Applications", value: data?.totalApplications || 0, icon: Users, trend: "+23%", color: "green" },
    { title: "Total Views", value: data?.totalViews || 0, icon: Eye, trend: "+45%", color: "purple" },
    { title: "Avg Match Score", value: `${data?.averageMatchScore || 0}%`, icon: TrendingUp, trend: "+5%", color: "orange" },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-slate-500 mt-1">Track your hiring performance and metrics</p>
          </div>
          <div className="flex gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[150px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                        <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                          <ArrowUp className="h-3 w-3" />
                          {stat.trend}
                        </div>
                      </div>
                      <div className={`h-10 w-10 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 text-${stat.color}-600`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Top Performing Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Top Performing Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 font-medium">Job Title</th>
                    <th className="text-left py-3 font-medium">Applications</th>
                    <th className="text-left py-3 font-medium">Views</th>
                    <th className="text-left py-3 font-medium">Conversion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.topPerformingJobs?.map((job, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-3 font-medium">{job.title}</td>
                      <td className="py-3">{job.applications}</td>
                      <td className="py-3">{job.views}</td>
                      <td className="py-3">
                        {Math.round((job.applications / job.views) * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}