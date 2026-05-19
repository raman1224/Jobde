// hooks/use-session.ts
"use client"

import { useSession as useNextAuthSession } from "next-auth/react"
import { useEffect, useRef } from "react"

export function useSession() {
  const session = useNextAuthSession()
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  return session
}