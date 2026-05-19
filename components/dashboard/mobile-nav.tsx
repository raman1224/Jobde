// components/dashboard/mobile-nav.tsx - FIXED
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LayoutDashboard, Briefcase, Heart, Bell, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"

export function MobileNav({ userRole }: { userRole: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const navItemsMap: Record<string, any[]> = {
    CANDIDATE: [
      { name: "Dashboard", href: "/dashboard/candidate", icon: LayoutDashboard },
      { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
      { name: "Saved Jobs", href: "/dashboard/saved-jobs", icon: Heart },
      { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
    RECRUITER: [
      { name: "Dashboard", href: "/dashboard/recruiter", icon: LayoutDashboard },
      { name: "Post Job", href: "/dashboard/post-job", icon: Briefcase },
      { name: "Applicants", href: "/dashboard/applicants", icon: Briefcase },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
    ADMIN: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Users", href: "/admin/users", icon: Briefcase },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  }

  const items = navItemsMap[userRole] || navItemsMap.CANDIDATE

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 bg-primary text-primary-foreground rounded-lg shadow-lg lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />
            
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-background z-50 shadow-2xl lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
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
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-muted">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-1">
                    {items.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>

                <div className="p-4 border-t">
                  <div className="flex items-center gap-3 mb-3 p-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold">
                        {session?.user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{session?.user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full gap-2" onClick={() => signOut()}>
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}