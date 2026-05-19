// components/dashboard/mobile-nav-wrapper.tsx - FIXED (No NextAuth)
"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { MobileNav } from "./mobile-nav"

export function MobileNavWrapper() {
  const { user, isLoading } = useAuth()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Don't render if loading, not mobile, or no user
  if (isLoading) return null
  if (!isMobile) return null
  if (!user) return null

  return <MobileNav userRole={user.role} />
}