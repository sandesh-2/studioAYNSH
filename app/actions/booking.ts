'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { booking, message } from '@/lib/db/schema'
import { and, desc, eq, or } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'

// ── Helpers ────────────────────────────────────────────────────────────────

async function getOptionalUserId(): Promise<string | null> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    return session?.user?.id ?? null
  } catch {
    return null
  }
}

async function getRequiredUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// ── Validation helpers ─────────────────────────────────────────────────────

const VALID_SERVICES = new Set(['wedding', 'prewedding', 'portrait', 'fashion', 'drone', 'other'])
const VALID_STATUSES = new Set(['pending', 'confirmed', 'completed', 'cancelled'])

function sanitize(v: string | undefined, maxLen: number): string | null {
  if (!v) return null
  return v.trim().slice(0, maxLen)
}

function assertNonEmpty(v: string | undefined, field: string): string {
  const s = v?.trim()
  if (!s) throw new Error(`${field} is required`)
  return s
}

// ── Booking submission (public — no auth required) ─────────────────────────

export interface BookingInput {
  clientName: string
  clientEmail: string
  clientPhone: string
  service: string
  eventDate: string
  eventTime?: string
  location: string
  duration?: string
  budget?: string
  guestCount?: string
  shootTheme?: string
  specialRequests?: string
  howHeard?: string
}

export async function createBooking(input: BookingInput) {
  // ── Server-side validation (never trust client) ────────────────────────
  const clientName  = assertNonEmpty(input.clientName, 'Name').slice(0, 120)
  const clientEmail = assertNonEmpty(input.clientEmail, 'Email').toLowerCase().slice(0, 254)
  const clientPhone = assertNonEmpty(input.clientPhone, 'Phone').slice(0, 20)
  const location    = assertNonEmpty(input.location, 'Location').slice(0, 200)
  const service     = assertNonEmpty(input.service, 'Service')
  const eventDate   = assertNonEmpty(input.eventDate, 'Event date')

  // Simple email format check
  if (!/^\S+@\S+\.\S+$/.test(clientEmail)) throw new Error('Invalid email address')

  // Whitelist service values to prevent garbage data
  if (!VALID_SERVICES.has(service)) throw new Error('Invalid service selection')

  const userId = await getOptionalUserId()
  const id = randomUUID()

  await db.insert(booking).values({
    id,
    userId,
    clientName,
    clientEmail,
    clientPhone,
    service,
    eventDate,
    eventTime:       sanitize(input.eventTime, 20),
    location,
    duration:        sanitize(input.duration, 40),
    budget:          sanitize(input.budget, 40),
    guestCount:      sanitize(input.guestCount, 10),
    shootTheme:      sanitize(input.shootTheme, 120),
    specialRequests: sanitize(input.specialRequests, 2000),
    howHeard:        sanitize(input.howHeard, 40),
    status: 'pending',
  })

  // Send confirmation email via resend (graceful no-op if key missing)
  await sendConfirmationEmail({ ...input, clientName, clientEmail }, id)
  
  // Send booking notification to studio owner
  await sendStudioOwnerNotification({
    bookingId: id,
    clientName,
    clientEmail,
    clientPhone,
    service,
    eventDate,
    eventTime: input.eventTime ?? null,
    location,
    duration: input.duration ?? null,
    budget: input.budget ?? null,
    guestCount: input.guestCount ?? null,
    shootTheme: input.shootTheme ?? null,
    specialRequests: input.specialRequests ?? null,
    howHeard: input.howHeard ?? null,
  })

  revalidatePath('/portal')
  revalidatePath('/admin')

  return { success: true, bookingId: id }
}

// ── Email helper ────────────────────────────────────────────────────────────

