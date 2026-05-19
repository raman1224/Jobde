// app/recruiter/layout.tsx
"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
// import { RecruiterNav } from "@/components/recruiter/recruiter-nav"
// import { RecruiterHeader } from "@/components/recruiter/recruiter-header"
const RecruiterNav = dynamic(() => import("@/components/recruiter/recruiter-nav").then(mod => mod.RecruiterNav))
const RecruiterHeader = dynamic(() => import("@/components/recruiter/recruiter-header").then(mod => mod.RecruiterHeader))

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth/signin")
    }
    if (user && user.role !== "RECRUITER") {
      router.replace("/dashboard/candidate")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <RecruiterNav isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}>
        <RecruiterHeader user={user} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}