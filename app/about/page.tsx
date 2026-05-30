// app/about/page.tsx
"use client"

import { motion } from "framer-motion"
import { Users, Briefcase, Award, TrendingUp, Shield, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
const Navbar = dynamic(() => import("@/components/layout/navbar").then(mod => mod.Navbar))
const Footer = dynamic(() => import("@/components/layout/footer").then(mod => mod.Footer))
import dynamic from "next/dynamic"
const stats = [
  { value: "10K+", label: "Active Jobs", icon: Briefcase },
  { value: "50K+", label: "Job Seekers", icon: Users },
  { value: "5K+", label: "Companies", icon: Award },
  { value: "95%", label: "Success Rate", icon: TrendingUp },
]

const values = [
  { icon: Shield, title: "Trust & Transparency", description: "We believe in honest and transparent hiring processes." },
  { icon: Zap, title: "Innovation", description: "AI-powered matching for better results." },
  { icon: Users, title: "Community First", description: "Building a supportive professional community." },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <Navbar />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-orange-600/20" />

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Connecting Talent with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                Opportunity
              </span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Jobde is Nepal's leading AI-powered job platform, dedicated to transforming how people find jobs and how companies hire talent.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-orange-500 mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-slate-500">{stat.label}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              To empower job seekers and employers with intelligent matching technology, 
              making the hiring process faster, fairer, and more efficient for everyone in Nepal.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, i) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="text-center h-full">
                    <CardContent className="p-6">
                      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-orange-500 mb-4">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                      <p className="text-slate-500">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}