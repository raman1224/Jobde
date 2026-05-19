// lib/ai/resume-matcher.ts
import { prisma } from "@/lib/prisma"

interface MatchResult {
  score: number
  insights: string[]
  matchedSkills: string[]
  missingSkills: string[]
  experienceMatch: number
  overallRating: string
}

export class ResumeMatcher {
  async calculateMatchScore(
    candidateId: string,
    jobId: string
  ): Promise<MatchResult> {
    const candidate = await prisma.candidateProfile.findUnique({
      where: { userId: candidateId },
      include: {
        skills: true,
        experience: true,
        education: true,
      },
    })

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        skills: true,
        company: true,
      },
    })

    if (!candidate || !job) {
      throw new Error("Candidate or Job not found")
    }

    // Skill match calculation
    const candidateSkillNames = candidate.skills.map(s => s.name.toLowerCase())
    const jobSkillNames = job.skills.map(s => s.name.toLowerCase())
    
    const matchedSkills = candidateSkillNames.filter(skill =>
      jobSkillNames.includes(skill)
    )
    
    const missingSkills = jobSkillNames.filter(skill =>
      !candidateSkillNames.includes(skill)
    )
    
    const skillMatchScore = (matchedSkills.length / jobSkillNames.length) * 100

    // Experience level match
    const experienceLevels = {
      ENTRY: 1,
      JUNIOR: 2,
      MID: 3,
      SENIOR: 4,
      LEAD: 5,
      EXECUTIVE: 6,
    }
    
    const requiredLevel = experienceLevels[job.experienceLevel]
    const candidateYears = this.calculateTotalExperience(candidate.experience)
    const candidateLevel = this.getExperienceLevel(candidateYears)
    
    let experienceMatch = 100
    if (candidateLevel < requiredLevel) {
      const diff = requiredLevel - candidateLevel
      experienceMatch = Math.max(0, 100 - diff * 20)
    }

    // Keywords match (from resume content if analyzed)
    let keywordsMatch = 100
    if (candidate.resumeAnalyzed && candidate.resumeUrl) {
      const resumeText = await this.extractResumeText(candidate.resumeUrl)
      keywordsMatch = this.calculateKeywordMatch(resumeText, job)
    }

    // Calculate final score
    const finalScore = (
      skillMatchScore * 0.5 +
      experienceMatch * 0.3 +
      keywordsMatch * 0.2
    )

    // Generate insights
    const insights = this.generateInsights(
      finalScore,
      matchedSkills,
      missingSkills,
      experienceMatch
    )

    return {
      score: Math.round(finalScore),
      insights,
      matchedSkills,
      missingSkills,
      experienceMatch,
      overallRating: this.getRating(finalScore),
    }
  }

  private calculateTotalExperience(experience: any[]): number {
    let totalYears = 0
    for (const exp of experience) {
      const start = new Date(exp.startDate)
      const end = exp.endDate ? new Date(exp.endDate) : new Date()
      const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365)
      totalYears += years
    }
    return Math.round(totalYears)
  }

  private getExperienceLevel(years: number): number {
    if (years < 1) return 1
    if (years < 2) return 2
    if (years < 4) return 3
    if (years < 7) return 4
    if (years < 10) return 5
    return 6
  }

  private async extractResumeText(resumeUrl: string): Promise<string> {
    // Implementation for PDF text extraction
    // This would call a service to extract text from Cloudinary PDF
    return ""
  }

  private calculateKeywordMatch(text: string, job: { skills: { name: string }[]; description: string }): number {
    const keywords = [
      ...job.skills.map((s: { name: string }) => s.name.toLowerCase()),
      ...job.description.toLowerCase().split(" ").slice(0, 100),
    ]
    
    let matchCount = 0
    for (const keyword of keywords) {
      if (text.toLowerCase().includes(keyword)) {
        matchCount++
      }
    }
    
    return (matchCount / keywords.length) * 100
  }

  private generateInsights(
    score: number,
    matchedSkills: string[],
    missingSkills: string[],
    experienceMatch: number
  ): string[] {
    const insights = []

    if (score >= 80) {
      insights.push("Excellent match! You're highly qualified for this position.")
    } else if (score >= 60) {
      insights.push("Good match! You meet many of the requirements.")
    } else {
      insights.push("Consider gaining experience in the missing areas.")
    }

    if (matchedSkills.length > 0) {
      insights.push(`Your strong skills: ${matchedSkills.slice(0, 3).join(", ")}`)
    }

    if (missingSkills.length > 0) {
      insights.push(`Consider developing: ${missingSkills.slice(0, 3).join(", ")}`)
    }

    if (experienceMatch < 70) {
      insights.push("Your experience level is below the preferred range.")
    }

    return insights
  }

  private getRating(score: number): string {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Needs Improvement"
  }
}