// // components/layout/navbar.tsx
// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { motion, AnimatePresence } from "framer-motion"
// import { useTheme } from "next-themes"
// import { useAuth } from "@/components/auth/auth-provider"
// import { Button } from "@/components/ui/button"
// import { 
//   Search, Menu, X, Briefcase, Users, GraduationCap, 
//   Globe, MessageCircle, BookOpen, Moon, Sun, Bell, Sparkles, 
//   FileText,
//   Heart,
//   Calendar,
//   MessageSquare,
//   Settings,
//   User
// } from "lucide-react"
// import { ThemeToggle } from "@/components/theme-toggle"
// import Image from "next/image"

// const navLinks = [
//   { name: "Job Search", href: "/jobs", icon: Search, description: "Find your dream job" },
//   // { name: "People Search", href: "/people", icon: Users, description: "Connect with professionals" },
//   { name: "Career Advice", href: "/career-advice", icon: GraduationCap, description: "Expert guidance" },
//   { name: "Community", href: "/community", icon: MessageCircle, description: "Join discussions" },
//   // { name: "Job Learning", href: "/learning", icon: BookOpen, description: "Upskill yourself" },
//   { name: "Find Jobs", href: "/dashboard/candidate?tab=jobs", icon: Briefcase },
//   { name: "Applications", href: "/dashboard/candidate?tab=applications", icon: FileText },
//   // { name: "Saved Jobs", href: "/dashboard/candidate?tab=saved", icon: Heart },
//   // { name: "Interviews", href: "/dashboard/candidate?tab=interviews", icon: Calendar },
  // { name: "Messages", href: "/dashboard/candidate?tab=messages", icon: MessageSquare },
  // { name: "Notifications", href: "/dashboard/candidate?tab=notifications", icon: Bell },
  // // { name: "Profile", href: "/dashboard/candidate/profile", icon: User },
  // { name: "Settings", href: "/dashboard/candidate/settings", icon: Settings },

// ]

// export function Navbar() {
//   const { user, isLoading } = useAuth()
//   const { theme } = useTheme()
//   const [isScrolled, setIsScrolled] = useState(false)
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 10)
//     window.addEventListener("scroll", handleScroll)
//     return () => window.removeEventListener("scroll", handleScroll)
//   }, [])

//   return (
//     <>
//       <motion.nav
//         initial={{ y: -100 }}
//         animate={{ y: 0 }}
//         transition={{ type: "spring", stiffness: 100 }}
//         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
//           isScrolled 
//             ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-2xl border-b border-slate-200/20 dark:border-slate-800/20" 
//             : "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md"
//         }`}
//       >
//         <div className="container mx-auto px-4">
//           <div className=" flex items-center justify-between h-16">
           
//             <Link href="/" className="  flex items-center gap-3 group">
  
//   {/* Logo */}
//   <motion.div
//     whileHover={{ scale: 1.08, rotate: 3 }}
//     transition={{ duration: 0.3 }}
//     className="relative  flex items-center justify-center"
//   >
//     <Image
//       src="/logo.png"
//       alt="Jobde Logo"
//       width={52}
//       height={52}
//       priority
//       className="rounded-full object-contain drop-shadow-xl"
//     />
//   </motion.div>

//   {/* Brand Name */}
//   <motion.div
//     initial={{ opacity: 0, x: -10 }}
//     animate={{ opacity: 1, x: 0 }}
//     transition={{ duration: 0.4 }}
//     className="flex flex-col leading-none"
//   >
//     <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 via-blue-600 to-orange-500 bg-clip-text text-transparent">
//       Jobde
//     </span>

//   </motion.div>
// </Link>

