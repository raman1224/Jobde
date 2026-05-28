// // // app/auth/signin/page.tsx - WITH OAUTH
// // "use client"
// // export const dynamic = 'force-dynamic';

// // import { useState } from "react"
// // import { useAuth } from "@/components/auth/auth-provider"
// // import Link from "next/link"
// // import { motion } from "framer-motion"
// // import { Eye, EyeOff, Mail, Lock, LogIn, Github, Chrome, Fingerprint } from "lucide-react"
// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// // import { toast } from "sonner"
// // import { useSearchParams } from "next/navigation"

// // export default function SignInPage() {
// //   const { login, loginWithGoogle, loginWithGithub, isLoading } = useAuth()
// //   const [email, setEmail] = useState("")
// //   const [password, setPassword] = useState("")
// //   const [showPassword, setShowPassword] = useState(false)
// //   const [error, setError] = useState("")
// //     const searchParams = useSearchParams()
// //   const redirectUrl = searchParams.get("redirect") || "/dashboard/candidate"

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault()
// //     setError("")
    
// //     if (!email || !password) {
// //       setError("Please fill in all fields")
// //       return
// //     }
    
// //     try {
// //       await login(email, password)
// //             window.location.href = redirectUrl
// //     } catch (err: any) {
// //       setError(err.message || "Invalid email or password")
// //     }
// //   }

// //   const handleGoogleLogin = async () => {
// //     try {
// //       await loginWithGoogle()
// //     } catch (err: any) {
// //       toast.error("Google login failed")
// //     }
// //   }

// //   const handleGithubLogin = async () => {
// //     try {
// //       await loginWithGithub()
// //     } catch (err: any) {
// //       toast.error("GitHub login failed")
// //     }
// //   }

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
// //       <motion.div
// //         initial={{ opacity: 0, y: 20 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ duration: 0.5 }}
// //         className="w-full max-w-md"
// //       >
// //         <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl">
// //           <CardHeader className="text-center">
// //             <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
// //             <CardDescription className="text-white/60">Sign in to your account</CardDescription>
// //           </CardHeader>
          
// //           <CardContent className="space-y-4">
// //             {/* Error Message */}
// //             {error && (
// //               <motion.div
// //                 initial={{ opacity: 0, x: -20 }}
// //                 animate={{ opacity: 1, x: 0 }}
// //                 className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
// //               >
// //                 {error}
// //               </motion.div>
// //             )}

// //             <form onSubmit={handleSubmit} className="space-y-4">
// //               <div className="space-y-2">
// //                 <Label className="text-white">Email</Label>
// //                 <div className="relative">
// //                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
// //                   <Input
// //                     type="email"
// //                     placeholder="name@example.com"
// //                     value={email}
// //                     onChange={(e) => setEmail(e.target.value)}
// //                     className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
// //                     required
// //                   />
// //                 </div>
// //               </div>

// //               <div className="space-y-2">
// //                 <Label className="text-white">Password</Label>
// //                 <div className="relative">
// //                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
// //                   <Input
// //                     type={showPassword ? "text" : "password"}
// //                     placeholder="••••••••"
// //                     value={password}
// //                     onChange={(e) => setPassword(e.target.value)}
// //                     className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
// //                     required
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={() => setShowPassword(!showPassword)}
// //                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
// //                   >
// //                     {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
// //                   </button>
// //                 </div>
// //               </div>

// //               <div className="flex items-center justify-between">
// //                 <Link href="/auth/forgot-password" className="text-sm text-white/60 hover:text-white">
// //                   Forgot password?
// //                 </Link>
// //                 <Link href="/auth/signup" className="text-sm text-white/60 hover:text-white">
// //                   Create account
// //                 </Link>
// //               </div>

// //               <Button 
// //                 type="submit" 
// //                 disabled={isLoading}
// //                 className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
// //               >
// //                 {isLoading ? (
// //                   <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
// //                 ) : (
// //                   <>
// //                     <LogIn className="h-4 w-4 mr-2" />
// //                     Sign In
// //                   </>
// //                 )}
// //               </Button>
// //             </form>

// //             {/* Divider */}
// //             <div className="relative">
// //               <div className="absolute inset-0 flex items-center">
// //                 <div className="w-full border-t border-white/20"></div>
// //               </div>
// //               <div className="relative flex justify-center text-xs uppercase">
// //                 <span className="px-2 bg-transparent text-white/40">Or continue with</span>
// //               </div>
// //             </div>

// //             {/* OAuth Buttons */}
// //             <div className="grid grid-cols-2 gap-3">
// //               <Button
// //                 type="button"
// //                 variant="outline"
// //     onClick={() => window.location.href = "/api/auth/google"}
// //                 // onClick={handleGoogleLogin}
// //                 className="border-white/20 text-white hover:bg-white/20 hover:text-white"
// //               >
// //                 <Chrome className="h-4 w-4 mr-2" />
// //                 Google
// //               </Button>
// //               <Button
// //                 type="button"
// //                 variant="outline"
// //                     onClick={() => window.location.href = "/api/auth/github"}
// //                 // onClick={handleGithubLogin}
// //                 className="border-white/20 text-white hover:bg-white/20 hover:text-white"
// //               >
// //                 <Github className="h-4 w-4 mr-2" />
// //                 GitHub
// //               </Button>
// //             </div>
// //           </CardContent>
          
// //           <CardFooter className="flex justify-center">
// //             <p className="text-sm text-white/40">
// //               By signing in, you agree to our{" "}
// //               <Link href="/terms" className="text-white/60 hover:text-white">Terms</Link>{" "}
// //               and{" "}
// //               <Link href="/privacy" className="text-white/60 hover:text-white">Privacy Policy</Link>
// //             </p>
// //           </CardFooter>
// //         </Card>
// //       </motion.div>
// //     </div>
// //   )
// // }

