// components/dashboard/candidate-nav.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth/auth-provider"
import { 
  LayoutDashboard, Briefcase, FileText, Heart, 
  Calendar, MessageSquare, Bell, User, Settings, 
  LogOut, ChevronLeft, ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard/candidate", icon: LayoutDashboard },
  { title: "Browse Jobs", href: "/dashboard/jobs", icon: Briefcase },
  { title: "My Applications", href: "/dashboard/applications", icon: FileText },
  { title: "Saved Jobs", href: "/dashboard/saved-jobs", icon: Heart },
  { title: "My Profile", href: "/dashboard/candidate/profile", icon: User },
  { title: "Interviews", href: "/dashboard/interviews", icon: Calendar },
  { title: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { title: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { title: "My Profile", href: "/dashboard/candidate/profile", icon: User },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function CandidateNav({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean; setIsCollapsed: (value: boolean) => void }) {
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
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-orange-500 mx-auto" />
        )}
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
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
                  <div
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
                      <span className="text-sm font-medium truncate">{item.title}</span>
                    )}
                  </div>
                </Link>
              </motion.li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={() => logout()}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 w-full",
            isCollapsed ? "justify-center" : "",
            "text-red-500 hover:bg-red-500/10 hover:text-red-600"
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )
}