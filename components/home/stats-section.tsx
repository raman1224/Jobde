// components/home/stats-section.tsx
"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import CountUp from "react-countup"
import { Briefcase, Building2, Users, TrendingUp } from "lucide-react"

const stats = [
  { label: "Live Jobs", icon: Briefcase, color: "from-blue-500 to-cyan-500" },
  { label: "Companies", icon: Building2, color: "from-orange-500 to-red-500" },
  { label: "Job Seekers", icon: Users, color: "from-green-500 to-emerald-500" },
  { label: "Placements", icon: TrendingUp, color: "from-purple-500 to-pink-500" },
]

export function StatsSection({ stats: statsData }: { stats: any }) {
  const ref = useRef(null)
  const isInView = useInView(ref)

  return (
    <section ref={ref} className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const value = statsData[stat.label.toLowerCase().replace(" ", "")] || 0
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800"
              >
                <div className={`h-12 w-12 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-3xl font-bold">
                  {isInView && <CountUp end={value} duration={2.5} separator="," />}+
                </p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}