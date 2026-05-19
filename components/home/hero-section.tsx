// components/home/hero-section.tsx - FIXED (remove window reference)
"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useState, useEffect } from "react"
import { Briefcase, TrendingUp, Users, MapPin, Sparkles, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

const words = ["Career", "Future", "Dream Job", "Success", "Opportunity"]

export function HeroSection({ stats, onSearch }: any) {
  const [currentWord, setCurrentWord] = useState(0)
  const [particles, setParticles] = useState<Array<{ x: number; y: number; duration: number; delay: number }>>([])
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 })
  const rotateX = useTransform(springY, [-300, 300], [15, -15])
  const rotateY = useTransform(springX, [-300, 300], [-15, 15])

  // Generate particles on client side only
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 5 + 3,
      delay: Math.random() * 5,
    }))
    setParticles(newParticles)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.getElementById("hero-card")?.getBoundingClientRect()
      if (rect) {
        mouseX.set(e.clientX - rect.left - rect.width / 2)
        mouseY.set(e.clientY - rect.top - rect.height / 2)
      }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-blue-950/20 dark:via-transparent dark:to-orange-950/20" />
      
      {/* Floating Particles - FIXED: no window reference */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
            style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
            animate={{ y: [0, -100], opacity: [0, 1, 0] }}
            transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
            >
              <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
              <span className="text-sm font-medium text-blue-600">#1 Job Platform in Nepal</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Build Your{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                  {words[currentWord]}
                </span>
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </span>
              <br />
              in Nepal
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Join 50,000+ professionals who found their perfect job. 
              Top companies are hiring right now!
            </p>

            <div className="flex flex-wrap gap-6 mb-8">
              {[
                { icon: Briefcase, value: stats?.totalJobs || 0, label: "Live Jobs", color: "blue" },
                { icon: Users, value: stats?.totalCompanies || 0, label: "Companies", color: "orange" },
                { icon: MapPin, value: stats?.totalCandidates || 0, label: "Job Seekers", color: "green" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className={`h-10 w-10 rounded-full bg-${stat.color}-500/10 flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value.toLocaleString()}+</p>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white shadow-xl gap-2">
                <Rocket className="h-4 w-4" />
                Find Your Dream Job
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                Post a Job
              </Button>
            </div>
          </motion.div>

          {/* Right 3D Illustration */}
          <motion.div
            id="hero-card"
            style={{ rotateX, rotateY, perspective: 1000 }}
            className="relative"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=500&fit=crop"
                alt="Nepali professionals"
                className="w-full h-auto object-cover transform transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-orange-500/20" />
            </motion.div>
            
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-6 -right-6 bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-4 border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold">+40% Growth</p>
                  <p className="text-xs text-slate-500">This Year</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-4 border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold">50K+ Active</p>
                  <p className="text-xs text-slate-500">Job Seekers</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}