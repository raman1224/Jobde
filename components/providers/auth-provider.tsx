// components/providers/auth-provider.tsx
"use client"

import { AuthProvider as CustomAuthProvider } from "@/components/auth/auth-provider"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <CustomAuthProvider>{children}</CustomAuthProvider>
}