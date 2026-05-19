// components/home/job-search.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, MapPin, Briefcase, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const popularSearches = [
  "Frontend Developer", "Backend Developer", "Accountant", 
  "Automobile Engineer", "Hotel Management", "IT Software",
  "Network Engineer", "Data Scientist", "Digital Marketing"
]

interface JobSearchProps {
  onSearch: (params: any) => void
}

export function JobSearch({ onSearch }: JobSearchProps) {
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")

  const handleSearch = () => {
    onSearch({ title, location })
  }

  const handlePopularClick = (term: string) => {
    setTitle(term)
    onSearch({ title: term, location })
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-800"
        >
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Job title, company, or keywords"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="pl-10 h-12"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="City, state, or remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 h-12"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <Button 
              onClick={handleSearch}
              className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
            >
              <Search className="h-4 w-4 mr-2" />
              Search Jobs
            </Button>
            
            <div className="flex flex-wrap items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-slate-500">Popular:</span>
              <div className="flex flex-wrap gap-2">
                {popularSearches.slice(0, 5).map((term) => (
                  <button
                    key={term}
                    onClick={() => handlePopularClick(term)}
                    className="text-sm px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}