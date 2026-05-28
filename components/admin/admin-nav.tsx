// components/admin/admin-nav.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  Bell,
  Settings,
  Shield,
  BarChart3,
  FileText,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"

const navItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Jobs", href: "/admin/jobs", icon: Briefcase },
  { title: "Companies", href: "/admin/companies", icon: Building2 },
  { title: "Applications", href: "/admin/applications", icon: FileText },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Reports", href: "/admin/reports", icon: TrendingUp },
  { title: "Notifications", href: "/admin/notifications", icon: Bell },
  { title: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminNav({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean; setIsCollapsed: (value: boolean) => void }) {
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
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-red-600 to-purple-600" />
            <span className="font-bold text-lg bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
              Admin Panel
            </span>
          </Link>
        ) : (
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-red-600 to-purple-600 mx-auto" />
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
                        ? "bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-md"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span className="text-sm font-medium truncate">{item.title}</span>}
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