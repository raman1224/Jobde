// components/providers/auth-provider.tsx
"use client"

import { SessionProviderWrapper } from "./session-provider"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProviderWrapper>{children}</SessionProviderWrapper>
}