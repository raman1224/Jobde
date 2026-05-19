



// components/dashboard/dashboard-nav.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Briefcase, FileText, Users, Settings, BarChart3,
  Heart, Bell, Building2, Calendar, MessageSquare, Shield,
  ChevronLeft, ChevronRight, LogOut,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"
import Image from "next/image"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  roles: string[]
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard/candidate", icon: LayoutDashboard, roles: ["CANDIDATE"] },
  { title: "Dashboard", href: "/dashboard/recruiter", icon: LayoutDashboard, roles: ["RECRUITER"] },
  { title: "Browser Jobs", href: "/dashboard/jobs", icon: Briefcase, roles: ["CANDIDATE"] },
  { title: "Applications", href: "/dashboard/applications", icon: FileText, roles: ["CANDIDATE"] },
  { title: "My Profile", href: "/dashboard/candidate/profile", icon: User, roles: ["CANDIDATE"] },
  { title: "Saved Jobs", href: "/dashboard/saved-jobs", icon: Heart, roles: ["CANDIDATE"] },
  { title: "Post Job", href: "/dashboard/post-job", icon: Briefcase, roles: ["RECRUITER"] },
  { title: "Manage Jobs", href: "/dashboard/manage-jobs", icon: Briefcase, roles: ["RECRUITER"] },
  { title: "Applicants", href: "/dashboard/applicants", icon: Users, roles: ["RECRUITER"] },
  { title: "Company", href: "/dashboard/company", icon: Building2, roles: ["RECRUITER"] },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3, roles: ["RECRUITER", "ADMIN"] },
  { title: "Interviews", href: "/dashboard/interviews", icon: Calendar, roles: ["CANDIDATE", "RECRUITER"] },
  { title: "Messages", href: "/dashboard/messages", icon: MessageSquare, roles: ["CANDIDATE", "RECRUITER"] },
  { title: "Notifications", href: "/dashboard/notifications", icon: Bell, roles: ["CANDIDATE", "RECRUITER", "ADMIN"] },
  { title: "Admin", href: "/admin", icon: Shield, roles: ["ADMIN"] },
  { title: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["CANDIDATE", "RECRUITER", "ADMIN"] },
]

interface DashboardNavProps {
  userRole: string
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
}

export function DashboardNav({ userRole, isCollapsed, setIsCollapsed }: DashboardNavProps) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const filteredItems = navItems.filter((item) => item.roles.includes(userRole))
  const uniqueItems = filteredItems.filter((item, index, self) => 
    index === self.findIndex((t) => t.title === item.title && t.href === item.href)
  )

  if (!isMounted) return null

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-card/95 backdrop-blur-sm border-r shadow-lg z-30 transition-all duration-300 hidden md:flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b h-16">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
                       <Link href="/" className="  flex items-center gap-3 group">
  
  {/* Logo */}
  <motion.div
    whileHover={{ scale: 1.08, rotate: 3 }}
    transition={{ duration: 0.3 }}
    className="relative  flex items-center justify-center"
  >
    <Image
      src="/logo.png"
      alt="Jobde Logo"
      width={52}
      height={52}
      priority
      className="rounded-full object-contain drop-shadow-xl"
    />
  </motion.div>

  {/* Brand Name */}
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col leading-none"
  >
    <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 via-blue-600 to-orange-500 bg-clip-text text-transparent">
      Jobde
    </span>

  </motion.div>
</Link>

          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"
            />
          )}
        </AnimatePresence>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <motion.div animate={{ rotate: isCollapsed ? 0 : 180 }} transition={{ duration: 0.3 }}>
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </motion.div>
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {uniqueItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")

            return (
              <motion.li
                key={`${item.href}-${item.title}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    title={isCollapsed ? item.title : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer group",
                      isCollapsed && "justify-center px-2",
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-medium truncate"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </motion.div>
                </Link>
              </motion.li>
            )
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => logout()}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 w-full",
            isCollapsed ? "justify-center" : "",
            "text-red-500 hover:bg-red-500/10 hover:text-red-600"
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-medium"
            >
              Logout
            </motion.span>
          )}
        </motion.button>

        {!isCollapsed && (
          <div className="mt-4 px-3 py-2 rounded-lg bg-muted">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Role</p>
            <p className="text-sm font-semibold capitalize mt-0.5">{userRole?.toLowerCase() || "user"}</p>
          </div>
        )}
      </div>
    </aside>
  )
}