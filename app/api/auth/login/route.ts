// // app/api/auth/login/route.ts
// import { NextRequest, NextResponse } from 'next/server'
// import bcrypt from 'bcryptjs'
// import { prisma } from '@/lib/prisma'
// import { generateToken } from '@/lib/jwt'
// import { setAuthCookie } from '@/lib/cookies'

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json()
//     const { email, password } = body

//     // Validation
//     if (!email || !password) {
//       return NextResponse.json(
//         { error: 'Email and password required' },
//         { status: 400 }
//       )
//     }

//     // Find user
//     const user = await prisma.user.findUnique({
//       where: { email },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         password: true,
//         role: true,
//         image: true,
//         isActive: true,
//       },
//     })

//     if (!user || !user.password) {
//       return NextResponse.json(
//         { error: 'Invalid credentials' },
//         { status: 401 }
//       )
//     }

//     // Verify password
//     const isValid = await bcrypt.compare(password, user.password)
//     if (!isValid) {
//       return NextResponse.json(
//         { error: 'Invalid credentials' },
//         { status: 401 }
//       )
//     }
//     if(!user.isActive) {
//       return NextResponse.json(
//         {error: "Account is deactived"},
//         { status: 401 }
//       )
//     }

//     // Generate token
//     const token = generateToken({
//       id: user.id,
//       email: user.email,
//       name: user.name || '',
//       role: user.role,
//     })

//     let redirectUrl = '/dashboard/candidate'
//     if (user.role === "RECRUITER" ) {
//       redirectUrl = "/recruiter/dashboard"
//     } else if (user.role === "ADMIN"){
//       redirectUrl = "/admin/dashboard"
//     }

//     // Create response
//     const response = NextResponse.json({
//       success: true,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         image: user.image,
//       },
//       redirectUrl,
//     })

//     // Set cookie
//     return setAuthCookie(response, token)
//   } catch (error) {
//     console.error('Login error:', error)
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// }



// app/api/auth/login/route.ts - Make sure redirect URL is correct
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { generateToken } from "@/lib/jwt"
import { setAuthCookie } from "@/lib/cookies"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        image: true,
        isActive: true,
      },
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Account is deactivated" },
        { status: 401 }
      )
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name || "",
      role: user.role,
    })

    // ✅ FIXED: Determine redirect URL based on role
    let redirectUrl = "/dashboard/candidate"
    if (user.role === "RECRUITER") {
      redirectUrl = "/recruiter/dashboard"
    } else if (user.role === "ADMIN") {
      redirectUrl = "/admin/dashboard"
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
      redirectUrl,
    })

    return setAuthCookie(response, token)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}