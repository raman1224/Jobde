// app/admin/layout.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { AdminNav } from "@/components/admin/admin-nav"
import { AdminHeader } from "@/components/admin/admin-header"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ADMIN")) {
      router.replace("/admin/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
      </div>
    )
  }

  if (!user || user.role !== "ADMIN") return null

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminNav isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}>
        <AdminHeader user={user} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}