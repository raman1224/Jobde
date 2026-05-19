// app/recruiter/jobplan/page.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Check, Zap, Crown, ShoppingBag, Briefcase, Calendar, Bell, TrendingUp, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const plans = [
  {
    name: "Basic (Free)",
    price: 0,
    period: "free",
    description: "Perfect for small businesses starting out",
    features: [
      "2 job posts",
      "21 days duration per job",
      "Daily job alerts",
      "Basic support",
      "Basic analytics"
    ],
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    popular: false,
  },
  {
    name: "Quarterly Plan",
    price: 15000,
    period: "quarter",
    description: "Best for growing companies",
    features: [
      "12 job posts per quarter",
      "21 days duration per job",
      "Daily job alerts",
      "Priority support",
      "Featured listings",
      "Advanced analytics",
      "Resume database access"
    ],
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    popular: true,
  },
  {
    name: "Annual Plan",
    price: 45000,
    period: "year",
    description: "Best value for established companies",
    features: [
      "40 job posts per year",
      "21 days duration per job",
      "Daily job alerts",
      "Priority support",
      "Featured listings",
      "Advanced analytics",
      "Resume database access",
      "HR consulting",
      "Company branding"
    ],
    icon: Crown,
    color: "from-orange-500 to-red-500",
    popular: false,
  },
]

const payAsYouGoOptions = [
  { jobs: 1, price: 1695, originalPrice: 1995, save: "15%" },
  { jobs: 5, price: 7995, originalPrice: 9975, save: "20%" },
  { jobs: 10, price: 14995, originalPrice: 19950, save: "25%" },
  { jobs: 20, price: 27995, originalPrice: 39900, save: "30%" },
]

export default function JobPlanPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [selectedPayGo, setSelectedPayGo] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (planName: string, price: number, period: string) => {
    setIsLoading(true)
    toast.loading("Processing...", { id: "plan" })
    
    setTimeout(() => {
      toast.success(`Selected ${planName} plan! Redirecting to payment...`, { id: "plan" })
      router.push(`/recruiter/checkout?plan=${planName.toLowerCase().replace(" ", "-")}&price=${price}&period=${period}`)
    }, 1000)
  }

  const handlePayAsYouGo = () => {
    const selected = payAsYouGoOptions.find(opt => opt.jobs === selectedPayGo)
    setIsLoading(true)
    toast.loading("Processing...", { id: "payg" })
    
    setTimeout(() => {
      toast.success(`Selected ${selectedPayGo} job pack! Redirecting to payment...`, { id: "payg" })
      router.push(`/recruiter/checkout?type=payg&jobs=${selectedPayGo}&price=${selected?.price}`)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                Hiring Plan
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Select the perfect plan to start hiring top talent in Nepal
            </p>
          </motion.div>
        </div>

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                
                <Card className={`h-full border-0 shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  plan.popular ? "ring-2 ring-purple-500" : ""
                }`}>
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.color} opacity-10 rounded-bl-full`} />
                  
                  <CardHeader>
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${plan.color} w-fit mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      {plan.price === 0 ? (
                        <span className="text-4xl font-bold">Free</span>
                      ) : (
                        <>
                          <span className="text-4xl font-bold">NPR {plan.price.toLocaleString()}</span>
                          <span className="text-muted-foreground"> /{plan.period}</span>
                        </>
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
                    <Button
                      onClick={() => handleSubscribe(plan.name, plan.price, plan.period)}
                      className={`w-full gap-2 ${
                        plan.popular 
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" 
                          : "bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                      }`}
                    >
                      {plan.price === 0 ? "Start Free Plan" : "Subscribe Now"}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Pay As You Go */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-2">Pay As You Go</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Start Hiring Anytime, Pay As You Go. Post duration – 21 days with daily job alerts.
            </p>
          </motion.div>

          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Select Your Required Job Post Plan</CardTitle>
              <CardDescription>
                Post Duration – 21 days • Daily job alerts • Banner Ads included
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedPayGo.toString()}
                onValueChange={(v) => setSelectedPayGo(parseInt(v))}
                className="grid md:grid-cols-4 gap-4"
              >
                {payAsYouGoOptions.map((option) => (
                  <div key={option.jobs} className="relative">
                    <RadioGroupItem
                      value={option.jobs.toString()}
                      id={`jobs-${option.jobs}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`jobs-${option.jobs}`}
                      className="flex flex-col items-center justify-between p-4 rounded-lg border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                    >
                      <Briefcase className="h-8 w-8 mb-2 text-primary" />
                      <div className="text-center">
                        <p className="text-2xl font-bold">{option.jobs}</p>
                        <p className="text-sm text-muted-foreground">Job{option.jobs > 1 ? "s" : ""}</p>
                        <p className="text-lg font-semibold text-primary mt-2">
                          NPR {option.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground line-through">
                          NPR {option.originalPrice.toLocaleString()}
                        </p>
                        <Badge variant="outline" className="mt-2 text-green-600 border-green-600">
                          Save {option.save}
                        </Badge>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter>
              <div className="w-full space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-2xl text-primary">
                    NPR {payAsYouGoOptions.find(opt => opt.jobs === selectedPayGo)?.price.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Prices are inclusive of VAT
                </p>
                <Button 
                  onClick={handlePayAsYouGo}
                  className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}