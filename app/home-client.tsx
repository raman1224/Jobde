
// // app/home-client.tsx - FIXED JOBS DISPLAY
// "use client"

// import dynamic from "next/dynamic"
// import { useState, useRef } from "react"
// import { motion, useScroll, useTransform } from "framer-motion"
// // import { JobCard } from "@/components/job-card"
// const JobCard = dynamic(() => import("@/components/job-card").then(mod => mod.JobCard))
// import { Briefcase, ArrowRight } from "lucide-react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// const Navbar = dynamic(() => import("@/components/layout/navbar").then(mod => mod.Navbar))
// const HeroSection = dynamic(() => import("@/components/home/hero-section").then(mod => mod.HeroSection))
// const SearchSection = dynamic(() => import("@/components/home/search-section").then(mod => mod.SearchSection))
// const CategorySection = dynamic(() => import("@/components/home/category-section").then(mod => mod.CategorySection))
// const TrustedCompanies = dynamic(() => import("@/components/home/trusted-companies").then(mod => mod.TrustedCompanies))
// const CTASection = dynamic(() => import("@/components/home/cta-section").then(mod => mod.CTASection))
// const Footer = dynamic(() => import("@/components/layout/footer").then(mod => mod.Footer))
// const Toaster = dynamic(() => import("@/components/ui/toaster").then(mod => mod.Toaster))

// export default function HomeClient({ initialJobs, stats }: any) {
//   const containerRef = useRef<HTMLDivElement>(null)
//   const { scrollYProgress } = useScroll({ target: containerRef })
//   const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

//   // Ensure jobs is always an array
//   const jobs = Array.isArray(initialJobs) ? initialJobs : []

//   return (
//     <div ref={containerRef} className="min-h-screen">
//       <Navbar />
      
//       <motion.main style={{ opacity }} className="relative">
//         <HeroSection stats={stats} onSearch={() => {}} />
//         <SearchSection onSearch={() => {}} />
//         <CategorySection categories={{}} onCategoryClick={() => {}} activeCategory={null} />
        
//         {/* Latest Jobs Section */}
//         <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
//           <div className="container mx-auto px-4">
//             <div className="text-center mb-12">
//               <h2 className="text-3xl md:text-4xl font-bold mb-4">
//                 Latest <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">Jobs</span>
//               </h2>
//               <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
//                 Discover your next career opportunity from top companies in Nepal
//               </p>
//             </div>
            
//             {jobs.length === 0 ? (
//               <div className="text-center py-12">
//                 <Briefcase className="h-12 w-12 mx-auto mb-4 text-slate-400" />
//                 <h3 className="text-lg font-semibold mb-2">No jobs available</h3>
//                 <p className="text-slate-500">Check back later for new opportunities</p>
//               </div>
//             ) : (
//               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {jobs.map((job: any) => (
//                   <JobCard key={job.id} job={job} />
//                 ))}
//               </div>
//             )}
            
//             {jobs.length > 0 && (
//               <div className="text-center mt-12">
//                 <Link href="/jobs">
//                   <Button variant="outline" size="lg" className="gap-2">
//                     Browse All Jobs
//                     <ArrowRight className="h-4 w-4" />
//                   </Button>
//                 </Link>
//               </div>
//             )}
//           </div>
//         </section>
        
//         <TrustedCompanies />
//         <CTASection />
//       </motion.main>
      
//       <Footer />
//       <Toaster />
//     </div>
//   )
// }
// app/home-client.tsx - UPDATED with better UI
"use client"

import dynamic from "next/dynamic"
import { useState, useRef, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Briefcase, ArrowRight, Sparkles, TrendingUp, Clock, MapPin, DollarSign } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

const Navbar = dynamic(() => import("@/components/layout/navbar").then(mod => mod.Navbar))
const HeroSection = dynamic(() => import("@/components/home/hero-section").then(mod => mod.HeroSection))
const SearchSection = dynamic(() => import("@/components/home/search-section").then(mod => mod.SearchSection))
const CategorySection = dynamic(() => import("@/components/home/category-section").then(mod => mod.CategorySection))
const TrustedCompanies = dynamic(() => import("@/components/home/trusted-companies").then(mod => mod.TrustedCompanies))
const CTASection = dynamic(() => import("@/components/home/cta-section").then(mod => mod.CTASection))
const Footer = dynamic(() => import("@/components/layout/footer").then(mod => mod.Footer))
const Toaster = dynamic(() => import("@/components/ui/toaster").then(mod => mod.Toaster))

// Job Card Component with animations
function JobCard({ job, index }: { job: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 to-orange-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <Badge variant="outline" className="text-xs">
              {job.employmentType?.replace("_", " ")}
            </Badge>
          </div>

          <Link href={`/jobs/${job.id}`}>
            <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {job.title}
            </h3>
          </Link>
          <p className="text-sm text-slate-500 mb-3">{job.company?.name}</p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="h-4 w-4" />
              {job.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <DollarSign className="h-4 w-4" />
              NPR {job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="h-4 w-4" />
              Posted {new Date(job.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills?.slice(0, 3).map((skill: any) => (
              <Badge key={skill.name} variant="secondary" className="text-xs">
                {skill.name}
              </Badge>
            ))}
          </div>

          <Link href={`/jobs/${job.id}`}>
            <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
              View Details
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Loading Skeleton
function JobsSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-12 w-12 rounded-xl mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function HomeClient({ initialJobs, stats }: any) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const jobs = Array.isArray(initialJobs) ? initialJobs : []

  return (
    <div ref={containerRef} className="min-h-screen">
      <Navbar />
      
      <motion.main style={{ opacity }} className="relative">
        <HeroSection stats={stats} />
        <SearchSection />
        <CategorySection categories={{}} onCategoryClick={() => {}} activeCategory={null} />
        
        {/* Latest Jobs Section with Animation */}
        <section className="py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Latest Opportunities</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">Jobs</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                Discover your next career opportunity from top companies in Nepal
              </p>
            </motion.div>
            
            <AnimatePresence mode="wait">
              {jobs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                    <Briefcase className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No jobs available</h3>
                  <p className="text-slate-500">Check back later for new opportunities</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job: any, index: number) => (
                      <JobCard key={job.id} job={job} index={index} />
                    ))}
                  </div>
                  
                  <div className="text-center mt-12">
                    <Link href="/jobs">
                      <Button variant="outline" size="lg" className="gap-2 group">
                        Browse All Jobs
                        <TrendingUp className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
        
        <TrustedCompanies />
        <CTASection />
      </motion.main>
      
      <Footer />
      <Toaster />
    </div>
  )
}
