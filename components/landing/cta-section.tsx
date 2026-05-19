// components/landing/cta-section.tsx
"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Rocket } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/5 to-secondary/20" />
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Rocket className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Get Started Today</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Transform Your{" "}
            <span className="gradient-text">Career Path?</span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Join thousands of job seekers and companies already using JobPortal
            to find their perfect match.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="group gap-2">
                Start Hiring for Free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth/signup?role=candidate">
              <Button size="lg" variant="outline" className="group gap-2">
                Find Your Dream Job
                <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • Free for job seekers
          </p>
        </motion.div>
      </div>
    </section>
  )
}