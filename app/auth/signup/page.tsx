

// app/auth/signup/page.tsx - COMPLETE WORKING VERSION
"use client"

import { useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Briefcase, Users, Building2, Phone, MapPin, Globe, FileText, CheckCircle, AlertCircle, Send, Chrome, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export default function SignUpPage() {
  const [step, setStep] = useState(1)
  const [accountType, setAccountType] = useState<'CANDIDATE' | 'RECRUITER'>('CANDIDATE')
  const [isLoading, setIsLoading] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [sentCode, setSentCode] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [activeTab, setActiveTab] = useState("CANDIDATE")

  // Candidate form
  const [candidateForm, setCandidateForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  // Recruiter form - Personal Info
  const [recruiterPersonal, setRecruiterPersonal] = useState({
    name: '',
    designation: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  // Recruiter form - Company Info
  const [recruiterCompany, setRecruiterCompany] = useState({
    companyName: '',
    companyEmail: '',
    panNumber: '',
    website: '',
    location: '',
    address: '',
    size: '',
    industry: '',
    description: '',
  })

  // Countdown timer for resend
  const startCountdown = () => {
    setCountdown(60)
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const sendVerificationCode = async () => {
    const email = accountType === 'CANDIDATE' ? candidateForm.email : recruiterPersonal.email
    const name = accountType === 'CANDIDATE' ? candidateForm.name : recruiterPersonal.name
    
    if (!email) {
      toast.error('Please enter your email first')
      return
    }
    
    if (accountType === 'RECRUITER' && !name) {
      toast.error('Please enter your name first')
      return
    }
    
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setSentCode(true)
        startCountdown()
        toast.success('Verification code sent to your email!', {
          description: 'Please check your inbox (including spam folder)',
          duration: 5000,
        })
      } else {
        toast.error(data.error || 'Failed to send code')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
      console.error('Send code error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const verifyCode = async () => {
    const email = accountType === 'CANDIDATE' ? candidateForm.email : recruiterPersonal.email
    
    if (!verificationCode) {
      toast.error('Please enter the verification code')
      return
    }
    
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setStep(2)
        toast.success('Email verified successfully!')
      } else {
        toast.error(data.error || 'Invalid verification code')
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCandidateSignup = async () => {
    if (candidateForm.password !== candidateForm.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (candidateForm.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: candidateForm.name,
          email: candidateForm.email,
          password: candidateForm.password,
          role: 'CANDIDATE',
        }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        toast.success('Account created successfully!')
        // Auto login
        await login(candidateForm.email, candidateForm.password)
      } else {
        toast.error(data.error || 'Failed to create account')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    
    if (res.ok) {
      window.location.href = '/dashboard/candidate'
    }
  }

  const handleRecruiterSignup = async () => {
    if (recruiterPersonal.password !== recruiterPersonal.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    setIsLoading(true)
    try {
      // First create user account
      const userRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: recruiterPersonal.name,
          email: recruiterPersonal.email,
          password: recruiterPersonal.password,
          role: 'RECRUITER',
        }),
      })
      
      if (!userRes.ok) {
        const error = await userRes.json()
        throw new Error(error.error || 'Failed to create account')
      }
      
      const userData = await userRes.json()
      
      // Then create company profile
      const companyRes = await fetch('/api/recruiter/company/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.userId,
          ...recruiterCompany,
          contactPerson: recruiterPersonal.name,
          contactDesignation: recruiterPersonal.designation,
          contactPhone: recruiterPersonal.phone,
        }),
      })
      
      if (companyRes.ok) {
        toast.success('Company registered successfully!')
        // Auto login
        await login(recruiterPersonal.email, recruiterPersonal.password)
      } else {
        throw new Error('Failed to create company profile')
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto"
      >
        <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white">Create Your Account</CardTitle>
            <CardDescription className="text-white/60">
              Join Jobde - Nepal's #1 Job Platform
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* WRAP EVERYTHING IN TABS COMPONENT */}
            <Tabs 
              defaultValue="CANDIDATE" 
              value={activeTab}
              onValueChange={(v) => {
                setActiveTab(v)
                setAccountType(v as any)
                setStep(1)
                setSentCode(false)
                setVerificationCode('')
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-white/10 mb-8">
                <TabsTrigger value="CANDIDATE" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white gap-2">
                  <Users className="h-4 w-4" />
                  Job Seeker
                </TabsTrigger>
                <TabsTrigger value="RECRUITER" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white gap-2">
                  <Building2 className="h-4 w-4" />
                  Employer / Recruiter
                </TabsTrigger>
              </TabsList>

              {/* CANDIDATE TAB CONTENT */}
              <TabsContent value="CANDIDATE">
                <AnimatePresence mode="wait">
                  <motion.div
                    key="candidate"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    {step === 1 && (
                      <div className="space-y-4">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                          <p className="text-sm text-blue-300 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            We'll send a verification code to your email
                          </p>
                        </div>
                        
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
                          <Input
                            placeholder="Email Address"
                            value={candidateForm.email}
                            onChange={(e) => setCandidateForm({ ...candidateForm, email: e.target.value })}
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                            type="email"
                          />
                        </div>
                        
                        <div className="flex gap-3">
                          <Input
                            placeholder="Enter 6-digit Verification Code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                            disabled={!sentCode}
                            maxLength={6}
                          />
                          <Button 
                            onClick={sendVerificationCode} 
                            disabled={isLoading || !candidateForm.email || countdown > 0}
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/20 whitespace-nowrap"
                          >
                            {isLoading ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : countdown > 0 ? (
                              `${countdown}s`
                            ) : sentCode ? (
                              "Resend Code"
                            ) : (
                              "Send Code"
                            )}
                          </Button>
                        </div>
                        
                        {sentCode && (
                          <Button 
                            onClick={verifyCode} 
                            disabled={isLoading || !verificationCode}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            {isLoading ? "Verifying..." : "Verify & Continue"}
                          </Button>
                        )}
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-4">
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <p className="text-sm text-green-300">Email verified successfully!</p>
                        </div>
                        
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
                          <Input
                            placeholder="Full Name"
                            value={candidateForm.name}
                            onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })}
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          />
                        </div>
                        
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
                          <Input
                            type="password"
                            placeholder="Password (min. 8 characters)"
                            value={candidateForm.password}
                            onChange={(e) => setCandidateForm({ ...candidateForm, password: e.target.value })}
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          />
                        </div>
                        
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
                          <Input
                            type="password"
                            placeholder="Confirm Password"
                            value={candidateForm.confirmPassword}
                            onChange={(e) => setCandidateForm({ ...candidateForm, confirmPassword: e.target.value })}
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          />
                        </div>
                        
                        <Button 
                          onClick={handleCandidateSignup} 
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                        >
                          {isLoading ? "Creating Account..." : "Sign Up as Job Seeker"}
                        </Button>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </TabsContent>

              {/* RECRUITER TAB CONTENT */}
              <TabsContent value="RECRUITER">
                <AnimatePresence mode="wait">
                  <motion.div
                    key="recruiter"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {step === 1 && (
                      <div className="space-y-4">
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-4">
                          <p className="text-sm text-orange-300 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Verify your business email to continue
                          </p>
                        </div>
                        
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
                          <Input
                            placeholder="Full Name"
                            value={recruiterPersonal.name}
                            onChange={(e) => setRecruiterPersonal({ ...recruiterPersonal, name: e.target.value })}
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                          />
                        </div>
                        
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
                          <Input
                            placeholder="Company Email Address"
                            value={recruiterPersonal.email}
                            onChange={(e) => setRecruiterPersonal({ ...recruiterPersonal, email: e.target.value })}
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                            type="email"
                          />
                        </div>
                        
                        <div className="flex gap-3">
                          <Input
                            placeholder="Enter 6-digit Verification Code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                            disabled={!sentCode}
                            maxLength={6}
                          />
                          <Button 
                            onClick={sendVerificationCode} 
                            disabled={isLoading || !recruiterPersonal.email || !recruiterPersonal.name || countdown > 0}
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/20 whitespace-nowrap"
                          >
                            {isLoading ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : countdown > 0 ? (
                              `${countdown}s`
                            ) : sentCode ? (
                              "Resend Code"
                            ) : (
                              "Send Code"
                            )}
                          </Button>
                        </div>
                        
                        {sentCode && (
                          <Button 
                            onClick={verifyCode} 
                            disabled={isLoading || !verificationCode}
                            className="w-full bg-orange-600 hover:bg-orange-700"
                          >
                            {isLoading ? "Verifying..." : "Verify & Continue"}
                          </Button>
                        )}
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-6">
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <p className="text-sm text-green-300">Email verified successfully!</p>
                        </div>
                        
                        <h3 className="text-white font-semibold">Contact Person Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
                            <Input
                              placeholder="Designation (e.g., HR Manager)"
                              value={recruiterPersonal.designation}
                              onChange={(e) => setRecruiterPersonal({ ...recruiterPersonal, designation: e.target.value })}
                              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                            />
                          </div>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
                            <Input
                              placeholder="Phone Number"
                              value={recruiterPersonal.phone}
                              onChange={(e) => setRecruiterPersonal({ ...recruiterPersonal, phone: e.target.value })}
                              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                            />
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
                            <Input
                              type="password"
                              placeholder="Password (min. 8 characters)"
                              value={recruiterPersonal.password}
                              onChange={(e) => setRecruiterPersonal({ ...recruiterPersonal, password: e.target.value })}
                              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                            />
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
                            <Input
                              type="password"
                              placeholder="Confirm Password"
                              value={recruiterPersonal.confirmPassword}
                              onChange={(e) => setRecruiterPersonal({ ...recruiterPersonal, confirmPassword: e.target.value })}
                              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                            />
                          </div>
                        </div>

                        <h3 className="text-white font-semibold mt-6">Company Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
                            <Input
                              placeholder="Company Name"
                              value={recruiterCompany.companyName}
                              onChange={(e) => setRecruiterCompany({ ...recruiterCompany, companyName: e.target.value })}
                              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                            />
                          </div>
                          <div className="relative">
                            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
                            <Input
                              placeholder="PAN Number"
                              value={recruiterCompany.panNumber}
                              onChange={(e) => setRecruiterCompany({ ...recruiterCompany, panNumber: e.target.value })}
                              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                            />
                          </div>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
                            <Input
                              placeholder="Website URL"
                              value={recruiterCompany.website}
                              onChange={(e) => setRecruiterCompany({ ...recruiterCompany, website: e.target.value })}
                              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                            />
                          </div>
                          <Select onValueChange={(v) => setRecruiterCompany({ ...recruiterCompany, size: v })}>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue placeholder="Company Size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-10">1-10 employees</SelectItem>
                              <SelectItem value="11-50">11-50 employees</SelectItem>
                              <SelectItem value="51-200">51-200 employees</SelectItem>
                              <SelectItem value="201-500">201-500 employees</SelectItem>
                              <SelectItem value="500+">500+ employees</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select onValueChange={(v) => setRecruiterCompany({ ...recruiterCompany, industry: v })}>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue placeholder="Industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="IT & Software">IT & Software</SelectItem>
                              <SelectItem value="Banking & Finance">Banking & Finance</SelectItem>
                              <SelectItem value="Healthcare">Healthcare</SelectItem>
                              <SelectItem value="Education">Education</SelectItem>
                              <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="Retail">Retail</SelectItem>
                              <SelectItem value="Hospitality">Hospitality</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="relative md:col-span-2">
                            <MapPin className="absolute left-3 top-3 text-white/40 h-5 w-5" />
                            <Textarea
                              placeholder="Complete Address"
                              value={recruiterCompany.address}
                              onChange={(e) => setRecruiterCompany({ ...recruiterCompany, address: e.target.value })}
                              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[80px]"
                            />
                          </div>
                          <div className="relative md:col-span-2">
                            <Textarea
                              placeholder="Company Description"
                              value={recruiterCompany.description}
                              onChange={(e) => setRecruiterCompany({ ...recruiterCompany, description: e.target.value })}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[100px]"
                            />
                          </div>
                        </div>

                        <Button 
                          onClick={handleRecruiterSignup} 
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 mt-6"
                        >
                          {isLoading ? "Registering Company..." : "Register as Employer"}
                        </Button>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </TabsContent>

              {/* OAuth Buttons - NOW INSIDE TABS */}
              {/* Divider */}
              <div className="relative mt-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-transparent text-white/40">Or sign up with</span>
                </div>
              </div>

              {/* OAuth Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.location.href = `/api/auth/google?role=${activeTab}`}
                  className="border-white/20 text-white hover:bg-white/20"
                >
                  <Chrome className="h-4 w-4 mr-2" />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.location.href = `/api/auth/github?role=${activeTab}`}
                  className="border-white/20 text-white hover:bg-white/20"
                >
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </Button>
              </div>
            </Tabs>

            {/* Sign In Link - OUTSIDE TABS */}
            <p className="text-center text-white/60 mt-8">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300 font-semibold">
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}