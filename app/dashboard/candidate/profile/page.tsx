// app/dashboard/candidate/profile/page.tsx - COMPLETE WITH REDIRECT
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Code, FileText, Save, Trash2, Plus, X, Edit2,
  Linkedin, Github, Globe, Calendar, CheckCircle, AlertCircle,
  Loader2, Upload, Eye, Building2, School, Award, ArrowLeft
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
 
// Data for dropdowns
const DEGREES = [
  "Bachelor of Science (BSc)", "Bachelor of Arts (BA)", "Bachelor of Engineering (BE)",
  "Bachelor of Technology (BTech)", "Bachelor of Business Administration (BBA)",
  "Master of Science (MSc)", "Master of Arts (MA)", "Master of Business Administration (MBA)",
  "Master of Engineering (ME)", "PhD", "Diploma", "Certificate", "High School", "Other"
]

const FIELDS = [
  "Computer Science", "Information Technology", "Software Engineering", "Data Science",
  "Artificial Intelligence", "Business Administration", "Finance", "Marketing",
  "Accounting", "Civil Engineering", "Mechanical Engineering", "Electrical Engineering",
  "Electronics", "Communication", "Nursing", "Medicine", "Law", "Architecture"
]

const UNIVERSITIES = [
  "Tribhuvan University", "Kathmandu University", "Purbanchal University",
  "Pokhara University", "Nepal Engineering College", "Himalaya College of Engineering",
  "Kathmandu College of Management", "Nepal College of Information Technology",
  "Asian School of Management", "Ace Institute of Management", "Kantipur Engineering College",
  "Advanced College of Engineering", "Janamaitri Multiple Campus", "Nepal Commerce Campus",
  "Padma Kanya Multiple Campus", "St. Xavier's College", "Other"
]

const COMPANIES = [
  "Google", "Microsoft", "Amazon", "Meta", "Netflix", "Apple", "TechCorp Nepal",
  "CloudFactory", "Leapfrog Technology", "Deerwalk Services", "Fusemachines",
  "Cotiviti Nepal", "LogPoint", "Verisk Nepal", "Jobde", "Other"
]

const JOB_TITLES = [
  "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "DevOps Engineer", "Data Scientist", "Product Manager", "Project Manager",
  "UI/UX Designer", "QA Engineer", "System Analyst", "Database Administrator",
  "Network Engineer", "Security Analyst", "Mobile Developer", "Tech Lead",
  "Engineering Manager", "CTO", "Other"
]

interface Experience {
  id?: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface Education {
  id?: string
  degree: string
  institution: string
  field: string
  startDate: string
  endDate: string
  current: boolean
}

export default function CandidateProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectToJob = searchParams.get("redirect") === "job"
  const jobId = searchParams.get("jobId")
  