// "use client"

// import { Suspense, useState } from "react"
// import { useAuth } from "@/components/auth/auth-provider"
// import Link from "next/link"
// import { motion } from "framer-motion"
// import { Eye, EyeOff, Mail, Lock, LogIn, Github, Chrome, Fingerprint } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { toast } from "sonner"
// import { useSearchParams } from "next/navigation"

// // Move all your component logic here
// function SignInContent() {
//   const { login, loginWithGoogle, loginWithGithub, isLoading } = useAuth()
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [error, setError] = useState("")
//   const searchParams = useSearchParams()
//   const redirectUrl = searchParams.get("redirect") || "/dashboard/candidate"

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")
    
//     if (!email || !password) {
//       setError("Please fill in all fields")
//       return
//     }
    
//     try {
//       await login(email, password)
//       window.location.href = redirectUrl
//     } catch (err: any) {
//       setError(err.message || "Invalid email or password")
//     }
//   }

//   const handleGoogleLogin = async () => {
//     try {
//       await loginWithGoogle()
//     } catch (err: any) {
//       toast.error("Google login failed")
//     }
//   }

//   const handleGithubLogin = async () => {
//     try {
//       await loginWithGithub()
//     } catch (err: any) {
//       toast.error("GitHub login failed")
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-md"
//       >
//         <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl">
//           <CardHeader className="text-center">
//             <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
//             <CardDescription className="text-white/60">Sign in to your account</CardDescription>
//           </CardHeader>
          
//           <CardContent className="space-y-4">
//             {/* Error Message */}
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
//               >
//                 {error}
//               </motion.div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label className="text-white">Email</Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
//                   <Input
//                     type="email"
//                     placeholder="name@example.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-white">Password</Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
//                   <Input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="••••••••"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
//                   >
//                     {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </button>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <Link href="/auth/forgot-password" className="text-sm text-white/60 hover:text-white">
//                   Forgot password?
//                 </Link>
//                 <Link href="/auth/signup" className="text-sm text-white/60 hover:text-white">
//                   Create account
//                 </Link>
//               </div>

//               <Button 
//                 type="submit" 
//                 disabled={isLoading}
//                 className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
//               >
//                 {isLoading ? (
//                   <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                 ) : (
//                   <>
//                     <LogIn className="h-4 w-4 mr-2" />
//                     Sign In
//                   </>
//                 )}
//               </Button>
//             </form>

//             {/* Divider */}
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-white/20"></div>
//               </div>
//               <div className="relative flex justify-center text-xs uppercase">
//                 <span className="px-2 bg-transparent text-white/40">Or continue with</span>
//               </div>
//             </div>

//             {/* OAuth Buttons */}
//             <div className="grid grid-cols-2 gap-3">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => window.location.href = "/api/auth/google"}
//                 className="border-white/20 text-white hover:bg-white/20 hover:text-white"
//               >
//                 <Chrome className="h-4 w-4 mr-2" />
//                 Google
//               </Button>
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => window.location.href = "/api/auth/github"}
//                 className="border-white/20 text-white hover:bg-white/20 hover:text-white"
//               >
//                 <Github className="h-4 w-4 mr-2" />
//                 GitHub
//               </Button>
//             </div>
//           </CardContent>
          
//           <CardFooter className="flex justify-center">
//             <p className="text-sm text-white/40">
//               By signing in, you agree to our{" "}
//               <Link href="/terms" className="text-white/60 hover:text-white">Terms</Link>{" "}
//               and{" "}
//               <Link href="/privacy" className="text-white/60 hover:text-white">Privacy Policy</Link>
//             </p>
//           </CardFooter>
//         </Card>
//       </motion.div>
//     </div>
//   )
// }

// // Default export wraps in Suspense
// export default function SignInPage() {
//   return (
//     <Suspense fallback={
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
//       </div>
//     }>
//       <SignInContent />
//     </Suspense>
//   )
// }



// app/auth/signin/page.tsx - UPDATED with role-based redirect
"use client"

import { Suspense, useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, LogIn, Github, Chrome } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useSearchParams, useRouter } from "next/navigation"

function SignInContent() {
  const { login, isLoading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect") || "/dashboard/candidate"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }
    
    try {
      // Call login API directly to get role information
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        toast.success("Login successful!")
        
        // ✅ FIXED: Redirect based on user role from API response
        if (data.user?.role === "ADMIN") {
          window.location.href = "/admin/dashboard"
        } else if (data.user?.role === "RECRUITER") {
          window.location.href = "/recruiter/dashboard"
        } else {
          window.location.href = redirectUrl
        }
      } else {
        setError(data.error || "Invalid email or password")
        toast.error(data.error || "Invalid email or password")
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong")
      toast.error("Login failed")
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google"
  }

  const handleGithubLogin = () => {
    window.location.href = "/api/auth/github"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-white/60">Sign in to your account</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/auth/forgot-password" className="text-sm text-white/60 hover:text-white">
                  Forgot password?
                </Link>
                <Link href="/auth/signup" className="text-sm text-white/60 hover:text-white">
                  Create account
                </Link>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-transparent text-white/40">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="border-white/20 text-white hover:bg-white/20 hover:text-white"
              >
                <Chrome className="h-4 w-4 mr-2" />
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleGithubLogin}
                className="border-white/20 text-white hover:bg-white/20 hover:text-white"
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <p className="text-sm text-white/40">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-white/60 hover:text-white">Terms</Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-white/60 hover:text-white">Privacy Policy</Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}