async function sendConfirmationEmail(input: BookingInput, bookingId: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return // email is optional — skip if key not configured

  const serviceLabels: Record<string, string> = {
    wedding: 'Wedding Photography',
    prewedding: 'Pre-Wedding Photography',
    portrait: 'Portrait Session',
    fashion: 'Fashion Editorial',
    drone: 'Drone Cinematography',
    other: 'Other',
  }

  const serviceName = serviceLabels[input.service] ?? input.service

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="font-family:Georgia,serif;background:#FAF9F6;margin:0;padding:40px 20px;">
      <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #E8E3DB;">
        <div style="background:#1C1A17;padding:32px 40px;">
          <p style="color:#FAF9F6;font-family:Georgia,serif;font-size:22px;letter-spacing:4px;margin:0;">STUDIO AYNSH</p>
          <p style="color:#C4A882;font-size:11px;letter-spacing:3px;margin:6px 0 0;font-family:Arial,sans-serif;text-transform:uppercase;">We Capture The Untold Story</p>
        </div>
        <div style="padding:40px;">
          <p style="font-family:Arial,sans-serif;font-size:13px;color:#6B6560;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px;">Booking Confirmation</p>
          <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:#1C1A17;margin:0 0 24px;">Thank you, ${input.clientName}.</h1>
          <p style="font-family:Arial,sans-serif;font-size:14px;color:#6B6560;line-height:1.7;margin:0 0 32px;">
            Your enquiry has been received. Praveen will personally review your details and reach out within 24 hours to confirm your session.
          </p>
          <div style="border-top:1px solid #E8E3DB;border-bottom:1px solid #E8E3DB;padding:24px 0;margin-bottom:32px;">
            <table style="width:100%;font-family:Arial,sans-serif;font-size:13px;border-collapse:collapse;">
              <tr><td style="color:#6B6560;padding:6px 0;width:40%;">Reference</td><td style="color:#1C1A17;font-weight:600;">${bookingId.slice(0, 8).toUpperCase()}</td></tr>
              <tr><td style="color:#6B6560;padding:6px 0;">Service</td><td style="color:#1C1A17;">${serviceName}</td></tr>
              <tr><td style="color:#6B6560;padding:6px 0;">Date</td><td style="color:#1C1A17;">${input.eventDate}</td></tr>
              ${input.eventTime ? `<tr><td style="color:#6B6560;padding:6px 0;">Time</td><td style="color:#1C1A17;">${input.eventTime}</td></tr>` : ''}
              <tr><td style="color:#6B6560;padding:6px 0;">Location</td><td style="color:#1C1A17;">${input.location}</td></tr>
              ${input.budget ? `<tr><td style="color:#6B6560;padding:6px 0;">Budget</td><td style="color:#1C1A17;">${input.budget}</td></tr>` : ''}
            </table>
          </div>
          <p style="font-family:Arial,sans-serif;font-size:13px;color:#6B6560;line-height:1.7;">
            You can track your booking status anytime through the <a href="${process.env.BETTER_AUTH_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '#')}/portal" style="color:#C4A882;">Client Portal</a>.
          </p>
        </div>
        <div style="background:#F5F3EF;padding:24px 40px;text-align:center;">
          <p style="font-family:Arial,sans-serif;font-size:11px;color:#9E9690;letter-spacing:1px;margin:0;">Studio AYNSH &bull; studioaynsh@gmail.com &bull; +91 98765 43210</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Studio AYNSH <bookings@studioaynsh.com>',
        to: [input.clientEmail],
        subject: `Booking Confirmed — ${serviceName} | Studio AYNSH`,
        html,
      }),
    })
  } catch {
    // Non-critical — booking is already saved
  }
}

