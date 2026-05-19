
// lib/prisma.ts
// Prisma 7 + PostgreSQL (Neon) with pg adapter
// Uses connection pooling URL for runtime queries

import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const pool = new Pool({
    connectionString,
    // For Neon serverless, max connections should be small
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  })

  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

// Singleton pattern — critical for Next.js to avoid too many connections
export const prisma = globalThis.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export default prisma

// const express = require('express')
// const { PrismaClient } = require('@prisma/client')
// const { PrismaPg } = require('@prisma/adapter-pg')

// const adapter = new PrismaPg({
//   // connectionString: "postgresql://postgres:password@localhost:5432/todosoftware"
//   connectionString: "postgresql://neondb_owner:npg_7TA1NghoPmxM@ep-jolly-mode-ao4tvb68-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
// })


// export default  prisma = new PrismaClient({ adapter })