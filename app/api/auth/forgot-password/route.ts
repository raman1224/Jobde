// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import jwt from "jsonwebtoken"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET || "reset-secret-key"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // For security, don't reveal that user doesn't exist
      return NextResponse.json({ 
        message: "If an account exists, you will receive a reset link" 
      }, { status: 200 })
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_RESET_SECRET,
      { expiresIn: "1h" }
    )

    // Store token in database (optional - for additional security)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        // You can add resetToken and resetTokenExpiry fields if needed
      },
    })

    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`

    // Send email
    await resend.emails.send({
      from: "Jobde <noreply@jobde.com>",
      to: [email],
      subject: "Reset Your Password - Jobde",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb, #ea580c); padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: white; margin: 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
            .warning { color: #dc2626; font-size: 14px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Jobde</h1>
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>Hello ${user.name || "User"},</p>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              <p>Or copy this link: <br/><a href="${resetUrl}">${resetUrl}</a></p>
              <p class="warning">⚠️ This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
              <hr />
              <p style="font-size: 14px;">For security, this link can only be used once.</p>
            </div>
            <div class="footer">
              <p>© 2024 Jobde. All rights reserved.</p>
              <p>Kathmandu, Nepal</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ message: "Reset link sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Failed to send reset link" }, { status: 500 })
  }
}