// app/recruiter/dashboard/page.tsx
"use client"
import { Bell } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Briefcase, Users, FileText, Clock, CheckCircle, XCircle, 
  AlertCircle, Plus, Calendar, TrendingUp, Eye, Building2,
  CreditCard, Zap, Crown, ShoppingBag
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface DashboardStats {
  freeJobPlan: string
  paidJobPlan: string
  payAsYouGo: string
  runningJobs: number
  activeApplications: number
  resumeAccess: string
  notifications: Array<{ id: string; title: string; message: string; createdAt: string }>
  runningJobsList: Array<{ id: string; title: string; applicants: number; expiresIn: string }>
  scheduledJobs: number
  pendingJobs: number
  draftedJobs: number
  expiredJobs: number
  cancelledJobs: number
}

export default function RecruiterDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch('/api/recruiter/dashboard/stats')
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            Welcome back, {user?.name}
          </h1>
          <p className="text-slate-500 mt-2">Manage your jobs, applications, and company profile</p>
        </div>

        {/* Plan Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <PlanCard 
            title="Free Job Plan" 
            status={stats?.freeJobPlan || "Inactive"}
            statusColor={stats?.freeJobPlan === "Active" ? "text-green-500" : "text-red-500"}
            icon={Zap}
            features={["2 Job Posts", "21 Days Duration", "Daily Alerts"]}
            buttonText="Activate Free Plan"
            buttonAction={() => window.location.href = '/recruiter/jobplan?plan=free'}
          />
          <PlanCard 
            title="Paid Job Plan" 
            status={stats?.paidJobPlan || "Inactive"}
            statusColor={stats?.paidJobPlan === "Active" ? "text-green-500" : "text-red-500"}
            icon={Crown}
            features={["Unlimited Posts", "Priority Support", "Featured Listings"]}
            buttonText="Upgrade to Pro"
            buttonAction={() => window.location.href = '/recruiter/jobplan?plan=paid'}
          />
          <PlanCard 
            title="Pay As You Go" 
            status={stats?.payAsYouGo || "Inactive"}
            statusColor={stats?.payAsYouGo === "Active" ? "text-green-500" : "text-red-500"}
            icon={ShoppingBag}
            features={["Pay Per Job", "Flexible Options", "No Commitment"]}
            buttonText="Buy Credits"
            buttonAction={() => window.location.href = '/recruiter/jobplan?plan=payg'}
          />
        </div>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatsCard 
            title="Running Job Post" 
            value={stats?.runningJobs || 0}
            icon={Briefcase}
            color="blue"
          />
          <StatsCard 
            title="Active Application" 
            value={stats?.activeApplications || 0}
            icon={Users}
            color="green"
          />
          <StatsCard 
            title="Resume Database Access" 
            value={stats?.resumeAccess || "Inactive"}
            icon={FileText}
            color={stats?.resumeAccess === "Active" ? "green" : "red"}
          />
        </div>

        {/* Tabs for Job Management */}
        <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="bg-white dark:bg-slate-900 border shadow-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="running">Running Jobs ({stats?.runningJobs || 0})</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled ({stats?.scheduledJobs || 0})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({stats?.pendingJobs || 0})</TabsTrigger>
            <TabsTrigger value="drafted">Drafted ({stats?.draftedJobs || 0})</TabsTrigger>
            <TabsTrigger value="expired">Expired ({stats?.expiredJobs || 0})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({stats?.cancelledJobs || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <div className="grid md:grid-cols-4 gap-4">
              <ActionCard 
                title="Post a New Job"
                description="Create a job posting"
                icon={Plus}
                color="blue"
                href="/recruiter/post-job"
              />
              <ActionCard 
                title="View Applications"
                description="Review candidates"
                icon={Eye}
                color="green"
                href="/recruiter/applications"
              />
              <ActionCard 
                title="Manage Plans"
                description="Upgrade subscription"
                icon={CreditCard}
                color="orange"
                href="/recruiter/jobplan"
              />
              <ActionCard 
                title="Company Profile"
                description="Update company info"
                icon={Building2}
                color="purple"
                href="/recruiter/company/profile"
              />
            </div>

            {/* Running Jobs List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Running Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.runningJobsList && stats.runningJobsList.length > 0 ? (
                  <div className="space-y-4">
                    {stats.runningJobsList.map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <div>
                          <h4 className="font-semibold">{job.title}</h4>
                          <div className="flex gap-4 mt-1 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {job.applicants} applicants
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Expires {job.expiresIn}
                            </span>
                          </div>
                        </div>
                        <Link href={`/recruiter/jobs/${job.id}`}>
                          <Button variant="outline" size="sm">Manage</Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                    <p className="text-slate-500">No running jobs</p>
                    <Link href="/recruiter/post-job">
                      <Button className="mt-4">Post Your First Job</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  Recent Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.notifications && stats.notifications.length > 0 ? (
                  <div className="space-y-3">
                    {stats.notifications.map((notif) => (
                      <div key={notif.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Bell className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notif.title}</p>
                          <p className="text-xs text-slate-500">{notif.message}</p>
                          <p className="text-xs text-slate-400 mt-1">{formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                    <p className="text-slate-500">No notifications yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="running">
            <JobListingsTable type="running" jobs={stats?.runningJobsList || []} />
          </TabsContent>
          <TabsContent value="scheduled">
            <JobListingsTable type="scheduled" jobs={[]} />
          </TabsContent>
          <TabsContent value="pending">
            <JobListingsTable type="pending" jobs={[]} />
          </TabsContent>
          <TabsContent value="drafted">
            <JobListingsTable type="drafted" jobs={[]} />
          </TabsContent>
          <TabsContent value="expired">
            <JobListingsTable type="expired" jobs={[]} />
          </TabsContent>
          <TabsContent value="cancelled">
            <JobListingsTable type="cancelled" jobs={[]} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Sub-components
function PlanCard({ title, status, statusColor, icon: Icon, features, buttonText, buttonAction }: any) {
  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-600 to-orange-500 opacity-10 rounded-bl-full" />
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-orange-500 flex items-center justify-center">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <Badge variant={status === "Active" ? "default" : "destructive"}>
            {status}
          </Badge>
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <ul className="space-y-1 mb-4">
          {features.map((feature: string, i: number) => (
            <li key={i} className="text-sm text-slate-500 flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
        <Button variant="outline" className="w-full" onClick={buttonAction}>
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  )
}

function StatsCard({ title, value, icon: Icon, color }: any) {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500",
    red: "from-red-500 to-pink-500",
    orange: "from-orange-500 to-yellow-500",
  }
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`h-12 w-12 rounded-full bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ActionCard({ title, description, icon: Icon, color, href }: any) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-xl transition-all cursor-pointer group">
        <CardContent className="p-4">
          <div className={`h-10 w-10 rounded-lg bg-gradient-to-r from-${color}-500 to-${color}-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <h3 className="font-semibold text-sm">{title}</h3>
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

function JobListingsTable({ type, jobs }: any) {
  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Briefcase className="h-12 w-12 mx-auto mb-3 text-slate-400" />
          <p className="text-slate-500">No {type} jobs found</p>
          <Link href="/recruiter/post-job">
            <Button className="mt-4">Post a Job</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Job Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Applicants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Posted Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Expires</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {jobs.map((job: any) => (
                <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="px-6 py-4 font-medium">{job.title}</td>
                  <td className="px-6 py-4">{job.applicants}</td>
                  <td className="px-6 py-4">{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{job.expiresIn}</td>
                  <td className="px-6 py-4">
                    <Badge variant={type === "running" ? "default" : "secondary"}>{type}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/recruiter/jobs/${job.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

