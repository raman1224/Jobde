// // app/api/auth/github/callback/route.ts - COMPLETE FIXED VERSION
// import { NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
// import { generateToken } from "@/lib/jwt"
// import { setAuthCookie } from "@/lib/cookies"

// export async function GET(req: NextRequest) {
//   const searchParams = req.nextUrl.searchParams
//   const code = searchParams.get("code")
//   const error = searchParams.get("error")
//   const state = searchParams.get("state") || "CANDIDATE"

//   console.log("🟢 GitHub Callback received with role:", state)

//   if (error) {
//     console.error("GitHub OAuth error:", error)
//     return NextResponse.redirect(new URL("/auth/signin?error=oauth_failed", req.url))
//   }

//   if (!code) {
//     return NextResponse.redirect(new URL("/auth/signin?error=no_code", req.url))
//   }

//   try {
//     // Exchange code for token
//     const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
//       method: "POST",
//       headers: { 
//         "Content-Type": "application/json",
//         "Accept": "application/json"
//       },
//       body: JSON.stringify({
//         client_id: process.env.GITHUB_CLIENT_ID,
//         client_secret: process.env.GITHUB_CLIENT_SECRET,
//         code,
//         redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/github/callback`,
//       }),
//     })

//     const tokens = await tokenResponse.json()
    
//     if (tokens.error) {
//       console.error("GitHub token error:", tokens.error)
//       return NextResponse.redirect(new URL("/auth/signin?error=token_failed", req.url))
//     }

//     // Get user info
//     const userResponse = await fetch("https://api.github.com/user", {
//       headers: { Authorization: `Bearer ${tokens.access_token}` },
//     })
//     const githubUser = await userResponse.json()

//     // Get primary email
//     const emailResponse = await fetch("https://api.github.com/user/emails", {
//       headers: { Authorization: `Bearer ${tokens.access_token}` },
//     })
//     const emails = await emailResponse.json()
//     const primaryEmail = emails.find((e: any) => e.primary)?.email || emails[0]?.email

//     if (!primaryEmail) {
//       return NextResponse.redirect(new URL("/auth/signin?error=no_email", req.url))
//     }

//     // Check if user already exists - WITHOUT include company
//     let existingUser = await prisma.user.findUnique({
//       where: { email: primaryEmail },
//     })

//     let redirectUrl = "/dashboard/candidate"
//     let userRole: "CANDIDATE" | "RECRUITER" = "CANDIDATE"

//     if (existingUser) {
//       // User exists - use their existing role
//       userRole = existingUser.role as "CANDIDATE" | "RECRUITER"
//       redirectUrl = userRole === "RECRUITER" ? "/recruiter/dashboard" : "/dashboard/candidate"
//       console.log("🟢 Existing user found, role:", userRole)
//     } else {
//       // Create new user
//       userRole = state === "RECRUITER" ? "RECRUITER" : "CANDIDATE"
//       redirectUrl = userRole === "RECRUITER" ? "/recruiter/welcome" : "/dashboard/candidate"
      
//       await prisma.user.create({
//         data: {
//           email: primaryEmail,
//           name: githubUser.name || githubUser.login,
//           image: githubUser.avatar_url,
//           role: userRole,
//           emailVerified: new Date(),
//           profile: {
//             create: {},
//           },
//         },
//       })
//       console.log("🟢 New user created with role:", userRole)
//     }

//     // Get the user again to generate token
//     const user = await prisma.user.findUnique({
//       where: { email: primaryEmail },
//     })

//     if (!user) {
//       return NextResponse.redirect(new URL("/auth/signin?error=user_not_found", req.url))
//     }

//     // Generate token
//     const token = generateToken({
//       id: user.id,
//       email: user.email,
//       name: user.name || "",
//       role: user.role,
//     })

//     const response = NextResponse.redirect(new URL(redirectUrl, req.url))
//     setAuthCookie(response, token)
    
//     console.log("🟢 Final redirect to:", redirectUrl)
//     return response
    
//   } catch (error) {
//     console.error("GitHub OAuth error:", error)
//     return NextResponse.redirect(new URL("/auth/signin?error=server_error", req.url))
//   }
// }



// app/api/auth/github/callback/route.ts - FIXED for Admin
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateToken } from "@/lib/jwt"
import { setAuthCookie } from "@/lib/cookies"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const state = searchParams.get("state") || "CANDIDATE"

  if (error) {
    console.error("GitHub OAuth error:", error)
    return NextResponse.redirect(new URL("/auth/signin?error=oauth_failed", req.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL("/auth/signin?error=no_code", req.url))
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/github/callback`,
      }),
    })

    const tokens = await tokenResponse.json()
    
    if (tokens.error) {
      console.error("GitHub token error:", tokens.error)
      return NextResponse.redirect(new URL("/auth/signin?error=token_failed", req.url))
    }

    // Get user info
    const userResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const githubUser = await userResponse.json()

    // Get primary email
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const emails = await emailResponse.json()
    const primaryEmail = emails.find((e: any) => e.primary)?.email || emails[0]?.email

    if (!primaryEmail) {
      return NextResponse.redirect(new URL("/auth/signin?error=no_email", req.url))
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: primaryEmail },
    })

    let redirectUrl = "/dashboard/candidate"

    if (user) {
      // ✅ FIXED: Redirect based on user's role
      if (user.role === "ADMIN") {
        redirectUrl = "/admin/dashboard"
      } else if (user.role === "RECRUITER") {
        redirectUrl = "/recruiter/dashboard"
      } else {
        redirectUrl = "/dashboard/candidate"
      }
      console.log("🟢 Existing user role:", user.role, "→ Redirecting to:", redirectUrl)
    } else {
      const requestedRole = state === "RECRUITER" ? "RECRUITER" : "CANDIDATE"
      redirectUrl = requestedRole === "RECRUITER" ? "/recruiter/welcome" : "/dashboard/candidate"
      
      user = await prisma.user.create({
        data: {
          email: primaryEmail,
          name: githubUser.name || githubUser.login,
          image: githubUser.avatar_url,
          role: requestedRole,
          emailVerified: new Date(),
          profile: {
            create: {},
          },
        },
      })
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
    
    return response
  } catch (error) {
    console.error("GitHub OAuth error:", error)
    return NextResponse.redirect(new URL("/auth/signin?error=server_error", req.url))
  }
}