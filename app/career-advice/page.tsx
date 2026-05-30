// app/career-advice/page.tsx
"use client"

import { motion } from "framer-motion"
import { Lightbulb, TrendingUp, FileText, Users, Briefcase, GraduationCap, ArrowRight, Badge } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
 const Navbar = dynamic(() => import("@/components/layout/navbar").then(mod => mod.Navbar))
 const Footer = dynamic(() => import("@/components/layout/footer").then(mod => mod.Footer))
import dynamic from "next/dynamic"
const articles = [
  {
    title: "How to Write a Resume That Gets Noticed",
    category: "Resume Tips",
    readTime: "5 min read",
    icon: FileText,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Top 10 Interview Questions and Answers",
    category: "Interview Tips",
    readTime: "8 min read",
    icon: Users,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Building a Successful Career in Tech",
    category: "Career Growth",
    readTime: "6 min read",
    icon: TrendingUp,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Remote Work: Pros and Cons",
    category: "Work Culture",
    readTime: "4 min read",
    icon: Briefcase,
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Upskilling for Career Advancement",
    category: "Learning",
    readTime: "7 min read",
    icon: GraduationCap,
    color: "from-indigo-500 to-blue-500",
  },
  {
    title: "Networking Strategies That Work",
    category: "Soft Skills",
    readTime: "5 min read",
    icon: Users,
    color: "from-pink-500 to-rose-500",
  },
]

export default function CareerAdvicePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-32">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-orange-500 mb-4">
            <Lightbulb className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Career <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">Advice</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Expert tips and insights to help you navigate your career journey
          </p>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {articles.map((article, index) => {
            const Icon = article.icon
            return (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-xl transition-all cursor-pointer group">
                  <CardContent className="p-6">
                    <div className={`h-12 w-12 rounded-lg bg-gradient-to-r ${article.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
<Badge className="mb-2 border">{article.category}</Badge>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-slate-500">{article.readTime}</span>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Read More
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Featured Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-2">Get Personalized Career Advice</h2>
          <p className="text-white/80 mb-4">Subscribe to our newsletter for weekly career tips</p>
          <Button variant="secondary" className="gap-2">
            Subscribe Now
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  )
}