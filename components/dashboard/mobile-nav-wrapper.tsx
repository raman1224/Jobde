// components/dashboard/mobile-nav-wrapper.tsx - FIXED
"use client"
import dynamic from "next/dynamic"
import { useSession } from "next-auth/react"
import { MobileNav } from "./mobile-nav"
import { useEffect, useState } from "react"
// const  {MobileNav} = dynamic(() => import("./mobile-nav"), { ssr: false })
export function MobileNavWrapper() {
  const { data: session, status } = useSession()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Don't render if loading, not mobile, or no session
  if (status === "loading") return null
  if (!isMobile) return null
  if (!session?.user) return null

  return <MobileNav userRole={session.user.role} />
}