async function sendStudioOwnerNotification(bookingDetails: {
  bookingId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  service: string
  eventDate: string
  eventTime: string | null
  location: string
  duration: string | null
  budget: string | null
  guestCount: string | null
  shootTheme: string | null
  specialRequests: string | null
  howHeard: string | null
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return // Skip if Resend key not configured

  const studioEmail = 'samratgupta7754@gmail.com' // Studio owner email — update this

  const serviceLabels: Record<string, string> = {
    wedding: 'Wedding Photography',
    prewedding: 'Pre-Wedding Photography',
    portrait: 'Portrait Session',
    fashion: 'Fashion Editorial',
    drone: 'Drone Cinematography',
    other: 'Other',
  }

  const serviceName = serviceLabels[bookingDetails.service] ?? bookingDetails.service

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="font-family:Arial,sans-serif;background:#F5F3EF;margin:0;padding:20px;">
      <div style="max-width:700px;margin:0 auto;background:#FFFFFF;border:1px solid #E8E3DB;border-radius:8px;overflow:hidden;">
        <div style="background:#1C1A17;padding:24px 32px;">
          <p style="color:#C4A882;font-size:12px;letter-spacing:3px;margin:0;font-weight:600;text-transform:uppercase;">NEW BOOKING ALERT</p>
          <h1 style="color:#FAF9F6;font-size:24px;margin:8px 0 0;font-weight:400;">Booking Reference #${bookingDetails.bookingId.slice(0, 8).toUpperCase()}</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="font-family:Georgia,serif;font-size:20px;color:#1C1A17;margin:0 0 24px;border-bottom:2px solid #E8E3DB;padding-bottom:12px;">Client Details</h2>
          <table style="width:100%;margin-bottom:32px;border-collapse:collapse;">
            <tr style="border-bottom:1px solid #E8E3DB;">
              <td style="padding:10px 0;font-weight:600;color:#1C1A17;width:30%;">Name</td>
              <td style="padding:10px 0;color:#6B6560;">${bookingDetails.clientName}</td>
            </tr>
            <tr style="border-bottom:1px solid #E8E3DB;">
              <td style="padding:10px 0;font-weight:600;color:#1C1A17;">Email</td>
              <td style="padding:10px 0;color:#6B6560;"><a href="mailto:${bookingDetails.clientEmail}" style="color:#C4A882;text-decoration:none;">${bookingDetails.clientEmail}</a></td>
            </tr>
            <tr style="border-bottom:1px solid #E8E3DB;">
              <td style="padding:10px 0;font-weight:600;color:#1C1A17;">Phone</td>
              <td style="padding:10px 0;color:#6B6560;"><a href="tel:${bookingDetails.clientPhone}" style="color:#C4A882;text-decoration:none;">${bookingDetails.clientPhone}</a></td>
            </tr>
          </table>

          <h2 style="font-family:Georgia,serif;font-size:20px;color:#1C1A17;margin:0 0 24px;border-bottom:2px solid #E8E3DB;padding-bottom:12px;">Session Details</h2>
          <table style="width:100%;margin-bottom:32px;border-collapse:collapse;">
            <tr style="border-bottom:1px solid #E8E3DB;">
              <td style="padding:10px 0;font-weight:600;color:#1C1A17;width:30%;">Service</td>
              <td style="padding:10px 0;color:#6B6560;">${serviceName}</td>
            </tr>
            <tr style="border-bottom:1px solid #E8E3DB;">
              <td style="padding:10px 0;font-weight:600;color:#1C1A17;">Event Date</td>
              <td style="padding:10px 0;color:#6B6560;">${bookingDetails.eventDate}</td>
            </tr>
            ${bookingDetails.eventTime ? `<tr style="border-bottom:1px solid #E8E3DB;">
              <td style="padding:10px 0;font-weight:600;color:#1C1A17;">Time</td>
              <td style="padding:10px 0;color:#6B6560;">${bookingDetails.eventTime}</td>
            </tr>` : ''}
            <tr style="border-bottom:1px solid #E8E3DB;">
              <td style="padding:10px 0;font-weight:600;color:#1C1A17;">Location</td>
              <td style="padding:10px 0;color:#6B6560;">${bookingDetails.location}</td>
            </tr>
            ${bookingDetails.duration ? `<tr style="border-bottom:1px solid #E8E3DB;">
              <td style="padding:10px 0;font-weight:600;color:#1C1A17;">Duration</td>
              <td style="padding:10px 0;color:#6B6560;">${bookingDetails.duration}</td>
            </tr>` : ''}
            ${bookingDetails.budget ? `<tr style="border-bottom:1px solid #E8E3DB;">
              <td style="padding:10px 0;font-weight:600;color:#1C1A17;">Budget</td>
              <td style="padding:10px 0;color:#6B6560;">${bookingDetails.budget}</td>
            </tr>` : ''}
            ${bookingDetails.guestCount ? `<tr style="border-bottom:1px solid #E8E3DB;">
              <td style="padding:10px 0;font-weight:600;color:#1C1A17;">Guest Count</td>
              <td style="padding:10px 0;color:#6B6560;">${bookingDetails.guestCount}</td>
            </tr>` : ''}
            ${bookingDetails.shootTheme ? `<tr style="border-bottom:1px solid #E8E3DB;">
              <td style="padding:10px 0;font-weight:600;color:#1C1A17;">Shoot Theme</td>
              <td style="padding:10px 0;color:#6B6560;">${bookingDetails.shootTheme}</td>
            </tr>` : ''}
            ${bookingDetails.howHeard ? `<tr style="border-bottom:1px solid #E8E3DB;">
              <td style="padding:10px 0;font-weight:600;color:#1C1A17;">How They Found Us</td>
              <td style="padding:10px 0;color:#6B6560;">${bookingDetails.howHeard}</td>
            </tr>` : ''}
          </table>

          ${bookingDetails.specialRequests ? `
          <h2 style="font-family:Georgia,serif;font-size:16px;color:#1C1A17;margin:0 0 12px;border-bottom:2px solid #E8E3DB;padding-bottom:8px;">Special Requests / Vision</h2>
          <p style="color:#6B6560;line-height:1.6;margin:0 0 32px;">${bookingDetails.specialRequests}</p>
          ` : ''}

          <div style="background:#F5F3EF;border-left:4px solid #C4A882;padding:16px;margin:32px 0;">
            <p style="margin:0;color:#1C1A17;font-weight:600;">⏱️ Next Step</p>
            <p style="margin:6px 0 0;color:#6B6560;font-size:13px;">Review this enquiry in your <a href="${process.env.BETTER_AUTH_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '#')}/admin" style="color:#C4A882;text-decoration:none;">Admin Dashboard</a> and respond to the client within 24 hours.</p>
          </div>
        </div>
        <div style="background:#1C1A17;padding:20px 32px;text-align:center;">
          <p style="font-size:12px;color:#9E9690;margin:0;">Studio AYNSH Admin Notification • Do not reply to this email</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Studio AYNSH <bookings@studioaynsh.com>',
        to: [studioEmail],
        subject: `📸 New Booking: ${serviceName} on ${bookingDetails.eventDate}`,
        html,
      }),
    })
  } catch {
    // Non-critical — booking is already saved and notification can be viewed in admin dashboard
  }
}

