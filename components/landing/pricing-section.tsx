// components/landing/pricing-section.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Zap, Building2, Crown, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

const plans = [
  {
    name: "Basic",
    price: { monthly: 0, yearly: 0 },
    description: "Perfect for small businesses starting out",
    features: [
      "3 active job posts",
      "Basic AI matching",
      "Email support",
      "Applicant tracking",
      "Basic analytics",
      "7-day job visibility"
    ],
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    buttonVariant: "outline"
  },
  {
    name: "Professional",
    price: { monthly: 49, yearly: 470 },
    description: "Most popular for growing companies",
    features: [
      "20 active job posts",
      "Advanced AI matching",
      "Priority support",
      "Advanced analytics",
      "30-day job visibility",
      "Candidate filtering",
      "Interview scheduling",
      "Custom branding"
    ],
    icon: Building2,
    color: "from-purple-500 to-pink-500",
    buttonVariant: "default",
    popular: true
  },
  {
    name: "Enterprise",
    price: { monthly: 199, yearly: 1990 },
    description: "For large organizations with custom needs",
    features: [
      "Unlimited job posts",
      "Custom AI models",
      "24/7 dedicated support",
      "API access",
      "SSO integration",
      "Custom reporting",
      "HRIS integration",
      "SLA guarantee"
    ],
    icon: Crown,
    color: "from-orange-500 to-red-500",
    buttonVariant: "outline"
  }
]

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Pricing</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent{" "}
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the plan that works best for your company. All plans include
            a 14-day free trial.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1 bg-muted rounded-full">
            <span className={`px-4 py-2 text-sm rounded-full transition-all ${!isYearly ? "bg-primary text-primary-foreground" : ""}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-primary"
            />
            <span className={`px-4 py-2 text-sm rounded-full transition-all ${isYearly ? "bg-primary text-primary-foreground" : ""}`}>
              Yearly
              <span className="ml-1 text-xs text-green-500">Save 20%</span>
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const price = isYearly ? plan.price.yearly : plan.price.monthly
            const Icon = plan.icon
            
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <Card className={`h-full border-0 shadow-lg relative overflow-hidden ${plan.popular ? "ring-2 ring-purple-500" : ""}`}>
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.color} opacity-10 rounded-bl-full`} />
                  
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${plan.color} bg-opacity-10`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      {plan.popular && (
                        <span className="text-sm font-medium text-purple-500">✨ Recommended</span>
                      )}
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        ${price}
                      </span>
                      <span className="text-muted-foreground">
                        /{isYearly ? "year" : "month"}
                      </span>
                      {isYearly && price > 0 && (
                        <p className="text-sm text-green-500 mt-1">
                          Save ${plan.price.monthly * 12 - price} annually
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  
                  <CardFooter>
                    <Link href="/auth/signup?plan=professional" className="w-full">
                      <Button
                        variant={plan.buttonVariant as any}
                        className={`w-full gap-2 ${plan.popular ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" : ""}`}
                      >
                        {price === 0 ? "Start Free" : "Start Free Trial"}
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          * All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  )
}