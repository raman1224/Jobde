// app/api/auth/send-verification/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sendVerificationEmail } from '@/lib/email'
const verificationCodes = new Map<string, { code: string; expiresAt: number }>()

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }
    
    const result = await sendVerificationEmail(email, name || 'User')
    
    if (result.success) {
      return NextResponse.json(
        { message: 'Verification code sent successfully' },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send verification code' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Send verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// // app/api/auth/send-verification/route.ts - CONSOLE ONLY VERSION
// import { NextRequest, NextResponse } from "next/server"

// // Store verification codes in memory
// const verificationCodes = new Map<string, { code: string; expiresAt: number }>()

// export async function POST(req: NextRequest) {
//   try {
//     const { email, name } = await req.json()
    
//     if (!email) {
//       return NextResponse.json({ error: "Email is required" }, { status: 400 })
//     }

//     // Generate 6-digit code
//     const code = Math.floor(100000 + Math.random() * 900000).toString()
//     const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes
    
//     // Store code
//     verificationCodes.set(email, { code, expiresAt })
    
//     // ✅ DISPLAY CODE IN TERMINAL (CONSOLE)
//     console.log("\n" + "=".repeat(60))
//     console.log(`📧 EMAIL VERIFICATION`)
//     console.log("=".repeat(60))
//     console.log(`📧 To: ${email}`)
//     console.log(`📧 Name: ${name || "User"}`)
//     console.log(`📧 Verification Code: ${code}`)
//     console.log(`📧 Expires in: 10 minutes`)
//     console.log("=".repeat(60) + "\n")
    
//     // Also show in development response
//     return NextResponse.json({ 
//       message: "Verification code sent! Check terminal console.",
//       debugCode: process.env.NODE_ENV === "development" ? code : undefined
//     }, { status: 200 })
    
//   } catch (error) {
//     console.error("Error:", error)
//     return NextResponse.json({ error: "Failed to send code" }, { status: 500 })
//   }
// }