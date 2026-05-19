

// app/jobs/[id]/page.tsx - Complete working with apply flow
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth/auth-provider"
import { 
  Briefcase, MapPin, DollarSign, Clock, Building2, 
  Calendar, Users, Eye, Share2, Bookmark, CheckCircle,
  ArrowLeft, Loader2, UserCheck, AlertCircle, TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface Job {
  id: string
  title: string
  description: string
  requirements: string
  location: string
  locationType: string
  employmentType: string
  experienceLevel: string
  salaryMin: number
  salaryMax: number
  benefits: string[]
  applicationDeadline: string
  createdAt: string
  views: number
  company: {
    id: string
    name: string
    logo: string
    description: string
    website: string
    location: string
  }
  skills: { id: string; name: string }[]
  _count: { applications: number }
}

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const jobId = params.id as string
  
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [profileComplete, setProfileComplete] = useState(0)
  const [checkingProfile, setCheckingProfile] = useState(true)

  useEffect(() => {
    fetchJob()
    if (user) {
      checkSavedStatus()
      checkAppliedStatus()
      checkProfileCompletion()
    }
  }, [jobId, user])

  const fetchJob = async () => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`)
      if (res.ok) {
        const data = await res.json()
        setJob(data)
      } else {
        toast.error("Job not found")
        router.push("/")
      }
    } catch (error) {
      console.error("Failed to fetch job:", error)
      toast.error("Failed to load job")
    } finally {
      setLoading(false)
    }
  }

  const checkSavedStatus = async () => {
    try {
      const res = await fetch("/api/candidate/saved-jobs")
      const data = await res.json()
      const saved = data.some((sj: any) => sj.jobId === jobId || sj.job?.id === jobId)
      setIsSaved(saved)
    } catch (error) {
      console.error("Failed to check saved status:", error)
    }
  }

  const checkAppliedStatus = async () => {
    try {
      const res = await fetch("/api/candidate/applications")
      const data = await res.json()
      const applied = data.some((app: any) => app.jobId === jobId || app.job?.id === jobId)
      setHasApplied(applied)
    } catch (error) {
      console.error("Failed to check applied status:", error)
    }
  }

  const checkProfileCompletion = async () => {
    setCheckingProfile(true)
    try {
      const profileRes = await fetch("/api/candidate/profile")
      const profile = await profileRes.json()
      
      const skillsRes = await fetch("/api/candidate/skills")
      const skills = await skillsRes.json()
      
      const resumeRes = await fetch("/api/candidate/resume")
      const resume = await resumeRes.json()
      
      let completed = 0
      let total = 5
      
      if (profile.name && profile.name.trim() !== "") completed++
      if (profile.phone || profile.location) completed++
      if (profile.bio && profile.bio.length > 20) completed++
      if (skills && skills.length > 0) completed++
      if (resume.url) completed++
      
      const percentage = Math.round((completed / total) * 100)
      setProfileComplete(percentage)
      
    } catch (error) {
      console.error("Failed to check profile:", error)
      setProfileComplete(0)
    } finally {
      setCheckingProfile(false)
    }
  }

  const handleApply = async () => {
    // Step 1: Check if user is logged in
    if (!user) {
      toast.info("Please login to apply for this job", { duration: 3000 })
      sessionStorage.setItem("redirectAfterLogin", `/jobs/${jobId}`)
      router.push(`/auth/signin?redirect=/jobs/${jobId}&role=CANDIDATE`)
      return
    }

    // Step 2: Check if already applied
    if (hasApplied) {
      toast.info("You have already applied for this job")
      return
    }

    // Step 3: Check if job is expired
    if (job && new Date(job.applicationDeadline) < new Date()) {
      toast.error("This job posting has expired")
      return
    }

    // Step 4: Check if profile is complete (80% or more for applying)
    if (profileComplete < 80) {
      toast.error("Please complete your profile (at least 80%) before applying", { duration: 5000 })
      sessionStorage.setItem("redirectAfterProfile", jobId)
      router.push(`/dashboard/candidate/profile?redirect=job&jobId=${jobId}`)
      return
    }

    // Step 5: Apply for the job
    setIsApplying(true)
    toast.loading("Submitting your application...", { id: "apply" })

    try {
      const res = await fetch("/api/candidate/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      })

      const data = await res.json()

      if (res.ok) {
        setHasApplied(true)
        toast.success("Application submitted successfully!", { id: "apply", duration: 5000 })
        
        // Refresh job data
        fetchJob()
      } else {
        toast.error(data.error || "Failed to apply", { id: "apply" })
        
        // If unauthorized, redirect to login
        if (res.status === 401) {
          router.push(`/auth/signin?redirect=/jobs/${jobId}&role=CANDIDATE`)
        }
      }
    } catch (error) {
      console.error("Apply error:", error)
      toast.error("Something went wrong. Please try again.", { id: "apply" })
    } finally {
      setIsApplying(false)
    }
  }

  const handleSaveJob = async () => {
    if (!user) {
      toast.info("Please login to save jobs")
      router.push(`/auth/signin?redirect=/jobs/${jobId}&role=CANDIDATE`)
      return
    }

    try {
      if (isSaved) {
        await fetch(`/api/candidate/saved-jobs/${jobId}`, { method: "DELETE" })
        setIsSaved(false)
        toast.success("Job removed from saved")
      } else {
        await fetch("/api/candidate/saved-jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId }),
        })
        setIsSaved(true)
        toast.success("Job saved successfully")
      }
    } catch (error) {
      toast.error("Failed to save job")
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Link copied to clipboard!")
  }

  if (loading || authLoading || checkingProfile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <h2 className="text-xl font-semibold mb-2">Job Not Found</h2>
            <p className="text-slate-500 mb-4">The job you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.push("/")}>Browse Jobs</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isExpired = new Date(job.applicationDeadline) < new Date()
  const canApply = user && !hasApplied && !isExpired && profileComplete >= 80

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="h-20 w-20 rounded-xl">
                  <AvatarImage src={job.company?.logo} />
                  <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-600 to-orange-500 text-white">
                    {job.company?.name?.charAt(0) || "C"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                    <span>{job.company?.name}</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {job.views} views
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge>{job.employmentType?.replace("_", " ")}</Badge>
                    <Badge variant="outline">{job.locationType}</Badge>
                    <Badge variant="secondary">{job.experienceLevel}</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {!isExpired ? (
                      <>
                        <Button 
                          onClick={handleApply}
                          disabled={hasApplied || isApplying || !canApply}
                          className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                        >
                          {isApplying ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : hasApplied ? (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          ) : !user ? (
                            "Login to Apply"
                          ) : profileComplete < 80 ? (
                            `Complete Profile (${profileComplete}%)`
                          ) : (
                            "Apply Now"
                          )}
                        </Button>
                        <Button variant="outline" onClick={handleSaveJob} className="gap-2">
                          <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                          {isSaved ? "Saved" : "Save"}
                        </Button>
                        <Button variant="outline" onClick={handleShare} className="gap-2">
                          <Share2 className="h-4 w-4" />
                          Share
                        </Button>
                      </>
                    ) : (
                      <Button disabled variant="outline" className="text-red-500 gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Application Closed
                      </Button>
                    )}
                  </div>

                  {/* Profile Completion Status */}
                  {user && profileComplete < 80 && !hasApplied && !isExpired && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-amber-800">Profile Completion: {profileComplete}%</h3>
                        <Link href={`/dashboard/candidate/profile?redirect=job&jobId={job.id}`}>
                          <Button variant="link" className="text-amber-700">
                            Complete Profile →
                          </Button>
                        </Link>
                      </div>
                      <Progress value={profileComplete} className="h-2 mb-3" />
                      <p className="text-sm text-amber-700">Complete your profile to apply for this job (Need 80%)</p>
                    </div>
                  )}

                  {/* Login Prompt */}
                  {!user && !isExpired && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Please login to apply for this job
                      </p>
                      <Link href={`/auth/signin?redirect=/jobs/${job.id}&role=CANDIDATE`}>
                        <Button variant="link" className="text-blue-600 p-0 h-auto mt-1">
                          Login Now →
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    NPR {job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()}
                  </div>
                  <p className="text-sm text-slate-500">per year</p>
                  {!isExpired && !hasApplied && canApply && (
                    <div className="mt-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                      Ready to Apply
                    </div>
                  )}
                  {hasApplied && (
                    <div className="mt-2 text-sm text-blue-600">
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                      Application Submitted
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{job.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Requirements</h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{job.requirements}</p>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skills?.map((skill) => (
                  <Badge key={skill.id} variant="secondary" className="text-sm py-1">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Benefits & Perks</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {job.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Deadline Warning */}
          {isExpired ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-red-600 font-medium">This job posting has expired</p>
              <p className="text-sm text-red-500">Application deadline was {new Date(job.applicationDeadline).toLocaleDateString()}</p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <Calendar className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-blue-600 font-medium">Apply before {new Date(job.applicationDeadline).toLocaleDateString()}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}