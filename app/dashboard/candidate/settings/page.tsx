// app/dashboard/candidate/settings/page.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth/auth-provider"
import { 
  User, Bell, Shield, Mail, Phone, MapPin, 
  Save, Loader2, Eye, EyeOff, Globe, Linkedin, Github
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

export default function SettingsPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
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
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    jobAlerts: true,
    applicationUpdates: true,
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/candidate/profile")
      const data = await res.json()
      setProfile({
        name: data.name || user?.name || "",
        email: data.email || user?.email || "",
        phone: data.phone || "",
        location: data.location || "",
        bio: data.bio || "",
        website: data.website || "",
        linkedin: data.linkedin || "",
        github: data.github || "",
      })
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/candidate/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })
      if (res.ok) {
        toast.success("Profile updated successfully")
      } else {
        toast.error("Failed to update profile")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-slate-500 mt-1">Manage your account preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" />Profile</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" />Notifications</TabsTrigger>
            <TabsTrigger value="social" className="gap-2"><Globe className="h-4 w-4" />Social Links</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-orange-500 text-white text-xl">
                      {profile.name?.charAt(0) || user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">Change Photo</Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Bio</Label>
                  <textarea
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full p-3 border rounded-lg dark:bg-slate-900"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <Button onClick={handleSave} disabled={isLoading} className="gap-2">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Alerts</p>
                    <p className="text-sm text-slate-500">Receive email notifications</p>
                  </div>
                  <Switch checked={notifications.emailAlerts} onCheckedChange={(v) => setNotifications({ ...notifications, emailAlerts: v })} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Job Alerts</p>
                    <p className="text-sm text-slate-500">Get job recommendations</p>
                  </div>
                  <Switch checked={notifications.jobAlerts} onCheckedChange={(v) => setNotifications({ ...notifications, jobAlerts: v })} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Application Updates</p>
                    <p className="text-sm text-slate-500">Status changes on your applications</p>
                  </div>
                  <Switch checked={notifications.applicationUpdates} onCheckedChange={(v) => setNotifications({ ...notifications, applicationUpdates: v })} />
                </div>
                <Button onClick={() => toast.success("Preferences saved")}>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Social Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                <Button onClick={handleSave} disabled={isLoading} className="gap-2">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Links
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}