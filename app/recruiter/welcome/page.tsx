// app/recruiter/welcome/page.tsx
"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Building2, Rocket, Briefcase, Users, TrendingUp, ArrowRight, CheckCircle, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RecruiterWelcomePage() {
  const router = useRouter()

  const steps = [
    { icon: Building2, title: "Complete Company Profile", description: "Add your company logo, description, and culture" },
    { icon: CreditCard, title: "Choose a Plan", description: "Select the perfect plan for your hiring needs" },
    { icon: Briefcase, title: "Post Your First Job", description: "Create job posts and reach thousands of candidates" },
    { icon: Users, title: "Review Applications", description: "Screen, shortlist, and hire the best talent" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-orange-500 mb-6"
          >
            <Rocket className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Jobde
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Your journey to finding the perfect talent starts here
          </p>
          
          <div className="grid md:grid-cols-4 gap-6 mt-12">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full text-center hover:shadow-xl transition-all">
                    <CardContent className="pt-6">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-orange-500 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-slate-500">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <div className="flex gap-4 justify-center mt-12">
            <Button 
              onClick={() => router.push('/recruiter/company/setup')}
              className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-lg px-8 py-6"
            >
              Set Up Company Profile
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/recruiter/dashboard')}
              className="text-lg px-8 py-6"
            >
              Go to Dashboard
            </Button>
          </div>
        </motion.div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
          {[
            { value: "10K+", label: "Active Job Seekers", icon: Users },
            { value: "500+", label: "Companies Hiring", icon: Building2 },
            { value: "95%", label: "Success Rate", icon: TrendingUp },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="text-center p-6 bg-white rounded-xl shadow-lg"
            >
              <stat.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}