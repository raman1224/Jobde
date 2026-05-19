// app/dashboard/recruiter/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"

export default function RecruiterDashboardRedirect() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (user?.role === "RECRUITER") {
        router.replace("/recruiter/dashboard")
      } else if (user?.role === "CANDIDATE") {
        router.replace("/dashboard/candidate")
      } else {
        router.replace("/auth/signin")
      }
    }
  }, [user, isLoading, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  )
}