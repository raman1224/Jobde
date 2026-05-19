// components/auth/oauth-buttons.tsx
"use client"

import { Chrome, Github } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OAuthButtonsProps {
  mode: "signin" | "signup"
  role?: "CANDIDATE" | "RECRUITER"
}

export function OAuthButtons({ mode, role = "CANDIDATE" }: OAuthButtonsProps) {
  const handleOAuth = (provider: string) => {
    const url = `/api/auth/${provider}?role=${role}&mode=${mode}`
    window.location.href = url
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={() => handleOAuth("google")}
        className="border-white/20 text-white hover:bg-white/20"
      >
        <Chrome className="h-4 w-4 mr-2" />
        Google
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => handleOAuth("github")}
        className="border-white/20 text-white hover:bg-white/20"
      >
        <Github className="h-4 w-4 mr-2" />
        GitHub
      </Button>
    </div>
  )
}