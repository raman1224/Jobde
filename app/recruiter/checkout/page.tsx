// app/recruiter/checkout/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, CreditCard, Building2, Briefcase, Lock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("esewa")
  
  const plan = searchParams.get("plan")
  const price = searchParams.get("price")
  const period = searchParams.get("period")
  const type = searchParams.get("type")
  const jobs = searchParams.get("jobs")

  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  })

  const handlePayment = async () => {
    setIsProcessing(true)
    toast.loading("Processing payment...", { id: "payment" })
    
    setTimeout(() => {
      toast.success("Payment successful! Your plan is activated.", { id: "payment" })
      router.push("/recruiter/dashboard")
    }, 2000)
  }

  const getOrderSummary = () => {
    if (type === "payg") {
      return {
        title: `Pay As You Go - ${jobs} Job Post${parseInt(jobs || "0") > 1 ? "s" : ""}`,
        price: `NPR ${price}`,
        features: [`${jobs} job post(s)`, "21 days duration each", "Daily job alerts", "Banner ads included"],
      }
    }
    return {
      title: plan ? `${plan} Plan` : "Job Plan",
      price: `NPR ${price}`,
      features: [
        period === "quarter" ? "12 job posts per quarter" : period === "year" ? "40 job posts per year" : "2 job posts",
        "21 days duration per job",
        "Daily job alerts",
        period !== "free" ? "Priority support" : "Basic support",
        period !== "free" ? "Featured listings" : "",
        period !== "free" ? "Analytics dashboard" : "",
      ].filter(f => f),
    }
  }

  const summary = getOrderSummary()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-center mb-8">Complete Your Purchase</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-3 gap-4">
                  <div className="relative">
                    <RadioGroupItem value="esewa" id="esewa" className="peer sr-only" />
                    <Label htmlFor="esewa" className="flex flex-col items-center p-4 rounded-lg border-2 peer-data-[state=checked]:border-blue-600 cursor-pointer">
                      <img src="https://esewa.com.np/common/images/esewa_logo.png" alt="eSewa" className="h-8" />
                      <span className="text-sm mt-2">eSewa</span>
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem value="khalti" id="khalti" className="peer sr-only" />
                    <Label htmlFor="khalti" className="flex flex-col items-center p-4 rounded-lg border-2 peer-data-[state=checked]:border-blue-600 cursor-pointer">
                      <img src="https://khalti.com/static/images/logo.png" alt="Khalti" className="h-8" />
                      <span className="text-sm mt-2">Khalti</span>
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem value="card" id="card" className="peer sr-only" />
                    <Label htmlFor="card" className="flex flex-col items-center p-4 rounded-lg border-2 peer-data-[state=checked]:border-blue-600 cursor-pointer">
                      <CreditCard className="h-8 w-8" />
                      <span className="text-sm mt-2">Credit Card</span>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <Label>Cardholder Name</Label>
                      <Input
                        placeholder="John Doe"
                        value={formData.cardName}
                        onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Card Number</Label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Expiry Date</Label>
                        <Input placeholder="MM/YY" value={formData.expiry} onChange={(e) => setFormData({ ...formData, expiry: e.target.value })} />
                      </div>
                      <div>
                        <Label>CVV</Label>
                        <Input type="password" placeholder="123" value={formData.cvv} onChange={(e) => setFormData({ ...formData, cvv: e.target.value })} />
                      </div>
                    </div>
                  </div>
                )}

                <Button onClick={handlePayment} disabled={isProcessing} className="w-full bg-gradient-to-r from-blue-600 to-orange-500">
                  {isProcessing ? "Processing..." : `Pay ${summary.price}`}
                </Button>

                <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Secure Payment</span>
                  <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> 100% Guarantee</span>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-green-600" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <h3 className="font-semibold">{summary.title}</h3>
                    <p className="text-2xl font-bold text-primary mt-2">{summary.price}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-semibold">What's included:</p>
                    <ul className="space-y-2">
                      {summary.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{summary.price}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>VAT (13%):</span>
                      <span>Included</span>
                    </div>
                    <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                      <span>Total:</span>
                      <span className="text-primary">{summary.price}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}