//             {/* Desktop Navigation with Dropdowns */}
//             <div className="hidden lg:flex items-center ml-4 gap-1">
//               {navLinks.map((link) => (
//                 <div
//                   key={link.name}
//                   className="relative"
//                   onMouseEnter={() => setActiveDropdown(link.name)}
//                   onMouseLeave={() => setActiveDropdown(null)}
//                 >
//                   <Link
//                     href={link.href}
//                     className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
//                   >
//                     <link.icon className="h-4 w-4" />
//                     {link.name}
//                   </Link>
                  
//                   <AnimatePresence>
//                     {activeDropdown === link.name && (
//                       <motion.div
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: 10 }}
//                         className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
//                       >
//                         {/* <div className="p-2">
//                           <p className="text-xs text-slate-500 px-3 py-1">{link.description}</p>
//                           <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
//                           <Link href={`${link.href}/trending`} className="block px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
//                             Trending
//                           </Link>
//                           <Link href={`${link.href}/nearby`} className="block px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
//                             Nearby
//                           </Link>
//                           <Link href={`${link.href}/saved`} className="block px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
//                             Saved
//                           </Link>
//                         </div> */}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               ))}
//             </div>

//             {/* Right Section */}
//             <div className="hidden lg:flex items-center gap-3">
//               {/* Search Button */}
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
//               >
//                 <Search className="h-5 w-5 text-slate-600 dark:text-slate-300" />
//               </motion.button>

//               {/* Theme Toggle */}
//               <ThemeToggle />

//               {/* Bell Icon for Notifications (if logged in) */}
//               {user && (
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
//                 >
//                   <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
//                   <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
//                 </motion.button>
//               )}

//               {/* Auth Buttons */}
//               {!isLoading && !user ? (
//                 <>
//                   <Link href="/auth/signin">
//                     <Button variant="ghost" className="text-slate-600 dark:text-slate-300">
//                       Login
//                     </Button>
//                   </Link>
//                   <Link href="/auth/signup">
//                     <motion.div
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       <Button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all gap-2">
//                         <Sparkles className="h-4 w-4" />
//                         Join Now
//                       </Button>
//                     </motion.div>
//                   </Link>
//                 </>
//               ) : user ? (
//                 <Link href="/dashboard">
//                   <Button variant="outline" className="gap-2">
//                     <User className="h-4 w-4" />
//                     Dashboard
//                   </Button>
//                 </Link>
//               ) : (
//                 <div className="h-9 w-9 rounded-full bg-slate-200 animate-pulse" />
//               )}
//             </div>

//             {/* Mobile Menu Button */}
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
//             >
//               <AnimatePresence mode="wait">
//                 {isMobileMenuOpen ? (
//                   <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
//                     <X className="h-5 w-5" />
//                   </motion.div>
//                 ) : (
//                   <motion.div key="menu" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
//                     <Menu className="h-5 w-5" />
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </button>
//           </div>
//         </div>
//       </motion.nav>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="fixed top-16 left-0 right-0 bg-white dark:bg-slate-950 shadow-2xl z-40 lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto"
//           >
//             <div className="container mx-auto px-4 py-4">
//               <div className="flex flex-col gap-2">
//                 {navLinks.map((link, i) => (
//                   <motion.div
//                     key={link.name}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: i * 0.05 }}
//                   >
//                     <Link
//                       href={link.href}
//                       onClick={() => setIsMobileMenuOpen(false)}
//                       className="flex items-center gap-3 px-3 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
//                     >
//                       <link.icon className="h-5 w-5" />
//                       <div>
//                         <p className="font-medium">{link.name}</p>
//                         <p className="text-xs text-slate-400">{link.description}</p>
//                       </div>
//                     </Link>
//                   </motion.div>
//                 ))}
                
//                 <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />
                
//                 <div className="flex items-center justify-between px-3 py-3">
//                   <span className="text-sm text-slate-600 dark:text-slate-300">Theme</span>
//                   <ThemeToggle />
//                 </div>
                
