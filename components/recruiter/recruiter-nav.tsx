// components/recruiter/recruiter-nav.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  CreditCard,
  Settings,
  BarChart3,
  Calendar,
  MessageSquare,
  Bell,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/recruiter/dashboard", icon: LayoutDashboard },
  { title: "Post a Job", href: "/recruiter/post-job", icon: Briefcase },
  { title: "Manage Jobs", href: "/recruiter/manage-jobs", icon: FileText },
  { title: "Applications", href: "/recruiter/applications", icon: Users },
  { title: "Company Profile", href: "/recruiter/company/profile", icon: Building2 },
  { title: "Job Plans", href: "/recruiter/jobplan", icon: CreditCard },
  { title: "Analytics", href: "/recruiter/analytics", icon: BarChart3 },
  { title: "Interviews", href: "/recruiter/interviews", icon: Calendar },
  { title: "Messages", href: "/recruiter/messages", icon: MessageSquare },
  { title: "Notifications", href: "/recruiter/notifications", icon: Bell },
  { title: "Settings", href: "/recruiter/settings", icon: Settings },
]

interface RecruiterNavProps {
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
}

export function RecruiterNav({ isCollapsed, setIsCollapsed }: RecruiterNavProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-white dark:bg-slate-950 border-r shadow-lg z-30 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b h-16">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-orange-500" />
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                Jobde
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-orange-500 mx-auto"
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

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
            
            return (
              <motion.li
                key={item.href}
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
                        ? "bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-md"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
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
      </div>
    </aside>
  )
}