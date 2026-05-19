
// app/api/auth/google/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const role = searchParams.get("role") || "CANDIDATE"
  
  console.log("🔵 Google OAuth initiated with role:", role)
  
  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
  googleAuthUrl.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID!)
  googleAuthUrl.searchParams.set("redirect_uri", `${process.env.NEXTAUTH_URL}/api/auth/google/callback`)
  googleAuthUrl.searchParams.set("response_type", "code")
  googleAuthUrl.searchParams.set("scope", "email profile")
  googleAuthUrl.searchParams.set("access_type", "offline")
  googleAuthUrl.searchParams.set("state", role) // Pass role as state
  
  return NextResponse.redirect(googleAuthUrl)
}