// components/landing/trusted-companies.tsx
"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const companies = [
  "Google", "Microsoft", "Amazon", "Meta", "Netflix", "Apple"
]

export function TrustedCompanies() {
  return (
    <section className="py-16 border-y bg-muted/30">
      <div className="container mx-auto px-4">
        <p className="text-center text-muted-foreground mb-8">Trusted by companies worldwide</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {companies.map((company, index) => (
            <motion.div
              key={company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-2xl font-bold text-muted-foreground/60"
            >
              {company}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}