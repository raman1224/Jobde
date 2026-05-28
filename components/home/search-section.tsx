// // components/home/search-section.tsx
// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import { Search, MapPin, Briefcase, X, Filter, ChevronDown } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"

// const popularSearches = [
//   "Frontend Developer", "Backend Developer", "Data Scientist", 
//   "DevOps Engineer", "Product Manager", "UI/UX Designer",
//   "Accountant", "Marketing Manager", "Sales Executive"
// ]

// const jobTypes = ["Full-time", "Part-time", "Contract", "Remote", "Hybrid"]
// const experienceLevels = ["Entry Level", "Junior", "Mid-Level", "Senior", "Lead", "Executive"]

// interface SearchSectionProps {
//   onSearch: (params: any) => void
// }

// export function SearchSection({ onSearch }: SearchSectionProps) {
//   const [title, setTitle] = useState("")
//   const [location, setLocation] = useState("")
//   const [selectedJobType, setSelectedJobType] = useState<string>("")
//   const [selectedExperience, setSelectedExperience] = useState<string>("")
//   const [showFilters, setShowFilters] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)

//   const handleSearch = async () => {
//     setIsLoading(true)
//     await onSearch({ title, location, jobType: selectedJobType, experience: selectedExperience })
//     setIsLoading(false)
//   }

//   const clearFilters = () => {
//     setTitle("")
//     setLocation("")
//     setSelectedJobType("")
//     setSelectedExperience("")
//     onSearch({})
//   }

//   return (
//     <section className="py-8">
//       <div className="container mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
//         >
//           {/* Main Search Bar */}
//           <div className="p-6">
//             <div className="grid md:grid-cols-2 gap-4 mb-4">
//               <div className="relative">
//                 <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
//                 <Input
//                   placeholder="Job title, company, or keywords"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   className="pl-10 h-12 text-base"
//                   onKeyPress={(e) => e.key === "Enter" && handleSearch()}
//                 />
//               </div>
//               <div className="relative">
//                 <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
//                 <Input
//                   placeholder="City, state, or remote"
//                   value={location}
//                   onChange={(e) => setLocation(e.target.value)}
//                   className="pl-10 h-12 text-base"
//                   onKeyPress={(e) => e.key === "Enter" && handleSearch()}
//                 />
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-3 justify-between items-center">
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
//               >
//                 <Filter className="h-4 w-4" />
//                 {showFilters ? "Hide Filters" : "Show Filters"}
//                 <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
//               </button>

//               <div className="flex gap-3">
//                 {(title || location || selectedJobType || selectedExperience) && (
//                   <Button variant="ghost" onClick={clearFilters} className="gap-2">
//                     <X className="h-4 w-4" />
//                     Clear
//                   </Button>
//                 )}
//                 <Button 
//                   onClick={handleSearch} 
//                   disabled={isLoading}
//                   className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 h-12 px-8 gap-2"
//                 >
//                   {isLoading ? (
//                     <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                   ) : (
//                     <Search className="h-4 w-4" />
//                   )}
//                   Search Jobs
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Advanced Filters */}
//           <motion.div
//             initial={false}
//             animate={{ height: showFilters ? "auto" : 0, opacity: showFilters ? 1 : 0 }}
//             transition={{ duration: 0.3 }}
//             className="overflow-hidden"
//           >
//             <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800">
//               <div className="grid md:grid-cols-2 gap-6">
//                 {/* Job Type Filters */}
//                 <div>
//                   <label className="text-sm font-medium mb-3 block">Job Type</label>
//                   <div className="flex flex-wrap gap-2">
//                     {jobTypes.map((type) => (
//                       <motion.button
//                         key={type}
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => setSelectedJobType(selectedJobType === type ? "" : type)}
//                         className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                           selectedJobType === type
//                             ? "bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-md"
//                             : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
//                         }`}
//                       >
//                         {type}
//                       </motion.button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Experience Level Filters */}
//                 <div>
//                   <label className="text-sm font-medium mb-3 block">Experience Level</label>
//                   <div className="flex flex-wrap gap-2">
//                     {experienceLevels.map((level) => (
//                       <motion.button
//                         key={level}
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => setSelectedExperience(selectedExperience === level ? "" : level)}
//                         className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                           selectedExperience === level
//                             ? "bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-md"
//                             : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
//                         }`}
//                       >
//                         {level}
//                       </motion.button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Popular Searches */}
//           <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800">
//             <div className="flex flex-wrap items-center gap-3">
//               <span className="text-sm text-slate-500">Popular:</span>
//               <div className="flex flex-wrap gap-2">
//                 {popularSearches.slice(0, 8).map((term) => (
//                   <motion.button
//                     key={term}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => {
//                       setTitle(term)
//                       onSearch({ title: term, location, jobType: selectedJobType, experience: selectedExperience })
//                     }}
//                     className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
//                   >
//                     {term}
//                   </motion.button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   )
// }



// components/home/search-section.tsx - With better UX
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, MapPin, Briefcase, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

const popularSearches = [
  "Frontend Developer", "Backend Developer", "Data Scientist", 
  "DevOps Engineer", "Product Manager", "UI/UX Designer",
  "Accountant", "Marketing Manager", "Kathmandu", "Pokhara"
]

interface SearchSectionProps {
  onSearch?: (params: any) => void
}

export function SearchSection({ onSearch }: SearchSectionProps) {
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!title && !location) return
    
    setIsLoading(true)
    if (onSearch) {
      await onSearch({ title, location })
    } else {
      window.location.href = `/jobs?title=${encodeURIComponent(title)}&location=${encodeURIComponent(location)}`
    }
    setIsLoading(false)
  }

  const handlePopularClick = (term: string) => {
    // Check if it's a location or job title
    const locations = ["Kathmandu", "Pokhara", "Lalitpur", "Biratnagar"]
    if (locations.includes(term)) {
      setLocation(term)
    } else {
      setTitle(term)
    }
    setTimeout(() => handleSearch(), 100)
  }

  const clearFilters = () => {
    setTitle("")
    setLocation("")
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-950/20 dark:to-orange-950/20">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Job title, company, or keywords"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="pl-10 h-12 bg-white dark:bg-slate-900"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="City, state, or remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 h-12 bg-white dark:bg-slate-900"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-slate-500">Popular:</span>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handlePopularClick(term)}
                      className="text-sm px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors shadow-sm"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                {(title || location) && (
                  <Button variant="ghost" onClick={clearFilters} className="gap-1">
                    <X className="h-4 w-4" />
                    Clear
                  </Button>
                )}
                <Button 
                  onClick={handleSearch} 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 h-12 px-8 gap-2"
                >
                  <Search className="h-4 w-4" />
                  Search Jobs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}