// components/home/category-grid.tsx
"use client"

import { motion } from "framer-motion"
import { Building2, Briefcase, MapPin, TrendingUp } from "lucide-react"

const categories = {
  companies: [
    { name: "Tech Companies", count: 245, icon: Building2, color: "from-blue-500 to-cyan-500" },
    { name: "Banking & Finance", count: 128, icon: Building2, color: "from-green-500 to-emerald-500" },
    { name: "Healthcare", count: 89, icon: Building2, color: "from-red-500 to-pink-500" },
    { name: "Education", count: 156, icon: Building2, color: "from-purple-500 to-indigo-500" },
  ],
  industries: [
    { name: "IT & Software", count: 523, icon: Briefcase, color: "from-blue-500 to-cyan-500" },
    { name: "Marketing & Sales", count: 234, icon: Briefcase, color: "from-orange-500 to-red-500" },
    { name: "Construction", count: 167, icon: Briefcase, color: "from-yellow-500 to-amber-500" },
    { name: "Hospitality", count: 98, icon: Briefcase, color: "from-teal-500 to-green-500" },
  ],
  locations: [
    { name: "Kathmandu", count: 1234, icon: MapPin, color: "from-purple-500 to-pink-500" },
    { name: "Pokhara", count: 456, icon: MapPin, color: "from-blue-500 to-indigo-500" },
    { name: "Lalitpur", count: 789, icon: MapPin, color: "from-green-500 to-emerald-500" },
    { name: "Biratnagar", count: 234, icon: MapPin, color: "from-red-500 to-orange-500" },
  ],
}

interface CategoryGridProps {
  onFilter: (category: string, type: string) => void
}

export function CategoryGrid({ onFilter }: CategoryGridProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Find Jobs by{" "}
            <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Browse through thousands of jobs by company, industry, or location
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Companies */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-blue-600" />
              <h3 className="text-xl font-semibold">Top Companies</h3>
            </div>
            <div className="space-y-3">
              {categories.companies.map((item, idx) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onFilter(item.name, "company")}
                  className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold group-hover:text-blue-600 transition-colors">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.count} jobs</p>
                    </div>
                  </div>
                  <TrendingUp className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Industries */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-5 w-5 text-orange-600" />
              <h3 className="text-xl font-semibold">Top Industries</h3>
            </div>
            <div className="space-y-3">
              {categories.industries.map((item, idx) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onFilter(item.name, "industry")}
                  className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold group-hover:text-orange-600 transition-colors">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.count} jobs</p>
                    </div>
                  </div>
                  <TrendingUp className="h-4 w-4 text-slate-400 group-hover:text-orange-600 transition-colors" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-green-600" />
              <h3 className="text-xl font-semibold">Top Locations</h3>
            </div>
            <div className="space-y-3">
              {categories.locations.map((item, idx) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onFilter(item.name, "location")}
                  className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold group-hover:text-green-600 transition-colors">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.count} jobs</p>
                    </div>
                  </div>
                  <TrendingUp className="h-4 w-4 text-slate-400 group-hover:text-green-600 transition-colors" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}