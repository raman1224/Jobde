

// lib/auth.ts
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { prompt: 'select_account' } },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null
        const result = loginSchema.safeParse(credentials)
        if (!result.success) return null
        const { email, password } = result.data

        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, email: true, name: true, password: true, role: true, image: true, isActive: true },
        })

        if (!user || !user.password || !user.isActive) return null
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return null

        return { id: user.id, email: user.email, name: user.name, role: user.role, image: user.image }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, trigger }) {
      // Only update token when user first signs in
      if (user) {
        token.id = user.id
        token.role = (user as any).role ?? 'CANDIDATE'
      }
      // For OAuth, fetch role from DB once
      if (account && account.provider !== 'credentials') {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email! },
            select: { id: true, role: true },
          })
          if (dbUser) {
            token.id = dbUser.id
            token.role = dbUser.role
          }
        } catch (e) {
          console.error('JWT DB lookup error:', e)
        }
      }
      return token
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },

  events: {
    async createUser({ user }) {
      try {
        await prisma.profile.upsert({
          where: { userId: user.id },
          update: {},
          create: { userId: user.id },
        })
        await prisma.candidateProfile.upsert({
          where: { userId: user.id },
          update: {},
          create: { userId: user.id },
        })
      } catch (e) {
        console.error('createUser event error:', e)
      }
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  // ✅ CRITICAL: debug must be FALSE — true causes CLIENT_FETCH_ERROR loops
  debug: false,
  secret: process.env.NEXTAUTH_SECRET,
}