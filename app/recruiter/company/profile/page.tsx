// app/recruiter/company/profile/page.tsx - COMPLETE WORKING VERSION
"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth/auth-provider"
import { Building2, MapPin, Globe, Phone, Mail, Users, Calendar, Edit2, Save, X, Upload, Loader2, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface CompanyProfile {
  id: string
  name: string
  logo?: string
  website?: string
  location?: string
  address?: string
  size?: string
  industry?: string
  description?: string
  foundedYear?: number
  phone?: string
  email?: string
}

const industries = [
  "IT & Software", "Banking & Finance", "Healthcare", "Education", 
  "Manufacturing", "Retail", "Hospitality", "Construction", 
  "Real Estate", "Transportation", "Media & Entertainment", "Other"
]

const companySizes = [
  "1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"
]

export default function CompanyProfilePage() {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [formData, setFormData] = useState<Partial<CompanyProfile>>({})

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/recruiter/company/profile")
      const data = await res.json()
      setProfile(data)
      setFormData(data)
    } catch (error) {
      console.error("Failed to fetch profile:", error)
      toast.error("Failed to load company profile")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Company name is required")
      return
    }

    setSaving(true)
    setSaveSuccess(false)
    toast.loading("Saving company profile...", { id: "save" })

    try {
      const res = await fetch("/api/recruiter/company/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setProfile(data)
        setIsEditing(false)
        setSaveSuccess(true)
        toast.success("Company profile saved successfully!", { id: "save" })
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        toast.error(data.error || "Failed to update profile", { id: "save" })
      }
    } catch (error) {
      console.error("Save error:", error)
      toast.error("Something went wrong", { id: "save" })
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB")
      return
    }

    setUploadingLogo(true)
    toast.loading("Uploading logo...", { id: "logo" })

    const uploadFormData = new FormData()
    uploadFormData.append("logo", file)

    try {
      const res = await fetch("/api/recruiter/company/logo", {
        method: "POST",
        body: uploadFormData,
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setProfile(prev => prev ? { ...prev, logo: data.logoUrl } : null)
        setFormData(prev => ({ ...prev, logo: data.logoUrl }))
        toast.success("Logo uploaded successfully!", { id: "logo" })
      } else {
        toast.error(data.error || "Upload failed", { id: "logo" })
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload logo", { id: "logo" })
    } finally {
      setUploadingLogo(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                Company Profile
              </h1>
              <p className="text-slate-500 mt-1">Manage your company information and branding</p>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => {
                  setIsEditing(false)
                  setFormData(profile || {})
                }} className="gap-2">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving} className="gap-2 bg-green-600 hover:bg-green-700">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>

          {/* Success Message */}
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-600"
            >
              <CheckCircle className="h-5 w-5" />
              <span>Company profile saved successfully!</span>
            </motion.div>
          )}

          {/* Company Logo Card */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-primary/20">
                    <AvatarImage src={profile?.logo} alt={profile?.name} />
                    <AvatarFallback className="text-3xl bg-gradient-to-r from-blue-600 to-orange-500 text-white">
                      {profile?.name?.charAt(0)?.toUpperCase() || "C"}
                    </AvatarFallback>
                  </Avatar>
                  {uploadingLogo && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold">{profile?.name || "Company Name"}</h2>
                  <p className="text-slate-500">
                    {profile?.industry || "Industry"} • {profile?.size || "Company Size"} employees
                  </p>
                </div>
                
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="gap-2"
                  >
                    {uploadingLogo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {uploadingLogo ? "Uploading..." : "Upload Logo"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Company Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  {isEditing ? (
                    <Input 
                      value={formData.name || ""} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., TechCorp Nepal"
                    />
                  ) : (
                    <p className="text-slate-700 dark:text-slate-300">{profile?.name || "-"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Industry</Label>
                  {isEditing ? (
                    <Select 
                      value={formData.industry || ""} 
                      onValueChange={(v) => setFormData({ ...formData, industry: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map(ind => (
                          <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-slate-700 dark:text-slate-300">{profile?.industry || "-"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Company Size</Label>
                  {isEditing ? (
                    <Select 
                      value={formData.size || ""} 
                      onValueChange={(v) => setFormData({ ...formData, size: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        {companySizes.map(size => (
                          <SelectItem key={size} value={size}>{size} employees</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-slate-700 dark:text-slate-300">{profile?.size ? `${profile.size} employees` : "-"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Founded Year</Label>
                  {isEditing ? (
                    <Input 
                      type="number" 
                      value={formData.foundedYear || ""} 
                      onChange={(e) => setFormData({ ...formData, foundedYear: parseInt(e.target.value) })}
                      placeholder="e.g., 2020"
                    />
                  ) : (
                    <p className="text-slate-700 dark:text-slate-300">{profile?.foundedYear || "-"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    <Globe className="inline h-3 w-3 mr-1" /> Website
                  </Label>
                  {isEditing ? (
                    <Input 
                      value={formData.website || ""} 
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://yourcompany.com"
                    />
                  ) : (
                    <p className="text-slate-700 dark:text-slate-300">
                      {profile?.website ? (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {profile.website}
                        </a>
                      ) : "-"}
                    </p>
                  )}
                </div>

                {/* <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    <Mail className="inline h-3 w-3 mr-1" /> Email
                  </Label>
                  {isEditing ? (
                    <Input 
                      value={formData.email || ""} 
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contact@company.com"
                    />
                  ) : (
                    <p className="text-slate-700 dark:text-slate-300">{profile?.email || "-"}</p>
                  )}
                </div> */}

                {/* <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    <Phone className="inline h-3 w-3 mr-1" /> Phone
                  </Label>
                  {isEditing ? (
                    <Input 
                      value={formData.phone || ""} 
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+977 1-1234567"
                    />
                  ) : (
                    <p className="text-slate-700 dark:text-slate-300">{profile?.phone || "-"}</p>
                  )}
                </div> */}

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    <MapPin className="inline h-3 w-3 mr-1" /> Location
                  </Label>
                  {isEditing ? (
                    <Input 
                      value={formData.location || ""} 
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Kathmandu, Nepal"
                    />
                  ) : (
                    <p className="text-slate-700 dark:text-slate-300">{profile?.location || "-"}</p>
                  )}
                </div>
              </div>

              {/* <div className="space-y-2">
                <Label className="text-sm font-semibold">Address</Label>
                {isEditing ? (
                  <Textarea 
                    value={formData.address || ""} 
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Full company address"
                    rows={2}
                  />
                ) : (
                  <p className="text-slate-700 dark:text-slate-300">{profile?.address || "-"}</p>
                )}
              </div> */}

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Company Description</Label>
                {isEditing ? (
                  <Textarea 
                    value={formData.description || ""} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tell candidates about your company, culture, and values..."
                    rows={4}
                  />
                ) : (
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{profile?.description || "-"}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Next Step Button */}
          {!isEditing && profile?.name && profile?.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex justify-end"
            >
              <Button 
                onClick={() => window.location.href = "/recruiter/jobplan"}
                className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 gap-2"
              >
                Continue to Job Plans
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}