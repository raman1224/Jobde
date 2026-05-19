// // // prisma.config.ts
// // import 'dotenv/config';
// // import { defineConfig, env } from 'prisma/config';

// // export default defineConfig({
// //   schema: 'prisma/schema.prisma',
// //     migrations: {
// //     path: "prisma/migrations",
// //   },
// //   datasource: {
// //     url: env('DIRECT_URL'),
// //   },
// // });



// // prisma.config.ts
// // Prisma 7: This is where the DATABASE URL lives (not schema.prisma)
// // For Neon: use DIRECT_URL for migrations, DATABASE_URL (pooler) for queries

// import 'dotenv/config'
// import { defineConfig } from 'prisma/config'

// export default defineConfig({
//   schema: 'prisma/schema.prisma',
//   migrations: {
//     path: 'prisma/migrations',
//   },
//   datasource: {
//     // ✅ Use DIRECT_URL for Prisma Migrate (non-pooled connection)
//     // Use DATABASE_URL (pooler) at runtime via the Pool in lib/prisma.ts
//     url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '',
//   },
// })


import 'dotenv/config'
import { defineConfig, env } from "prisma/config"

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
})