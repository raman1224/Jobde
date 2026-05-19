


// components/home/cta-section.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Briefcase, Users, ArrowRight, Sparkles, Rocket, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; duration: number; delay: number }>>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=400&fit=crop')] bg-cover bg-center opacity-10" />
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
            animate={{ y: [0, -100], opacity: [0, 1, 0] }}
            transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-center lg:text-left"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6"
            >
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-medium text-white">Join 50,000+ Active Users</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Transform Your{" "}
              <span className="underline decoration-yellow-400">Career</span>?
            </h2>
            <p className="text-white/80 text-lg max-w-2xl">
              Join thousands of professionals and companies already using Jobde to find perfect matches
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/auth/signup?role=CANDIDATE">
              <Button size="lg" variant="secondary" className="gap-2 bg-white text-blue-600 hover:bg-gray-100 shadow-xl">
                <Users className="h-5 w-5" />
                I'm a Job Seeker
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/signup?role=RECRUITER">
              <Button size="lg" variant="outline" className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
                <Briefcase className="h-5 w-5" />
                I'm an Employer
                <Rocket className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-white/20"
        >
          {[
            { value: "10K+", label: "Active Jobs", icon: Briefcase },
            { value: "5K+", label: "Companies", icon: Users },
            { value: "50K+", label: "Job Seekers", icon: TrendingUp },
            { value: "95%", label: "Success Rate", icon: Sparkles },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="text-center"
            >
              <stat.icon className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-white/70">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}