// // scripts/create-admin.ts
// import { PrismaClient } from "@prisma/client"
// // import { PrismaClient } from '@/generated/prisma/client'
// import bcrypt from "bcryptjs"

// const prisma = new PrismaClient()

// async function main() {
//   const adminEmail = "dangolraman3@gmail.com"
//   const adminPassword = "Raman@123#"
//   const adminName = "Raman Dangol"
  
//   const existingAdmin = await prisma.user.findUnique({
//     where: { email: adminEmail },
//   })
  
//   if (existingAdmin) {
//     console.log("Admin already exists")
//     return
//   }
  
//   const hashedPassword = await bcrypt.hash(adminPassword, 10)
  
//   const admin = await prisma.user.create({
//     data: {
//       email: adminEmail,
//       password: hashedPassword,
//       name: adminName,
//       role: "ADMIN",
//       isActive: true,
//       emailVerified: new Date(),
//       profile: {
//         create: {},
//       },
//     },
//   })
  
//   console.log("Admin created:", admin.email)
//   console.log("Password:", adminPassword)
// }

// main()
//   .catch(console.error)
//   .finally(() => prisma.$disconnect())


// scripts/create-admin.ts - Simplified version
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = "dangolraman3@gmail.com"
  const adminPassword = "Raman@123#"
  const adminName = "Raman Dangol"
  
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    })
    
    if (existingAdmin) {
      console.log("✅ Admin already exists!")
      console.log("📧 Email:", adminEmail)
      console.log("👤 Role:", existingAdmin.role)
      return
    }
    
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: "ADMIN",
        isActive: true,
        emailVerified: new Date(),
        profile: {
          create: {},
        },
      },
    })
    
    console.log("✅ Admin created successfully!")
    console.log("📧 Email:", admin.email)
    console.log("🔑 Password:", adminPassword)
    console.log("👤 Role: ADMIN")
    console.log("🆔 ID:", admin.id)
    
  } catch (error) {
    console.error("Error creating admin:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()