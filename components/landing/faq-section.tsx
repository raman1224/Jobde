// components/landing/faq-section.tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, HelpCircle } from "lucide-react"
import { Card } from "@/components/ui/card"

const faqs = [
  {
    question: "How does AI-powered matching work?",
    answer: "Our AI analyzes your resume, skills, experience, and preferences to match you with relevant jobs. It uses natural language processing to understand job descriptions and candidate profiles, providing a match score (0-100%) based on compatibility."
  },
  {
    question: "Is JobPortal free for job seekers?",
    answer: "Yes! Creating a profile, uploading your resume, applying to jobs, and using our AI matching features are completely free for job seekers."
  },
  {
    question: "How much does it cost for companies?",
    answer: "We offer flexible pricing plans starting from free for small businesses. Contact our sales team for enterprise pricing with advanced features like API access and dedicated support."
  },
  {
    question: "Can I upload multiple resumes?",
    answer: "Yes, you can upload and store up to 5 different resumes tailored for different job types. Our AI will analyze each one for optimal matching."
  },
  {
    question: "How do I schedule interviews through the platform?",
    answer: "Recruiters can schedule interviews directly from the applicant dashboard. You'll receive email and in-app notifications with calendar invites and video call links."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use industry-standard encryption, secure authentication, and comply with data protection regulations. Your personal information is never shared without your consent."
  },
  {
    question: "Can I track my application status?",
    answer: "Yes! Your dashboard shows real-time updates on each application, from 'Applied' to 'Reviewing', 'Interview', and 'Hired' statuses."
  },
  {
    question: "What happens after I get hired?",
    answer: "Congratulations! You can archive your profile or keep it active for future opportunities. Companies can provide feedback to help improve our matching algorithm."
  }
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <HelpCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked{" "}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about JobPortal. Can't find what you're looking for?
            Feel free to contact our support team.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-muted/30 transition-colors"
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 border-t">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}