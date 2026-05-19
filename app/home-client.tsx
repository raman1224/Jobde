


// // // app/home-client.tsx
// // "use client"
// // import dynamic from "next/dynamic"
// // import { useState, useEffect, useCallback, useRef } from "react"
// // import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
// // import { useInView } from "react-intersection-observer"
// // // import { Navbar } from "@/components/layout/navbar"
// // // import { HeroSection } from "@/components/home/hero-section"
// // // import { SearchSection } from "@/components/home/search-section"
// // // import { CategorySection } from "@/components/home/category-section"
// // // import { JobGrid } from "@/components/home/job-grid"
// // // import { TrustedCompanies } from "@/components/home/trusted-companies"
// // // import { CTASection } from "@/components/home/cta-section"
// // // import { Footer } from "@/components/layout/footer"
// // // import { Toaster } from "@/components/ui/toaster"
// // const Navbar = dynamic(() => import("@/components/layout/navbar").then(mod => mod.Navbar))
// // const HeroSection = dynamic(() => import("@/components/home/hero-section").then(mod => mod.HeroSection))
// // const SearchSection = dynamic(() => import("@/components/home/search-section").then(mod => mod.SearchSection))
// // const CategorySection = dynamic(() => import("@/components/home/category-section").then(mod => mod.CategorySection))
// // const JobGrid = dynamic(() => import("@/components/home/job-grid").then(mod => mod.JobGrid))
// // const TrustedCompanies = dynamic(() => import("@/components/home/trusted-companies").then(mod => mod.TrustedCompanies))
// // const CTASection = dynamic(() => import("@/components/home/cta-section").then(mod => mod.CTASection))
// // const Footer = dynamic(() => import("@/components/layout/footer").then(mod => mod.Footer))
// // const Toaster = dynamic(() => import("@/components/ui/toaster").then(mod => mod.Toaster))

// // export default function HomeClient({ initialJobs, initialCategories, stats }: any) {
// //   const [jobs, setJobs] = useState(initialJobs)
// //   const [filteredJobs, setFilteredJobs] = useState(initialJobs)
// //   const [activeCategory, setActiveCategory] = useState<{ type: string; value: string } | null>(null)
// //   const [isLoading, setIsLoading] = useState(false)
// //   const containerRef = useRef<HTMLDivElement>(null)
// //   const { scrollYProgress } = useScroll({ target: containerRef })
// //   const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

// //   const handleCategoryClick = useCallback(async (type: string, value: string) => {
// //     setIsLoading(true)
// //     setActiveCategory({ type, value })
    
// //     try {
// //       const res = await fetch(`/api/jobs/filter?type=${type}&value=${encodeURIComponent(value)}`)
// //       const data = await res.json()
// //       setFilteredJobs(data)
      
// //       // Smooth scroll to jobs section
// //       document.getElementById("jobs-section")?.scrollIntoView({ behavior: "smooth", block: "start" })
// //     } catch (error) {
// //       console.error("Filter failed:", error)
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }, [])

// //   const handleSearch = useCallback(async (params: any) => {
// //     setIsLoading(true)
// //     setActiveCategory(null)
    
// //     try {
// //       const res = await fetch("/api/jobs/search", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(params),
// //       })
// //       const data = await res.json()
// //       setFilteredJobs(data)
// //     } catch (error) {
// //       console.error("Search failed:", error)
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }, [])

// //   return (
// //     <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
// //       <Navbar />
      
// //       <motion.main style={{ opacity }} className="relative">
// //         <HeroSection stats={stats} onSearch={handleSearch} />
// //         <SearchSection onSearch={handleSearch} />
// //         <CategorySection categories={initialCategories} onCategoryClick={handleCategoryClick} activeCategory={activeCategory} />
// //         <JobGrid jobs={filteredJobs} isLoading={isLoading} title={activeCategory ? `${activeCategory.value} Jobs` : "Featured Jobs"} />
// //         <TrustedCompanies />
// //         <CTASection />
// //       </motion.main>
      
// //       <Footer />
// //       <Toaster />
// //     </div>
// //   )
// // }



// // app/home-client.tsx - Remove the duplicate jobs section since it's in parent
// "use client"

// import dynamic from "next/dynamic"
// import { useState, useEffect, useCallback, useRef } from "react"
// import { motion, useScroll, useTransform } from "framer-motion"
// import { JobCard } from "@/components/job-card"

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

//   return (
//     <div ref={containerRef} className="min-h-screen">
//       <Navbar />
      
//       <motion.main style={{ opacity }} className="relative">
//         <HeroSection stats={stats} onSearch={() => {}} />
//         <SearchSection onSearch={() => {}} />
//         <CategorySection categories={{}} onCategoryClick={() => {}} activeCategory={null} />
        
//         {/* Latest Jobs Section */}
//         <section className="py-16 bg-slate-50">
//           <div className="container mx-auto px-4">
//             <h2 className="text-3xl font-bold text-center mb-4">Latest Jobs</h2>
//             <p className="text-slate-500 text-center mb-12">Discover your next career opportunity</p>
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {initialJobs.map((job: any) => (
//                 <JobCard key={job.id} job={job} />
//               ))}
//             </div>
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



// app/home-client.tsx - FIXED JOBS DISPLAY
"use client"

import dynamic from "next/dynamic"
import { useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { JobCard } from "@/components/job-card"
import { Briefcase, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
const Navbar = dynamic(() => import("@/components/layout/navbar").then(mod => mod.Navbar))
const HeroSection = dynamic(() => import("@/components/home/hero-section").then(mod => mod.HeroSection))
const SearchSection = dynamic(() => import("@/components/home/search-section").then(mod => mod.SearchSection))
const CategorySection = dynamic(() => import("@/components/home/category-section").then(mod => mod.CategorySection))
const TrustedCompanies = dynamic(() => import("@/components/home/trusted-companies").then(mod => mod.TrustedCompanies))
const CTASection = dynamic(() => import("@/components/home/cta-section").then(mod => mod.CTASection))
const Footer = dynamic(() => import("@/components/layout/footer").then(mod => mod.Footer))
const Toaster = dynamic(() => import("@/components/ui/toaster").then(mod => mod.Toaster))

export default function HomeClient({ initialJobs, stats }: any) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  // Ensure jobs is always an array
  const jobs = Array.isArray(initialJobs) ? initialJobs : []

  return (
    <div ref={containerRef} className="min-h-screen">
      <Navbar />
      
      <motion.main style={{ opacity }} className="relative">
        <HeroSection stats={stats} onSearch={() => {}} />
        <SearchSection onSearch={() => {}} />
        <CategorySection categories={{}} onCategoryClick={() => {}} activeCategory={null} />
        
        {/* Latest Jobs Section */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Latest <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">Jobs</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                Discover your next career opportunity from top companies in Nepal
              </p>
            </div>
            
            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-semibold mb-2">No jobs available</h3>
                <p className="text-slate-500">Check back later for new opportunities</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job: any) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
            
            {jobs.length > 0 && (
              <div className="text-center mt-12">
                <Link href="/jobs">
                  <Button variant="outline" size="lg" className="gap-2">
                    Browse All Jobs
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
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

