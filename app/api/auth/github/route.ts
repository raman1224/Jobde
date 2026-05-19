

// app/api/auth/github/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const role = searchParams.get("role") || "CANDIDATE"
  
  console.log("🔵 GitHub OAuth initiated with role:", role)
  
  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize")
  githubAuthUrl.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID!)
  githubAuthUrl.searchParams.set("redirect_uri", `${process.env.NEXTAUTH_URL}/api/auth/github/callback`)
  githubAuthUrl.searchParams.set("scope", "user:email")
  githubAuthUrl.searchParams.set("state", role)
  
  return NextResponse.redirect(githubAuthUrl)
}