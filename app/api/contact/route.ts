import { Resend } from 'resend'
import { NextResponse } from 'next/server'

// Lazy initialization to avoid build-time errors
let resend: Resend | null = null

function getResend() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured')
    }
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message, type, locale } = body

    // Validate required fields
    if (!name || !email || !subject || !message || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Map type to readable label
    const typeLabels: Record<string, { it: string; en: string }> = {
      question: { it: 'Domanda', en: 'Question' },
      bug: { it: 'Segnalazione Bug', en: 'Bug Report' },
      feature: { it: 'Richiesta Funzionalità', en: 'Feature Request' },
      feedback: { it: 'Feedback', en: 'Feedback' },
      other: { it: 'Altro', en: 'Other' },
    }

    const typeLabel = typeLabels[type]?.[locale as 'it' | 'en'] || type

    // Send email to admin
    const { error } = await getResend().emails.send({
      from: 'THEJORD Contact <noreply@thejord.it>',
      to: ['admin@thejord.it'],
      replyTo: email,
      subject: `[THEJORD] ${typeLabel}: ${subject}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0a0a0f; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #00d9ff; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          </div>
          <div style="background: #1a1a25; padding: 20px; border-radius: 0 0 8px 8px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #888; width: 120px;">Name:</td>
                <td style="padding: 10px 0; color: #e0e0e0;"><strong>${name}</strong></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #888;">Email:</td>
                <td style="padding: 10px 0; color: #00d9ff;"><a href="mailto:${email}" style="color: #00d9ff;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #888;">Type:</td>
                <td style="padding: 10px 0; color: #e0e0e0;">${typeLabel}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #888;">Subject:</td>
                <td style="padding: 10px 0; color: #e0e0e0;"><strong>${subject}</strong></td>
              </tr>
            </table>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #2a2a35;">
              <p style="color: #888; margin: 0 0 10px 0;">Message:</p>
              <div style="background: #0a0a0f; padding: 15px; border-radius: 6px; color: #e0e0e0; white-space: pre-wrap;">${message}</div>
            </div>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #2a2a35; color: #666; font-size: 12px;">
              <p>Sent from thejord.it/${locale}/contact</p>
            </div>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
