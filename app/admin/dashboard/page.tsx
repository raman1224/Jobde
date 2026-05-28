// app/admin/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, Briefcase, Building2, FileText, 
  TrendingUp, Eye, CheckCircle, XCircle,
  Calendar, Activity, DollarSign
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardStats {
  totalUsers: number
  totalRecruiters: number
  totalCandidates: number
  totalJobs: number
  activeJobs: number
  totalApplications: number
  totalCompanies: number
  verifiedCompanies: number
  monthlyGrowth: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats")
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-lg" />)}
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    )
  }

  const statCards = [
    { title: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "from-blue-500 to-cyan-500" },
    { title: "Job Seekers", value: stats?.totalCandidates || 0, icon: Users, color: "from-green-500 to-emerald-500" },
    { title: "Recruiters", value: stats?.totalRecruiters || 0, icon: Briefcase, color: "from-purple-500 to-pink-500" },
    { title: "Companies", value: stats?.totalCompanies || 0, icon: Building2, color: "from-orange-500 to-red-500" },
    { title: "Total Jobs", value: stats?.totalJobs || 0, icon: Briefcase, color: "from-blue-500 to-indigo-500" },
    { title: "Active Jobs", value: stats?.activeJobs || 0, icon: CheckCircle, color: "from-green-500 to-teal-500" },
    { title: "Applications", value: stats?.totalApplications || 0, icon: FileText, color: "from-yellow-500 to-amber-500" },
    { title: "Growth", value: `${stats?.monthlyGrowth || 0}%`, icon: TrendingUp, color: "from-red-500 to-orange-500" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-slate-500 mt-1">Platform overview and management</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Activity Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-600" />
            Recent Platform Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-center py-8">Activity feed will appear here</p>
        </CardContent>
      </Card>
    </div>
  )
}