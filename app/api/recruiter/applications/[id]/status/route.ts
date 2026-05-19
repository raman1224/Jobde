// app/api/recruiter/applications/[id]/status/route.ts - UPDATED
import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(req)
    
    if (!user || user.role !== "RECRUITER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status, interview } = await req.json()
    const applicationId = params.id

    // Get application details
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          include: {
            company: true
          }
        },
        candidate: true
      }
    })

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    // Update application status
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status: status },
    })

    // If scheduling interview, create interview record
    if (status === "INTERVIEW_SCHEDULED" && interview) {
      await prisma.interview.upsert({
        where: { applicationId: applicationId },
        update: {
          scheduledFor: new Date(interview.scheduledFor),
          type: interview.type,
          meetingLink: interview.meetingLink,
          notes: interview.notes,
          duration: interview.duration || 60,
          status: "SCHEDULED",
        },
        create: {
          applicationId: applicationId,
          scheduledFor: new Date(interview.scheduledFor),
          type: interview.type,
          meetingLink: interview.meetingLink,
          notes: interview.notes,
          duration: interview.duration || 60,
          status: "SCHEDULED",
        },
      })
    }

    // Send notification to candidate
    await prisma.notification.create({
      data: {
        userId: application.candidateId,
        type: "APPLICATION_UPDATE",
        title: "Application Status Updated",
        message: `Your application for ${application.job.title} has been ${status.toLowerCase()}`,
        read: false,
      }
    })

    // If interview scheduled, send additional notification
    if (status === "INTERVIEW_SCHEDULED" && interview) {
      await prisma.notification.create({
        data: {
          userId: application.candidateId,
          type: "INTERVIEW_SCHEDULED",
          title: "Interview Scheduled",
          message: `Interview scheduled for ${new Date(interview.scheduledFor).toLocaleString()}`,
          read: false,
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Application ${status.toLowerCase()}`,
      application: updatedApplication 
    })
  } catch (error) {
    console.error("Update application status error:", error)
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
  }
}