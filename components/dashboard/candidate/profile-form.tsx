// components/dashboard/candidate/profile-form.tsx
"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Save, User, MapPin, Phone, Linkedin, Github, Globe, Edit2, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { useAuth } from "@/components/auth/auth-provider"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
})

type ProfileFormData = z.infer<typeof profileSchema>

export const ProfileForm = memo(function ProfileForm() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [profileCompletion, setProfileCompletion] = useState(0)
  const [uploadingImage, setUploadingImage] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
      location: "",
      bio: "",
      website: "",
      linkedin: "",
      github: "",
    },
  })

  const formValues = watch()
  const name = watch("name")
  const bio = watch("bio")

  // Calculate profile completion
  useEffect(() => {
    const fields = [name, bio]
    const filled = fields.filter(f => f && f.length > 0).length
    const completion = (filled / fields.length) * 100
    setProfileCompletion(completion)
  }, [name, bio])

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/candidate/profile")
        const data = await response.json()
        reset({
          name: data.name || user?.name || "",
          phone: data.phone || "",
          location: data.location || "",
          bio: data.bio || "",
          website: data.website || "",
          linkedin: data.linkedin || "",
          github: data.github || "",
        })
      } catch (error) {
        console.error("Failed to fetch profile:", error)
        toast.error("Failed to load profile data")
      }
    }
    fetchProfile()
  }, [reset, user])

  const onSubmit = useCallback(async (data: ProfileFormData) => {
    setIsLoading(true)
    setSaveSuccess(false)
    
    try {
      const response = await fetch("/api/candidate/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      
      if (response.ok) {
        setSaveSuccess(true)
        toast.success("Profile updated successfully!", {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          duration: 3000,
        })
        setIsEditing(false)
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        const error = await response.json()
        throw new Error(error.message || "Failed to update profile")
      }
    } catch (error) {
      toast.error("Failed to update profile", {
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB")
      return
    }

    setUploadingImage(true)
    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await fetch("/api/candidate/profile/image", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        toast.success("Profile picture updated!")
        window.location.reload()
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      toast.error("Failed to upload image")
    } finally {
      setUploadingImage(false)
    }
  }

  const isChanged = () => {
    const currentValues = formValues
    const originalValues = {
      name: user?.name || "",
      phone: "",
      location: "",
      bio: "",
      website: "",
      linkedin: "",
      github: "",
    }
    return JSON.stringify(currentValues) !== JSON.stringify(originalValues)
  }

  // Get completion color
  const getCompletionColor = () => {
    if (profileCompletion >= 80) return "bg-green-500"
    if (profileCompletion >= 50) return "bg-yellow-500"
    return "bg-blue-500"
  }

  return (
    <div className="space-y-6">
      {/* Profile Completion Card */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-2 -right-2 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  {uploadingImage ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Edit2 className="h-3 w-3" />
                  )}
                </div>
              </label>
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Profile Completion</h3>
                <span className="text-sm font-bold">{Math.round(profileCompletion)}%</span>
              </div>
              <Progress value={profileCompletion} className={getCompletionColor()} />
              <p className="text-sm text-muted-foreground">
                {profileCompletion < 50 
                  ? "Complete your profile to get better job matches" 
                  : profileCompletion < 80 
                  ? "Almost there! Add more details to stand out"
                  : "Great profile! You're ready to impress employers"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Profile Form */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                Profile Information
              </CardTitle>
              <CardDescription className="mt-1">
                Manage your personal and professional details
              </CardDescription>
            </div>
            {!isEditing && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </Button>
              </motion.div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-600 dark:text-green-400"
              >
                <CheckCircle className="h-5 w-5 animate-bounce" />
                <span className="text-sm font-medium">Profile saved successfully!</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  disabled={!isEditing || isLoading}
                  className={`transition-all duration-200 ${errors.name ? "border-destructive ring-destructive/20" : ""}`}
                />
                {errors.name && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-destructive">
                    {errors.name.message}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold">
                  <Phone className="inline h-3 w-3 mr-1" /> Phone Number
                </Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  disabled={!isEditing || isLoading}
                  placeholder="+977 1234567890"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-semibold">
                  <MapPin className="inline h-3 w-3 mr-1" /> Location
                </Label>
                <Input
                  id="location"
                  {...register("location")}
                  disabled={!isEditing || isLoading}
                  placeholder="Kathmandu, Nepal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-semibold">
                  <Globe className="inline h-3 w-3 mr-1" /> Website
                </Label>
                <Input
                  id="website"
                  {...register("website")}
                  disabled={!isEditing || isLoading}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-sm font-semibold">
                  <Linkedin className="inline h-3 w-3 mr-1 text-blue-600" /> LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  {...register("linkedin")}
                  disabled={!isEditing || isLoading}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github" className="text-sm font-semibold">
                  <Github className="inline h-3 w-3 mr-1" /> GitHub
                </Label>
                <Input
                  id="github"
                  {...register("github")}
                  disabled={!isEditing || isLoading}
                  placeholder="https://github.com/username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-semibold">Bio</Label>
              <Textarea
                id="bio"
                {...register("bio")}
                disabled={!isEditing || isLoading}
                placeholder="Tell us about yourself, your experience, and career goals..."
                className="min-h-[120px] resize-none"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  {bio?.length || 0}/500 characters
                </p>
                {bio && bio.length > 400 && (
                  <p className={`text-xs ${bio.length >= 500 ? "text-red-500" : "text-yellow-500"}`}>
                    {500 - (bio.length || 0)} characters remaining
                  </p>
                )}
              </div>
            </div>

            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 pt-4 border-t"
              >
                <Button 
                  type="submit" 
                  disabled={isLoading || !isChanged()} 
                  className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    setIsEditing(false)
                    try {
                      const response = await fetch("/api/candidate/profile")
                      const data = await response.json()
                      reset({
                        name: data.name || user?.name || "",
                        phone: data.phone || "",
                        location: data.location || "",
                        bio: data.bio || "",
                        website: data.website || "",
                        linkedin: data.linkedin || "",
                        github: data.github || "",
                      })
                    } catch (error) {
                      console.error("Failed to reset profile:", error)
                    }
                  }}
                >
                  Cancel
                </Button>
              </motion.div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
})