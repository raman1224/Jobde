
// components/auth/auth-provider.tsx - Add OAuth methods
"use client"

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: string
  image?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, role: string) => Promise<void>
  logout: () => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithGithub: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Login failed')
    }

    await fetchUser()
    window.location.href = '/dashboard/candidate'
  }

  const signup = async (name: string, email: string, password: string, role: string) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Signup failed')
    }

    await login(email, password)
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    window.location.href = '/'
  }
const loginWithGoogle = async (role: string = "CANDIDATE") => {
  window.location.href = `/api/auth/google?role=${role}`
}

const loginWithGithub = async (role: string = "CANDIDATE") => {
  window.location.href = `/api/auth/github?role=${role}`
}

  // const loginWithGoogle = async () => {
  //   window.location.href = '/api/auth/google'
  // }

  // const loginWithGithub = async () => {
  //   window.location.href = '/api/auth/github'
  // }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, loginWithGoogle, loginWithGithub }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}