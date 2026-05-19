// components/home/trusted-companies.tsx
"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const companies = [
  "Google", "Microsoft", "Amazon", "Meta", "Netflix", "Apple",
  "TechCorp Nepal", "CloudFactory", "Leapfrog", "Deerwalk", 
  "Fusemachines", "Cotiviti", "LogPoint", "Verisk"
]

export function TrustedCompanies() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setScrolled(prev => !prev)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-slate-500 uppercase tracking-wide text-sm font-semibold"
          >
            Trusted by
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-semibold mt-2"
          >
            Leading Companies Worldwide
          </motion.p>
        </div>

        <div className="relative">
          <motion.div
            animate={{ x: scrolled ? -500 : 0 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex gap-12 whitespace-nowrap"
          >
            {[...companies, ...companies].map((company, index) => (
              <motion.div
                key={`${company}-${index}`}
                whileHover={{ scale: 1.1, y: -5 }}
                className="inline-block"
              >
                <div className="px-6 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all">
                  <span className="text-slate-600 dark:text-slate-300 font-semibold text-lg">
                    {company}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}