  const [activeTab, setActiveTab] = useState("basic")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profileComplete, setProfileComplete] = useState(0)

  // Profile State
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    website: "",
    linkedin: "",
    github: "",
  })

  // Skills State
  const [skills, setSkills] = useState<{ id: string; name: string }[]>([])
  const [newSkill, setNewSkill] = useState("")

  // Experience State
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [showExpForm, setShowExpForm] = useState(false)
  const [editingExp, setEditingExp] = useState<Experience | null>(null)

  // Education State
  const [educations, setEducations] = useState<Education[]>([])
  const [showEduForm, setShowEduForm] = useState(false)
  const [editingEdu, setEditingEdu] = useState<Education | null>(null)

  // Resume State
  const [resumeUrl, setResumeUrl] = useState("")
  const [resumeName, setResumeName] = useState("")
  const [uploadingResume, setUploadingResume] = useState(false)

  const skillSuggestions = [
    "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python",
    "Java", "Spring Boot", "AWS", "Docker", "Kubernetes", "MongoDB",
    "PostgreSQL", "GraphQL", "Tailwind CSS", "Figma", "UI/UX", "Project Management"
  ]

  useEffect(() => {
    fetchAllData()
  }, [])

  useEffect(() => {
    calculateCompletion()
  }, [profile, skills, experiences, educations, resumeUrl])

  const fetchAllData = async () => {
    setIsLoading(true)
    try {
      const profileRes = await fetch("/api/candidate/profile")
      const profileData = await profileRes.json()
      setProfile({
        name: profileData.name || user?.name || "",
        email: profileData.email || user?.email || "",
        phone: profileData.phone || "",
        location: profileData.location || "",
        bio: profileData.bio || "",
        website: profileData.website || "",
        linkedin: profileData.linkedin || "",
        github: profileData.github || "",
      })

      const skillsRes = await fetch("/api/candidate/skills")
      const skillsData = await skillsRes.json()
      setSkills(Array.isArray(skillsData) ? skillsData : [])

      const expRes = await fetch("/api/candidate/experience")
      const expData = await expRes.json()
      setExperiences(Array.isArray(expData) ? expData : [])

      const eduRes = await fetch("/api/candidate/education")
      const eduData = await eduRes.json()
      setEducations(Array.isArray(eduData) ? eduData : [])

      const resumeRes = await fetch("/api/candidate/resume")
      const resumeData = await resumeRes.json()
      setResumeUrl(resumeData.url || "")
      setResumeName(resumeData.name || "")
    } catch (error) {
      console.error("Failed to fetch data:", error)
      toast.error("Failed to load profile data")
    } finally {
      setIsLoading(false)
    }
  }

  const calculateCompletion = () => {
    let completed = 0
    let total = 7
    
    if (profile.name && profile.name.trim() !== "") completed++
    if (profile.phone || profile.location) completed++
    if (profile.bio && profile.bio.length > 20) completed++
    if (skills.length > 0) completed++
    if (experiences.length > 0) completed++
    if (educations.length > 0) completed++
    if (resumeUrl) completed++
    
    let percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    if (percentage > 100) percentage = 100
    setProfileComplete(percentage)
  }

  const saveProfile = async () => {
    setIsSaving(true)
    toast.loading("Saving profile...", { id: "save" })

    try {
      const res = await fetch("/api/candidate/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })

      if (res.ok) {
        toast.success("Profile saved!", { id: "save" })
        calculateCompletion()
        
        // Redirect to job if profile is complete and we came from a job
        if (profileComplete === 100 && redirectToJob && jobId) {
          toast.success("Profile complete! Redirecting to job...")
          setTimeout(() => {
            router.push(`/jobs/${jobId}`)
          }, 1500)
        }
      } else {
        toast.error("Failed to save", { id: "save" })
      }
    } catch (error) {
      toast.error("Something went wrong", { id: "save" })
    } finally {
      setIsSaving(false)
    }
  }

  const addSkill = async () => {
    if (!newSkill.trim()) {
      toast.error("Please enter a skill")
      return
    }

    try {
      const res = await fetch("/api/candidate/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSkill }),
      })

      if (res.ok) {
        const skill = await res.json()
        setSkills([...skills, skill])
        setNewSkill("")
        toast.success("Skill added")
        calculateCompletion()
      } else {
        toast.error("Failed to add skill")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const removeSkill = async (skillId: string) => {
    try {
      await fetch(`/api/candidate/skills/${skillId}`, { method: "DELETE" })
      setSkills(skills.filter(s => s.id !== skillId))
      toast.success("Skill removed")
      calculateCompletion()
    } catch (error) {
      toast.error("Failed to remove skill")
    }
  }

  const addExperience = async (exp: Experience) => {
    try {
      const res = await fetch("/api/candidate/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exp),
      })

      if (res.ok) {
        const newExp = await res.json()
        setExperiences([...experiences, newExp])
        setShowExpForm(false)
        toast.success("Experience added")
        calculateCompletion()
      } else {
        toast.error("Failed to add experience")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const updateExperience = async (exp: Experience) => {
    try {
      const res = await fetch(`/api/candidate/experience/${exp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exp),
      })

      if (res.ok) {
        setExperiences(experiences.map(e => e.id === exp.id ? exp : e))
        setEditingExp(null)
        setShowExpForm(false)
        toast.success("Experience updated")
        calculateCompletion()
      } else {
        toast.error("Failed to update experience")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const deleteExperience = async (id: string) => {
    if (!confirm("Delete this experience?")) return
    try {
      await fetch(`/api/candidate/experience/${id}`, { method: "DELETE" })
      setExperiences(experiences.filter(e => e.id !== id))
      toast.success("Experience deleted")
      calculateCompletion()
    } catch (error) {
      toast.error("Failed to delete")
    }
  }

  const addEducation = async (edu: Education) => {
    try {
      const res = await fetch("/api/candidate/education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(edu),
      })

      if (res.ok) {
        const newEdu = await res.json()
        setEducations([...educations, newEdu])
        setShowEduForm(false)
        toast.success("Education added")
        calculateCompletion()
      } else {
        toast.error("Failed to add education")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const updateEducation = async (edu: Education) => {
    try {
      const res = await fetch(`/api/candidate/education/${edu.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(edu),
      })

      if (res.ok) {
        setEducations(educations.map(e => e.id === edu.id ? edu : e))
        setEditingEdu(null)
        setShowEduForm(false)
        toast.success("Education updated")
        calculateCompletion()
      } else {
        toast.error("Failed to update education")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  const deleteEducation = async (id: string) => {
    if (!confirm("Delete this education?")) return
    try {
      await fetch(`/api/candidate/education/${id}`, { method: "DELETE" })
      setEducations(educations.filter(e => e.id !== id))
      toast.success("Education deleted")
      calculateCompletion()
    } catch (error) {
      toast.error("Failed to delete")
    }
  }

  const uploadResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file")
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }
    
    setUploadingResume(true)
    const formData = new FormData()
    formData.append("resume", file)
    
    try {
      const res = await fetch("/api/candidate/resume/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        setResumeUrl(data.url)
        setResumeName(file.name)
        toast.success("Resume uploaded successfully")
        calculateCompletion()
      } else {
        toast.error(data.error || "Upload failed")
      }
    } catch (error) {
      toast.error("Failed to upload resume")
    } finally {
      setUploadingResume(false)
    }
  }

  const deleteResume = async () => {
    if (!confirm("Delete your resume?")) return
    try {
      await fetch("/api/candidate/resume", { method: "DELETE" })
      setResumeUrl("")
      setResumeName("")
      toast.success("Resume deleted")
      calculateCompletion()
    } catch (error) {
      toast.error("Failed to delete resume")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back Button - Only show when coming from job */}
        {redirectToJob && jobId && (
          <button
            onClick={() => router.push(`/jobs/${jobId}`)}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Job
          </button>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-slate-500 mt-1">Complete your profile to get better job matches</p>
          {redirectToJob && jobId && (
            <p className="text-sm text-blue-600 mt-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Complete your profile to apply for this job
            </p>
          )}
        </div>

        {/* Profile Completion */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-20 w-20 border-4 border-primary/20">
                <AvatarImage src={user?.image} />
                <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-600 to-orange-500 text-white">
                  {profile.name?.charAt(0) || user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl font-semibold">{profile.name || user?.name || "Complete Your Profile"}</h2>
                <p className="text-slate-500">{profile.email || user?.email}</p>
              </div>
              <div className="w-full md:w-64">
                <div className="flex justify-between text-sm mb-1">
                  <span>Profile Completion</span>
                  <span className="font-semibold text-blue-600">{profileComplete}%</span>
                </div>
                <Progress value={profileComplete} className="h-2" />
                <p className="text-xs text-slate-400 mt-1 text-center">
                  {profileComplete === 100 ? "✅ Ready to apply!" : `Need ${100 - profileComplete}% more`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Profile Information
              </span>
              <Button onClick={saveProfile} disabled={isSaving} className="gap-2 bg-gradient-to-r from-blue-600 to-orange-500">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="resume">Resume</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+977 XXXXXXXXX" />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} placeholder="Kathmandu, Nepal" />
                  </div>
                  <div>
                    <Label>Website</Label>
                    <Input value={profile.website} onChange={(e) => setProfile({ ...profile, website: e.target.value })} placeholder="https://yourwebsite.com" />
                  </div>
                  <div>
                    <Label>LinkedIn</Label>
                    <Input value={profile.linkedin} onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })} placeholder="https://linkedin.com/in/username" />
                  </div>
                  <div>
                    <Label>GitHub</Label>
                    <Input value={profile.github} onChange={(e) => setProfile({ ...profile, github: e.target.value })} placeholder="https://github.com/username" />
                  </div>
                </div>
                <div>
                  <Label>Bio / Summary</Label>
                  <Textarea rows={4} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Tell employers about yourself..." />
                </div>
              </TabsContent>

              {/* Skills Tab */}
              <TabsContent value="skills" className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Add a skill (e.g., JavaScript, React)"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                      className="pl-10"
                      list="skill-suggestions"
                    />
                    <datalist id="skill-suggestions">
                      {skillSuggestions.map(skill => <option key={skill} value={skill} />)}
                    </datalist>
                  </div>
                  <Button onClick={addSkill} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[100px]">
                  {skills.map((skill) => (
                    <Badge key={skill.id} className="flex items-center gap-1 px-3 py-1.5 text-sm">
                      {skill.name}
                      <button onClick={() => removeSkill(skill.id)} className="ml-1 hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {skills.length === 0 && (
                    <p className="text-slate-400 text-center w-full py-4">No skills added yet.</p>
                  )}
                </div>
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience" className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{exp.title}</h3>
                        <p className="text-sm text-slate-500">{exp.company} • {exp.location}</p>
                        <p className="text-xs text-slate-400">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</p>
                        <p className="text-sm mt-2">{exp.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setEditingExp(exp); setShowExpForm(true); }}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteExperience(exp.id!)} className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {(showExpForm || editingExp) && (
                  <ExperienceForm
                    experience={editingExp}
                    onSave={editingExp ? updateExperience : addExperience}
                    onCancel={() => { setShowExpForm(false); setEditingExp(null); }}
                  />
                )}
                
                {!showExpForm && !editingExp && (
                  <Button variant="outline" onClick={() => setShowExpForm(true)} className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    Add Experience
                  </Button>
                )}
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education" className="space-y-4">
                {educations.map((edu) => (
                  <div key={edu.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{edu.degree}</h3>
                        <p className="text-sm text-slate-500">{edu.institution} • {edu.field}</p>
                        <p className="text-xs text-slate-400">{edu.startDate} - {edu.current ? "Present" : edu.endDate}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => { setEditingEdu(edu); setShowEduForm(true); }}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteEducation(edu.id!)} className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {(showEduForm || editingEdu) && (
                  <EducationForm
                    education={editingEdu}
                    onSave={editingEdu ? updateEducation : addEducation}
                    onCancel={() => { setShowEduForm(false); setEditingEdu(null); }}
                  />
                )}
                
                {!showEduForm && !editingEdu && (
                  <Button variant="outline" onClick={() => setShowEduForm(true)} className="w-full gap-2">
                    <Plus className="h-4 w-4" />
                    Add Education
                  </Button>
                )}
              </TabsContent>

              {/* Resume Tab */}
              <TabsContent value="resume" className="space-y-4">
                {resumeUrl ? (
                  <div className="text-center p-8 border-2 border-green-200 rounded-lg bg-green-50">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                    <h3 className="font-semibold text-lg">Resume Uploaded</h3>
                    <p className="text-sm text-slate-500 mb-4">{resumeName}</p>
                    <div className="flex gap-3 justify-center">
                      <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="gap-2">
                          <Eye className="h-4 w-4" />
                          View Resume
                        </Button>
                      </a>
                      <Button onClick={deleteResume} variant="outline" className="gap-2 text-red-500">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-12 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-lg font-semibold mb-2">Upload Your Resume</h3>
                    <p className="text-sm text-slate-500 mb-4">PDF format, max 5MB</p>
                    <input type="file" accept=".pdf" onChange={uploadResume} className="hidden" id="resume-upload" />
                    <Button onClick={() => document.getElementById("resume-upload")?.click()} disabled={uploadingResume} className="gap-2">
                      {uploadingResume ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      Choose File
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Experience Form Component
function ExperienceForm({ experience, onSave, onCancel }: any) {
  const [form, setForm] = useState(experience || {
    title: "", company: "", location: "", startDate: "", endDate: "", current: false, description: ""
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="p-4 border rounded-lg space-y-4 bg-slate-50">
      <h3 className="font-semibold">{experience ? "Edit Experience" : "Add Experience"}</h3>
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <Label>Job Title</Label>
          <Select value={form.title} onValueChange={(v) => setForm({ ...form, title: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select job title" />
            </SelectTrigger>
            <SelectContent>
              {JOB_TITLES.map(title => <SelectItem key={title} value={title}>{title}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Company</Label>
          <Select value={form.company} onValueChange={(v) => setForm({ ...form, company: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {COMPANIES.map(company => <SelectItem key={company} value={company}>{company}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <Input type="date" placeholder="Start Date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
        {!form.current && <Input type="date" placeholder="End Date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />}
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.current} onChange={(e) => setForm({ ...form, current: e.target.checked })} />
          I currently work here
        </label>
      </div>
      <Textarea placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}

// Education Form Component
function EducationForm({ education, onSave, onCancel }: any) {
  const [form, setForm] = useState(education || {
    degree: "", institution: "", field: "", startDate: "", endDate: "", current: false
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="p-4 border rounded-lg space-y-4 bg-slate-50">
      <h3 className="font-semibold">{education ? "Edit Education" : "Add Education"}</h3>
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <Label>Degree</Label>
          <Select value={form.degree} onValueChange={(v) => setForm({ ...form, degree: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select degree" />
            </SelectTrigger>
            <SelectContent>
              {DEGREES.map(degree => <SelectItem key={degree} value={degree}>{degree}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Field of Study</Label>
          <Select value={form.field} onValueChange={(v) => setForm({ ...form, field: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              {FIELDS.map(field => <SelectItem key={field} value={field}>{field}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Institution</Label>
          <Select value={form.institution} onValueChange={(v) => setForm({ ...form, institution: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select institution" />
            </SelectTrigger>
            <SelectContent>
              {UNIVERSITIES.map(uni => <SelectItem key={uni} value={uni}>{uni}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Input type="date" placeholder="Start Date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
        {!form.current && <Input type="date" placeholder="End Date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />}
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.current} onChange={(e) => setForm({ ...form, current: e.target.checked })} />
          Currently studying
        </label>
      </div>
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}