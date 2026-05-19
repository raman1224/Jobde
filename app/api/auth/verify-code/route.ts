// app/api/auth/verify-code/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyCode } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json()
    
    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      )
    }
    
    const isValid = verifyCode(email, code)
    
    if (isValid) {
      return NextResponse.json(
        { message: 'Email verified successfully' },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Verify code error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


// // app/api/auth/verify-code/route.ts
// import { NextRequest, NextResponse } from 'next/server'

// // Same Map to store codes
// const verificationCodes = new Map<string, { code: string; expiresAt: number }>()

// export async function POST(req: NextRequest) {
//   try {
//     const { email, code } = await req.json()
    
//     if (!email || !code) {
//       return NextResponse.json(
//         { error: 'Email and code are required' },
//         { status: 400 }
//       )
//     }
    
//     // 🔥 SIMPLE FIX: Auto-verify any code or always succeed for testing
//     // For demo: if code is '123456' or any 6-digit number, verify
//     const stored = verificationCodes.get(email)
    
//     // Allow any 6-digit code for easier testing
//     const isValidCode = code === '123456' || (stored && stored.code === code)
    
//     if (isValidCode) {
//       verificationCodes.delete(email)
//       return NextResponse.json(
//         { message: 'Email verified successfully' },
//         { status: 200 }
//       )
//     } else {
//       return NextResponse.json(
//         { error: 'Invalid verification code. Use 123456 for testing.' },
//         { status: 400 }
//       )
//     }
    
//   } catch (error) {
//     console.error('Verify code error:', error)
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// }