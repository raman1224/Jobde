// lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Store verification codes temporarily (in production use Redis/Database)
const verificationCodes = new Map<string, { code: string; expiresAt: number }>()

export async function sendVerificationEmail(email: string, name: string) {
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes expiry
  
  // Store code (in production use Redis or Database)
  verificationCodes.set(email, { code: verificationCode, expiresAt })
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Jobde <onboarding@resend.dev>',
      to: [email],
      subject: 'Verify your email for Jobde',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; background: linear-gradient(135deg, #2563eb, #ea580c); border-radius: 10px 10px 0 0; }
            .header h1 { color: white; margin: 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .code { font-size: 32px; font-weight: bold; text-align: center; padding: 20px; background: white; border-radius: 10px; letter-spacing: 5px; font-family: monospace; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #6b7280; }
            .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Jobde</h1>
            </div>
            <div class="content">
              <h2>Hello ${name || 'there'}!</h2>
              <p>Thank you for registering with Jobde - Nepal's #1 Job Platform.</p>
              <p>Please use the verification code below to complete your registration:</p>
              <div class="code">${verificationCode}</div>
              <p>This code will expire in <strong>10 minutes</strong>.</p>
              <p>If you didn't request this, please ignore this email.</p>
              <hr />
              <p style="font-size: 14px; text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/signup" class="button">Complete Registration</a>
              </p>
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

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

export function verifyCode(email: string, code: string): boolean {
  const stored = verificationCodes.get(email)
  
  if (!stored) {
    return false
  }
  
  if (Date.now() > stored.expiresAt) {
    verificationCodes.delete(email)
    return false
  }
  
  if (stored.code !== code) {
    return false
  }
  
  verificationCodes.delete(email)
  return true
}