// components/landing/features-section.tsx
"use client"

import { motion } from "framer-motion"
import { Zap, Users, TrendingUp, Shield, Clock, Globe } from "lucide-react"

const candidateFeatures = [
  { icon: Zap, title: "AI-Powered Matching", description: "Get matched with jobs that fit your skills perfectly" },
  { icon: Clock, title: "Quick Apply", description: "Apply to multiple jobs with one click" },
  { icon: TrendingUp, title: "Career Growth", description: "Track your career progression and get insights" }
]

const recruiterFeatures = [
  { icon: Users, title: "Smart Screening", description: "AI-powered candidate filtering" },
  { icon: Shield, title: "Verified Profiles", description: "Trustworthy candidate information" },
  { icon: Globe, title: "Global Reach", description: "Access talent from around the world" }
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for{" "}
            <span className="gradient-text">Everyone</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you're looking for your dream job or the perfect candidate,
            we've got you covered
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-center">For Candidates</h3>
            <div className="space-y-4">
              {candidateFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-lg bg-card border"
                >
                  <feature.icon className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-6 text-center">For Recruiters</h3>
            <div className="space-y-4">
              {recruiterFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-lg bg-card border"
                >
                  <feature.icon className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}