//                 {!user ? (
//                   <>
//                     <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
//                       <Button variant="ghost" className="w-full justify-start">Login</Button>
//                     </Link>
//                     <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
//                       <Button className="w-full bg-gradient-to-r from-blue-600 to-orange-500">Join Now</Button>
//                     </Link>
//                   </>
//                 ) : (
//                   <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
//                     <Button variant="outline" className="w-full">Dashboard</Button>
//                   </Link>
//                 )}
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   )
// }



// components/layout/navbar.tsx - REDESIGNED NO DROPDOWNS
"use client"

import { useState, useEffect, useCallback, memo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { 
  Menu, X, Briefcase, Users, GraduationCap, 
  MessageCircle, BookOpen, Search, Bell, User, Settings, MessageSquare,
  Sparkles, LogIn, UserPlus
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

// Simple nav links - NO DROPDOWNS
const navLinks = [
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Companies", href: "/companies", icon: Users },
  { name: "Career Advice", href: "/career-advice", icon: GraduationCap },
  { name: "About", href: "/about", icon: MessageCircle },
  { name: "Messages", href: "/dashboard/candidate?tab=messages", icon: MessageSquare },
  { name: "Notifications", href: "/dashboard/candidate?tab=notifications", icon: Bell },
  { name: "Profile", href: "/dashboard/candidate/profile", icon: User },
  { name: "Settings", href: "/dashboard/candidate/settings", icon: Settings },

]

export const Navbar = memo(function Navbar() {
  const { user, isLoading } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    checkDevice()
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener("resize", checkDevice)
    window.addEventListener("scroll", handleScroll)
    
    return () => {
      window.removeEventListener("resize", checkDevice)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (!user) return "/auth/signin"
    if (user.role === "ADMIN") return "/admin/dashboard"
    if (user.role === "RECRUITER") return "/recruiter/dashboard"
    return "/dashboard/candidate"
  }

  const getDashboardText = () => {
    if (!user) return "Sign In"
    if (user.role === "ADMIN") return "Admin"
    if (user.role === "RECRUITER") return "Dashboard"
    return "Dashboard"
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-lg border-b" 
            : "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-9 w-9 rounded-xl bg-gradient-to-r from-blue-600 to-orange-500 flex items-center justify-center shadow-lg"
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
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                Jobde
              </span>
            </Link>

            {/* Desktop Navigation - Simple links, no dropdowns */}
            {isDesktop && (
              <div className="hidden lg:flex items-center gap-1">
                {navLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Right Section */}
            {isDesktop && (
              <div className="hidden lg:flex items-center gap-3">
                <ThemeToggle />
                
                {!isLoading && !user ? (
                  <>
                    <Link href="/auth/signin">
                      <Button variant="ghost" className="gap-2">
                        <LogIn className="h-4 w-4" />
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white shadow-lg gap-2">
                        <UserPlus className="h-4 w-4" />
                        Join Now
                      </Button>
                    </Link>
                  </>
                ) : user ? (
                  <Link href={getDashboardLink()}>
                    <Button variant="outline" className="gap-2">
                      <User className="h-4 w-4" />
                      {getDashboardText()}
                    </Button>
                  </Link>
                ) : (
                  <div className="h-9 w-24 bg-slate-200 animate-pulse rounded-lg" />
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            {!isDesktop && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {!isDesktop && isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 bg-white dark:bg-slate-950 shadow-2xl z-40 max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-2">
                {navLinks.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-3 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
                
                <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />
                
                <div className="flex items-center justify-between px-3 py-3">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Theme</span>
                  <ThemeToggle />
                </div>
                
                {!user ? (
                  <>
                    <Link href="/auth/signin" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <LogIn className="h-4 w-4" />
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/signup" onClick={closeMobileMenu}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-orange-500 gap-2">
                        <UserPlus className="h-4 w-4" />
                        Join Now
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href={getDashboardLink()} onClick={closeMobileMenu}>
                    <Button variant="outline" className="w-full gap-2">
                      <User className="h-4 w-4" />
                      {getDashboardText()}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
})