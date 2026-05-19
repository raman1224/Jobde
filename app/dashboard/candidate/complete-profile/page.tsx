// app/dashboard/candidate/complete-profile/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { 
  User, Mail, Phone, MapPin, Briefcase, 
  GraduationCap, Code, FileText, Upload, 
  Save, Loader2, CheckCircle, ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useAuth } from "@/components/auth/auth-provider"

export default function CompleteProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const jobId = searchParams.get("jobId")
  const { user } = useAuth()
  
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  })
  
  const [skills, setSkills] = useState<string[]>([])
  const [currentSkill, setCurrentSkill] = useState("")
  
  const [experience, setExperience] = useState([{
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  }])
  
  const [education, setEducation] = useState([{
    degree: "",
    institution: "",
    field: "",
    startDate: "",
    endDate: "",
    current: false,
  }])
  
  const [resume, setResume] = useState<File | null>(null)
  const [resumeUrl, setResumeUrl] = useState("")

  useEffect(() => {
    if (user) {
      setBasicInfo(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }))
    }
  }, [user])

  const addSkill = () => {
    if (currentSkill && !skills.includes(currentSkill)) {
      setSkills([...skills, currentSkill])
      setCurrentSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill))
  }

  const addExperience = () => {
    setExperience([...experience, {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }])
  }

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...experience]
    updated[index] = { ...updated[index], [field]: value }
    setExperience(updated)
  }

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index))
  }

  const addEducation = () => {
    setEducation([...education, {
      degree: "",
      institution: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
    }])
  }

  const updateEducation = (index: number, field: string, value: any) => {
    const updated = [...education]
    updated[index] = { ...updated[index], [field]: value }
    setEducation(updated)
  }

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index))
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    setResume(file)
    
    const formData = new FormData()
    formData.append("resume", file)
    
    try {
      const res = await fetch("/api/candidate/resume/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      setResumeUrl(data.url)
      toast.success("Resume uploaded successfully")
    } catch (error) {
      toast.error("Failed to upload resume")
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    toast.loading("Saving profile...", { id: "save" })
    
    try {
      // Save basic info
      await fetch("/api/candidate/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(basicInfo),
      })
      
      // Save skills
      await fetch("/api/candidate/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills }),
      })
      
      // Save experience
      await fetch("/api/candidate/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experience }),
      })
      
      // Save education
      await fetch("/api/candidate/education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ education }),
      })
      
      toast.success("Profile saved successfully!", { id: "save" })
      
      // If applying to a job, redirect to apply
      if (jobId) {
              window.location.href = `/jobs/${jobId}`

        // await fetch("/api/candidate/applications", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ jobId, resumeUrl }),
        // })
        // router.push(`/jobs/${jobId}?applied=true`)
      } else {
        router.push("/dashboard/candidate")
      }
    } catch (error) {
      toast.error("Failed to save profile", { id: "save" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Complete Your Profile
            </h1>
            <p className="text-slate-500 mt-2">
              {jobId ? "Complete your profile to apply for this job" : "Help employers find the best match for you"}
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="resume">Resume</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name *</Label>
                      <Input value={basicInfo.name} onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })} />
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input type="email" value={basicInfo.email} onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })} />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input value={basicInfo.phone} onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })} />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input value={basicInfo.location} onChange={(e) => setBasicInfo({ ...basicInfo, location: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label>Bio / Summary</Label>
                    <Textarea rows={4} value={basicInfo.bio} onChange={(e) => setBasicInfo({ ...basicInfo, bio: e.target.value })} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-blue-600" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Add a skill (e.g., JavaScript, React)"
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    />
                    <Button type="button" onClick={addSkill}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                      <Badge key={skill} className="flex items-center gap-1">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-red-500">×</button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experience">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    Work Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">Experience #{index + 1}</h3>
                        {index > 0 && (
                          <Button variant="ghost" size="sm" onClick={() => removeExperience(index)}>Remove</Button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <Input placeholder="Job Title" value={exp.title} onChange={(e) => updateExperience(index, "title", e.target.value)} />
                        <Input placeholder="Company" value={exp.company} onChange={(e) => updateExperience(index, "company", e.target.value)} />
                        <Input placeholder="Location" value={exp.location} onChange={(e) => updateExperience(index, "location", e.target.value)} />
                        <Input type="date" placeholder="Start Date" value={exp.startDate} onChange={(e) => updateExperience(index, "startDate", e.target.value)} />
                        {!exp.current && (
                          <Input type="date" placeholder="End Date" value={exp.endDate} onChange={(e) => updateExperience(index, "endDate", e.target.value)} />
                        )}
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(index, "current", e.target.checked)} />
                          I currently work here
                        </label>
                      </div>
                      <Textarea placeholder="Job Description" value={exp.description} onChange={(e) => updateExperience(index, "description", e.target.value)} rows={3} />
                    </div>
                  ))}
                  <Button variant="outline" onClick={addExperience} className="w-full">+ Add Experience</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">Education #{index + 1}</h3>
                        {index > 0 && (
                          <Button variant="ghost" size="sm" onClick={() => removeEducation(index)}>Remove</Button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <Input placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(index, "degree", e.target.value)} />
                        <Input placeholder="Institution" value={edu.institution} onChange={(e) => updateEducation(index, "institution", e.target.value)} />
                        <Input placeholder="Field of Study" value={edu.field} onChange={(e) => updateEducation(index, "field", e.target.value)} />
                        <Input type="date" placeholder="Start Date" value={edu.startDate} onChange={(e) => updateEducation(index, "startDate", e.target.value)} />
                        {!edu.current && (
                          <Input type="date" placeholder="End Date" value={edu.endDate} onChange={(e) => updateEducation(index, "endDate", e.target.value)} />
                        )}
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={edu.current} onChange={(e) => updateEducation(index, "current", e.target.checked)} />
                          Currently studying
                        </label>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addEducation} className="w-full">+ Add Education</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resume">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Upload Resume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-sm text-slate-500 mb-2">Upload your resume (PDF format, max 5MB)</p>
                    <Input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" id="resume-upload" />
                    <Button onClick={() => document.getElementById("resume-upload")?.click()}>
                      Choose File
                    </Button>
                    {resume && <p className="mt-4 text-sm text-green-600">✓ {resume.name} uploaded</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-8">
            <Button onClick={handleSubmit} disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-orange-500">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save & Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}