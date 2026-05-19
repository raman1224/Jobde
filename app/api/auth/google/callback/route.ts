

// app/api/auth/google/callback/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateToken } from "@/lib/jwt"
import { setAuthCookie } from "@/lib/cookies"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const state = searchParams.get("state") // This contains the role

  console.log("🟢 Google Callback received")
  console.log("🟢 State parameter:", state)
  console.log("🟢 Code present:", !!code)

  if (error) {
    console.error("Google OAuth error:", error)
    return NextResponse.redirect(new URL("/auth/signin?error=oauth_failed", req.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL("/auth/signin?error=no_code", req.url))
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    })

    const tokens = await tokenResponse.json()
    
    if (tokens.error) {
      console.error("Google token error:", tokens.error)
      return NextResponse.redirect(new URL("/auth/signin?error=token_failed", req.url))
    }

    // Get user info
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    
    const googleUser = await userResponse.json()

    if (!googleUser.email) {
      return NextResponse.redirect(new URL("/auth/signin?error=no_email", req.url))
    }

    // Determine role from state parameter
    // state can be "CANDIDATE" or "RECRUITER"
    const requestedRole = state === "RECRUITER" ? "RECRUITER" : "CANDIDATE"
    console.log("🟢 Requested role from state:", requestedRole)

    // Check if user already exists
    let existingUser = await prisma.user.findUnique({
      where: { email: googleUser.email },
    })

    let redirectUrl = "/dashboard/candidate"
    let userRole: "CANDIDATE" | "RECRUITER" = "CANDIDATE"

    if (existingUser) {
      // User exists - use their existing role
      userRole = existingUser.role as "CANDIDATE" | "RECRUITER"
      redirectUrl = userRole === "RECRUITER" ? "/recruiter/dashboard" : "/dashboard/candidate"
      console.log("🟢 Existing user found, role:", userRole)
    } else {
      // Create new user with the requested role
      userRole = requestedRole
      
      // Set redirect URL based on role
      if (userRole === "RECRUITER") {
        redirectUrl = "/recruiter/welcome"
        console.log("🟢 New RECRUITER - redirecting to welcome page")
      } else {
        redirectUrl = "/dashboard/candidate"
        console.log("🟢 New CANDIDATE - redirecting to dashboard")
      }
      
      await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          image: googleUser.picture,
          role: userRole,
          emailVerified: new Date(),
          profile: {
            create: {},
          },
        },
      })
      console.log("🟢 New user created with role:", userRole)
    }

    // Get the user again to generate token
    const user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    })

    if (!user) {
      return NextResponse.redirect(new URL("/auth/signin?error=user_not_found", req.url))
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name || "",
      role: user.role,
    })

    const response = NextResponse.redirect(new URL(redirectUrl, req.url))
    setAuthCookie(response, token)
    
    console.log("🟢 FINAL REDIRECT TO:", redirectUrl)
    return response
    
  } catch (error) {
    console.error("Google OAuth error:", error)
    return NextResponse.redirect(new URL("/auth/signin?error=server_error", req.url))
  }
}