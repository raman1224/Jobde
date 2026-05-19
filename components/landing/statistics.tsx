// components/landing/statistics.tsx
"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import CountUp from "react-countup"

const stats = [
  { value: 10000, label: "Active Jobs", suffix: "+" },
  { value: 50000, label: "Job Seekers", suffix: "+" },
  { value: 5000, label: "Companies", suffix: "+" },
  { value: 95, label: "Match Accuracy", suffix: "%" }
]

export function Statistics() {
  const ref = useRef(null)
  const isInView = useInView(ref)

  return (
    <section ref={ref} className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold gradient-text">
                {isInView && (
                  <CountUp end={stat.value} duration={2.5} suffix={stat.suffix} />
                )}
              </div>
              <p className="text-muted-foreground mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}