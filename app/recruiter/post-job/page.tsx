// app/recruiter/post-job/page.tsx - COMPLETE WORKING VERSION
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Briefcase, MapPin, DollarSign, Clock, Calendar, FileText, 
  Plus, X, Save, Sparkles, CheckCircle, Loader2, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const jobTypes = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"]
const locationTypes = ["ONSITE", "REMOTE", "HYBRID"]
const experienceLevels = ["ENTRY", "JUNIOR", "MID", "SENIOR", "LEAD", "EXECUTIVE"]
const skillsList = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", 
  "Django", "Java", "Spring Boot", "AWS", "Docker", "Kubernetes",
  "MongoDB", "PostgreSQL", "GraphQL", "Tailwind CSS", "Machine Learning",
  "Figma", "UI/UX", "Project Management", "SEO", "Digital Marketing"
]

export default function PostJobPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [skills, setSkills] = useState<string[]>([])
  const [benefits, setBenefits] = useState<string[]>([])
  const [currentSkill, setCurrentSkill] = useState("")
  const [currentBenefit, setCurrentBenefit] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    locationType: "ONSITE",
    employmentType: "FULL_TIME",
    experienceLevel: "MID",
    salaryMin: "",
    salaryMax: "",
    applicationDeadline: "",
  })

  // Fetch company ID on load
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch("/api/recruiter/company/profile")
        const data = await res.json()
        if (data && data.id) {
          setCompanyId(data.id)
        } else {
          toast.error("Company profile not found. Please complete your company profile first.")
          router.push("/recruiter/company/profile")
        }
      } catch (error) {
        console.error("Failed to fetch company:", error)
        toast.error("Failed to load company information")
      }
    }
    fetchCompany()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const errors = []
    if (!formData.title) errors.push("Job title")
    if (!formData.description) errors.push("Job description")
    if (!formData.requirements) errors.push("Requirements")
    if (!formData.location) errors.push("Location")
    if (!formData.salaryMin) errors.push("Minimum salary")
    if (!formData.salaryMax) errors.push("Maximum salary")
    if (!formData.applicationDeadline) errors.push("Application deadline")
    if (skills.length === 0) errors.push("At least one skill")
    
    if (errors.length > 0) {
      toast.error(`Please fill: ${errors.join(", ")}`)
      return
    }

    if (parseInt(formData.salaryMin) >= parseInt(formData.salaryMax)) {
      toast.error("Minimum salary must be less than maximum salary")
      return
    }

    if (!companyId) {
      toast.error("Company profile not found. Please setup your company first.")
      router.push("/recruiter/company/profile")
      return
    }

    setIsLoading(true)
    toast.loading("Posting job...", { id: "post-job" })

    try {
      const payload = {
        ...formData,
        companyId,
        skills,
        benefits,
        salaryMin: parseInt(formData.salaryMin),
        salaryMax: parseInt(formData.salaryMax),
        applicationDeadline: new Date(formData.applicationDeadline).toISOString(),
      }

      console.log("Sending payload:", payload)

      const response = await fetch("/api/recruiter/jobs/create", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      console.log("Response:", data)

      if (response.ok) {
        toast.success("Job posted successfully!", { id: "post-job" })
        router.push("/recruiter/manage-jobs")
      } else {
        toast.error(data.error || "Failed to post job", { id: "post-job" })
      }
    } catch (error) {
      console.error("Post job error:", error)
      toast.error("Something went wrong. Check console for details.", { id: "post-job" })
    } finally {
      setIsLoading(false)
    }
  }

  const addSkill = () => {
    if (currentSkill && !skills.includes(currentSkill)) {
      setSkills([...skills, currentSkill])
      setCurrentSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill))
  }

  const addBenefit = () => {
    if (currentBenefit && !benefits.includes(currentBenefit)) {
      setBenefits([...benefits, currentBenefit])
      setCurrentBenefit("")
    }
  }

  const removeBenefit = (benefit: string) => {
    setBenefits(benefits.filter(b => b !== benefit))
  }

  if (!companyId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-xl font-semibold mb-2">Company Profile Required</h2>
            <p className="text-slate-500 mb-4">Please complete your company profile before posting jobs.</p>
            <Button onClick={() => router.push("/recruiter/company/profile")}>
              Complete Company Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Post a New Job
            </h1>
            <p className="text-slate-500 mt-1">Fill in the details below to reach thousands of candidates</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Job Title *</Label>
                  <Input
                    placeholder="e.g., Senior Frontend Developer"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Location *</Label>
                    <Input
                      placeholder="e.g., Kathmandu, Nepal"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Location Type *</Label>
                    <Select value={formData.locationType} onValueChange={(v) => setFormData({ ...formData, locationType: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {locationTypes.map(loc => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Employment Type *</Label>
                    <Select value={formData.employmentType} onValueChange={(v) => setFormData({ ...formData, employmentType: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.map(type => (
                          <SelectItem key={type} value={type}>{type.replace("_", " ")}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Experience Level *</Label>
                    <Select value={formData.experienceLevel} onValueChange={(v) => setFormData({ ...formData, experienceLevel: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Minimum Salary (NPR) *</Label>
                    <Input
                      type="number"
                      placeholder="30000"
                      value={formData.salaryMin}
                      onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Maximum Salary (NPR) *</Label>
                    <Input
                      type="number"
                      placeholder="50000"
                      value={formData.salaryMax}
                      onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Job Description *</Label>
                  <Textarea
                    placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Requirements *</Label>
                  <Textarea
                    placeholder="List the required skills, experience, and qualifications..."
                    rows={4}
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Required Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <select
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900"
                  >
                    <option value="">Select a skill...</option>
                    {skillsList.filter(s => !skills.includes(s)).map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                  <Button type="button" onClick={addSkill} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <Badge key={skill} className="flex items-center gap-1 px-3 py-1">
                      {skill}
                      <X className="h-3 w-3 cursor-pointer ml-1" onClick={() => removeSkill(skill)} />
                    </Badge>
                  ))}
                </div>
                {skills.length === 0 && (
                  <p className="text-sm text-slate-500 mt-2">Add at least 3-5 skills for better matching</p>
                )}
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  Benefits & Perks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="e.g., Health Insurance, Remote Work, etc."
                    value={currentBenefit}
                    onChange={(e) => setCurrentBenefit(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addBenefit()}
                  />
                  <Button type="button" onClick={addBenefit} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {benefits.map(benefit => (
                    <Badge key={benefit} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                      {benefit}
                      <X className="h-3 w-3 cursor-pointer ml-1" onClick={() => removeBenefit(benefit)} />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Deadline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Application Deadline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
                <p className="text-sm text-slate-500 mt-2">Applications will close after this date</p>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || !companyId}
                className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {isLoading ? "Posting..." : "Post Job"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}