// components/home/featured-companies.tsx
"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const companies = [
  "Google", "Microsoft", "Amazon", "Meta", "Netflix", "Apple",
  "TechCorp Nepal", "CloudFactory", "Leapfrog", "Deerwalk"
]

export function FeaturedCompanies() {
  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-slate-500 uppercase tracking-wide text-sm">Trusted by</p>
          <p className="text-2xl font-semibold">Leading Companies in Nepal & Worldwide</p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {companies.map((company, index) => (
            <motion.div
              key={company}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              className="text-slate-400 font-semibold text-lg hover:text-blue-600 transition-colors cursor-pointer"
            >
              {company}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}