// ── Client portal actions (auth required) ─────────────────────────────────

export async function getMyBookings() {
  const userId = await getRequiredUserId()
  return db
    .select()
    .from(booking)
    .where(eq(booking.userId, userId))
    .orderBy(desc(booking.createdAt))
}

export async function getBookingMessages(bookingId: string) {
  const userId = await getRequiredUserId()
  // Verify this booking belongs to the user
  const [b] = await db.select().from(booking).where(and(eq(booking.id, bookingId), eq(booking.userId, userId)))
  if (!b) throw new Error('Not found')
  return db.select().from(message).where(eq(message.bookingId, bookingId))
}

export async function sendClientMessage(bookingId: string, content: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')

  // Validate inputs
  if (!bookingId || typeof bookingId !== 'string') throw new Error('Invalid booking')
  const safeContent = content?.trim().slice(0, 2000)
  if (!safeContent) throw new Error('Message cannot be empty')

  // Verify ownership: booking must match this user by userId OR email.
  // This covers bookings created while logged in AND bookings matched by email (pre-signup).
  const [b] = await db
    .select({ id: booking.id })
    .from(booking)
    .where(
      and(
        eq(booking.id, bookingId),
        or(
          eq(booking.userId, session.user.id),
          eq(booking.clientEmail, session.user.email.toLowerCase()),
        ),
      ),
    )
    .limit(1)
  if (!b) throw new Error('Not found or access denied')

  await db.insert(message).values({
    id: randomUUID(),
    bookingId,
    senderId: session.user.id,
    senderRole: 'client',
    content: safeContent,
  })
  revalidatePath('/portal')
}
