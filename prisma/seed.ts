// prisma/seed.ts
// import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@/generated/prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jobportal.com' },
    update: {},
    create: {
      email: 'admin@jobportal.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: new Date(),
      profile: {
        create: {
          bio: 'System Administrator'
        }
      }
    }
  })

  console.log('Created admin user:', admin.email)

  // Create sample skills
  const skills = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
    'Python', 'Django', 'FastAPI', 'Java', 'Spring Boot',
    'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL',
    'GraphQL', 'REST API', 'Tailwind CSS', 'Machine Learning', 'AI'
  ]

  for (const skillName of skills) {
    await prisma.skill.upsert({
      where: { name: skillName },
      update: {},
      create: { name: skillName }
    })
  }

  console.log('Created skills')

  // Create sample company
  const company = await prisma.company.upsert({
    where: { name: 'TechCorp Nepal' },
    update: {},
    create: {
      name: 'TechCorp Nepal',
      description: 'Leading technology company in Nepal specializing in web and mobile development.',
      industry: 'Software Development',
      size: '50-200',
      headquarters: 'Kathmandu, Nepal',
      isVerified: true,
      website: 'https://techcorp.com.np'
    }
  })

  console.log('Created company:', company.name)

  // Create recruiter user
  const recruiterPassword = await bcrypt.hash('Recruiter123!', 10)
  const recruiter = await prisma.user.upsert({
    where: { email: 'recruiter@techcorp.com' },
    update: {},
    create: {
      email: 'recruiter@techcorp.com',
      password: recruiterPassword,
      name: 'John Recruiter',
      role: 'RECRUITER',
      emailVerified: new Date(),
      companyId: company.id,
      profile: {
        create: {
          phone: '+977-1234567890',
          location: 'Kathmandu, Nepal'
        }
      }
    }
  })

  console.log('Created recruiter:', recruiter.email)

  type SampleJob = {
    title: string
    description: string
    requirements: string
    salaryMin: number
    salaryMax: number
    location: string
    locationType: 'HYBRID' | 'REMOTE' | 'ONSITE'
    employmentType: 'FULL_TIME'
    experienceLevel: 'SENIOR' | 'MID'
    benefits: string[]
    applicationDeadline: Date
    skills: string[]
  }

  // Create sample jobs
  const sampleJobs: SampleJob[] = [
    {
      title: 'Senior Full Stack Developer',
      description: 'We are looking for an experienced Full Stack Developer to join our team...',
      requirements: '5+ years of experience with React, Node.js, and TypeScript...',
      salaryMin: 80000,
      salaryMax: 120000,
      location: 'Kathmandu, Nepal',
      locationType: 'HYBRID',
      employmentType: 'FULL_TIME',
      experienceLevel: 'SENIOR',
      benefits: ['Health Insurance', 'Flexible Hours', 'Remote Work Options', 'Learning Budget'],
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL']
    },
    {
      title: 'Frontend Developer',
      description: 'Join our frontend team to build amazing user interfaces...',
      requirements: 'Strong knowledge of React, Next.js, and Tailwind CSS...',
      salaryMin: 50000,
      salaryMax: 80000,
      location: 'Remote',
      locationType: 'REMOTE',
      employmentType: 'FULL_TIME',
      experienceLevel: 'MID',
      benefits: ['Health Insurance', 'Work from Home', 'Equipment Stipend'],
      applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS']
    },
    {
      title: 'DevOps Engineer',
      description: 'Looking for a DevOps engineer to manage our cloud infrastructure...',
      requirements: 'Experience with AWS, Docker, Kubernetes, and CI/CD pipelines...',
      salaryMin: 90000,
      salaryMax: 130000,
      location: 'Kathmandu, Nepal',
      locationType: 'ONSITE',
      employmentType: 'FULL_TIME',
      experienceLevel: 'SENIOR',
      benefits: ['Health Insurance', 'Company Vehicle', 'Bonus Program'],
      applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform']
    }
  ]

  for (const jobData of sampleJobs) {
    const { skills: skillNames, ...jobInfo } = jobData
    
    const job = await prisma.job.create({
      data: {
        ...jobInfo,
        companyId: company.id
      }
    })

    // Connect skills
    for (const skillName of skillNames) {
      const skill = await prisma.skill.findUnique({ where: { name: skillName } })
      if (skill) {
        await prisma.job.update({
          where: { id: job.id },
          data: {
            skills: {
              connect: { id: skill.id }
            }
          }
        })
      }
    }
    
    console.log('Created job:', job.title)
  }

  // Create sample candidate
  const candidatePassword = await bcrypt.hash('Candidate123!', 10)
  const candidate = await prisma.user.upsert({
    where: { email: 'candidate@example.com' },
    update: {},
    create: {
      email: 'candidate@example.com',
      password: candidatePassword,
      name: 'Sarah Candidate',
      role: 'CANDIDATE',
      emailVerified: new Date(),
      profile: {
        create: {
          phone: '+977-9876543210',
          location: 'Kathmandu, Nepal',
          bio: 'Passionate developer with 3 years of experience in web development.',
          linkedin: 'https://linkedin.com/in/sarah',
          github: 'https://github.com/sarah'
        }
      },
      candidateProfile: {
        create: {
          title: 'Full Stack Developer',
          skills: {
            connect: [
              { name: 'JavaScript' },
              { name: 'TypeScript' },
              { name: 'React' },
              { name: 'Node.js' }
            ]
          },
          experience: {
            create: [
              {
                title: 'Frontend Developer',
                company: 'WebSolutions Pvt Ltd',
                location: 'Kathmandu, Nepal',
                startDate: new Date(2021, 0, 1),
                current: true,
                description: 'Developed responsive web applications using React and TypeScript.'
              }
            ]
          },
          education: {
            create: [
              {
                degree: 'Bachelor in Computer Science',
                institution: 'Kathmandu University',
                field: 'Computer Science',
                startDate: new Date(2017, 0, 1),
                endDate: new Date(2021, 0, 1)
              }
            ]
          }
        }
      }
    }
  })

  console.log('Created candidate:', candidate.email)

  // Create sample application
  const jobs = await prisma.job.findMany()
  if (jobs.length > 0) {
    await prisma.application.create({
      data: {
        jobId: jobs[0].id,
        candidateId: candidate.id,
        status: 'APPLIED',
        matchScore: 85.5,
        coverLetter: 'I am very excited about this opportunity...',
        appliedAt: new Date()
      }
    })
    console.log('Created sample application')
  }

  console.log('Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })