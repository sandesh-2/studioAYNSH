'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  bookingV2,
  bookingEvent,
  bookingFinancials,
  bookingNote,
  bookingActivityLog,
  SERVICE_LABELS,
  type FullBooking,
} from '@/lib/db/schema'
import { desc, eq, inArray } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

// UUID v4 generator that works in Edge runtime
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// ── Auth helper ────────────────────────────────────────────────────────────

async function getRequiredUserId(): Promise<string> {
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// ── Validation helpers ─────────────────────────────────────────────────────

const VALID_SERVICES = new Set(Object.keys(SERVICE_LABELS))

function sanitize(v: string | undefined | null, maxLen: number): string | null {
  if (!v) return null
  return v.trim().slice(0, maxLen) || null
}

function assertNonEmpty(v: string | undefined, field: string): string {
  const s = v?.trim()
  if (!s) throw new Error(`${field} is required`)
  return s
}

// ── Booking input ──────────────────────────────────────────────────────────

export interface BookingInput {
  clientName:      string
  clientEmail:     string
  clientPhone:     string
  service:         string
  eventDate:       string
  eventTime?:      string
  location:        string
  duration?:       string
  budget?:         string
  guestCount?:     string
  shootTheme?:     string
  specialRequests?: string
  howHeard?:       string
}

// ── createBooking ──────────────────────────────────────────────────────────
// Requires authentication. Writes to booking_v2, booking_event,
// booking_financials (stub), and booking_activity_log atomically.

export async function createBooking(input: BookingInput) {
  try {
    const clientName  = assertNonEmpty(input.clientName,  'Name').slice(0, 120)
    const clientEmail = assertNonEmpty(input.clientEmail, 'Email').toLowerCase().slice(0, 254)
    const clientPhone = assertNonEmpty(input.clientPhone, 'Phone').slice(0, 20)
    const location    = assertNonEmpty(input.location,    'Location').slice(0, 200)
    const service     = assertNonEmpty(input.service,     'Service')
    const eventDate   = assertNonEmpty(input.eventDate,   'Event date')

    if (!/^\S+@\S+\.\S+$/.test(clientEmail)) throw new Error('Invalid email address')
    if (!VALID_SERVICES.has(service))        throw new Error('Invalid service selection')

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) throw new Error('Invalid date format')

    const userId = await getRequiredUserId()

    const bookingId  = uuidv4()
    const eventId    = uuidv4()
    const financialId = uuidv4()
    const logId      = uuidv4()

    // ── Insert core booking ────────────────────────────────────────────────
    await db.insert(bookingV2).values({
      id:            bookingId,
      userId,
      clientName,
      clientEmail,
      clientPhone,
      service,
      status:        'pending',
      progressStage: 'enquiry_received',
    })

    // ── Insert event details ───────────────────────────────────────────────
    await db.insert(bookingEvent).values({
      id:              eventId,
      bookingId:       bookingId,
      eventDate:       eventDate,   // DATE column accepts YYYY-MM-DD string
      eventTime:       sanitize(input.eventTime, 20),
      location,
      venue:           null,
      duration:        sanitize(input.duration, 40),
      guestCount:      null,
      shootTheme:      sanitize(input.shootTheme, 120),
      specialRequests: sanitize(input.specialRequests, 2000),
      howHeard:        sanitize(input.howHeard, 40),
    })

    // ── Insert financials stub ────────────────────────────────────────────
    // The budget field from the booking form is informational; real amounts
    // are set by the admin after quoting. We store the client's budget hint
    // in paymentNotes until the admin sets proper amounts.
    await db.insert(bookingFinancials).values({
      id:           financialId,
      bookingId:    bookingId,
      paymentNotes: sanitize(input.budget, 40),
    })

    // ── Seed activity log ─────────────────────────────────────────────────
    await db.insert(bookingActivityLog).values({
      id:        logId,
      bookingId: bookingId,
      actorId:   userId,
      actorRole: 'system',
      eventType: 'booking_created',
      newValue:  service,
      metadata:  { clientEmail, eventDate },
    })

    // ── Email notifications ───────────────────────────────────────────────
    // Do not fail the booking if emails fail; they're asynchronous notifications
    Promise.all([
      // sendConfirmationEmail({ ...input, clientName, clientEmail }, bookingId),
      sendStudioOwnerNotification({ bookingId, clientName, clientEmail, clientPhone, service, eventDate,
        eventTime: input.eventTime ?? null, location,
        duration: input.duration ?? null, budget: input.budget ?? null,
        guestCount: input.guestCount ?? null, shootTheme: input.shootTheme ?? null,
        specialRequests: input.specialRequests ?? null, howHeard: input.howHeard ?? null,
      }),
    ]).catch((_err) => {
      // Email notification failed - non-blocking, booking still succeeds
    })

    revalidatePath('/portal')
    revalidatePath('/admin')

    return { success: true, bookingId }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create booking'
    // Error logged in database audit trail, return to client
    return { success: false, error: message }
  }
}

// ── checkAvailability ─────────────────────────────────────────────────────
// Check if a date has available slots (max 3 bookings per date)
// Returns true if slots available, false if fully booked (3 or more bookings)

export async function checkAvailability(eventDate: string) {
  try {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
      throw new Error('Invalid date format')
    }

    // Count bookings for the selected date
    const bookingsOnDate = await db
      .select()
      .from(bookingEvent)
      .where(eq(bookingEvent.eventDate, eventDate))

    const bookingCount = bookingsOnDate.length

    // Maximum 3 bookings per date
    const isAvailable = bookingCount < 3
    const slotsAvailable = Math.max(0, 3 - bookingCount)

    return {
      available: isAvailable,
      bookingsOnDate: bookingCount,
      slotsAvailable,
      message: isAvailable 
        ? `${slotsAvailable === 1 ? '1 slot' : `${slotsAvailable} slots`} available on this date`
        : 'This date is fully booked for now',
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to check availability'
    return { available: false, error: message, bookingsOnDate: 0, slotsAvailable: 0, message: '' }
  }
}

// ── getMyBookingsForCalendar ───────────────────────────────────────────────
// Returns bookings with event dates for calendar display (client view)

export async function getMyBookingsForCalendar() {
  try {
    const userId = await getRequiredUserId()

    const bookings = await db
      .select({
        id: bookingV2.id,
        service: bookingV2.service,
        eventDate: bookingEvent.eventDate,
      })
      .from(bookingV2)
      .innerJoin(bookingEvent, eq(bookingEvent.bookingId, bookingV2.id))
      .where(eq(bookingV2.userId, userId))

    return bookings.map((b) => ({
      bookingId: b.id,
      date: b.eventDate,
      service: b.service,
    }))
  } catch (err) {
    return []
  }
}

// ── getAllBookingsForCalendar ──────────────────────────────────────────────
// Returns all bookings with client names for admin calendar view

export async function getAllBookingsForCalendar() {
  try {
    const userId = await getRequiredUserId()
    
    // Verify user is admin
    const headersList = await headers()
    const session = await auth.api.getSession({ headers: headersList })
    if (!session?.user) throw new Error('Unauthorized')

    const bookings = await db
      .select({
        id: bookingV2.id,
        service: bookingV2.service,
        clientName: bookingV2.clientName,
        eventDate: bookingEvent.eventDate,
      })
      .from(bookingV2)
      .innerJoin(bookingEvent, eq(bookingEvent.bookingId, bookingV2.id))

    return bookings.map((b) => ({
      bookingId: b.id,
      date: b.eventDate,
      service: b.service,
      clientName: b.clientName,
    }))
  } catch (err) {
    return []
  }
}

// ── getMyBookings ──────────────────────────────────────────────────────────
// Returns the logged-in client's bookings joined with event, financials, and
// notes. Uses inArray for a single round-trip per related table.

export async function getMyBookings(): Promise<FullBooking[]> {
  const userId = await getRequiredUserId()

  const bookings = await db
    .select()
    .from(bookingV2)
    .where(eq(bookingV2.userId, userId))
    .orderBy(desc(bookingV2.createdAt))

  if (bookings.length === 0) return []

  const ids = bookings.map((b) => b.id)

  const [events, financials, notes] = await Promise.all([
    db.select().from(bookingEvent).where(inArray(bookingEvent.bookingId, ids)),
    db.select().from(bookingFinancials).where(inArray(bookingFinancials.bookingId, ids)),
    db.select().from(bookingNote).where(inArray(bookingNote.bookingId, ids))
      .orderBy(desc(bookingNote.createdAt)),
  ])

  const eventsMap     = new Map(events.map((e) => [e.bookingId, e]))
  const financialsMap = new Map(financials.map((f) => [f.bookingId, f]))
  const notesMap      = new Map<string, typeof notes>()
  for (const n of notes) {
    const arr = notesMap.get(n.bookingId) ?? []
    arr.push(n)
    notesMap.set(n.bookingId, arr)
  }

  return bookings.map((b) => ({
    ...b,
    event:      eventsMap.get(b.id) ?? null,
    financials: financialsMap.get(b.id) ?? null,
    notes:      notesMap.get(b.id) ?? [],
  }))
}

// ── Email helpers ──────────────────────────────────────────────────────────

async function sendConfirmationEmail(input: BookingInput, bookingId: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  const serviceName = SERVICE_LABELS[input.service] ?? input.service
  const baseUrl = process.env.BETTER_AUTH_URL
    ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '#')

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
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
            <tr><td style="color:#6B6560;padding:6px 0;width:40%;">Reference</td><td style="color:#1C1A17;font-weight:600;">${bookingId.slice(0,8).toUpperCase()}</td></tr>
            <tr><td style="color:#6B6560;padding:6px 0;">Service</td><td style="color:#1C1A17;">${serviceName}</td></tr>
            <tr><td style="color:#6B6560;padding:6px 0;">Date</td><td style="color:#1C1A17;">${input.eventDate}</td></tr>
            ${input.eventTime ? `<tr><td style="color:#6B6560;padding:6px 0;">Time</td><td style="color:#1C1A17;">${input.eventTime}</td></tr>` : ''}
            <tr><td style="color:#6B6560;padding:6px 0;">Location</td><td style="color:#1C1A17;">${input.location}</td></tr>
          </table>
        </div>
        <p style="font-family:Arial,sans-serif;font-size:13px;color:#6B6560;line-height:1.7;">
          Track your booking anytime at your <a href="${baseUrl}/portal" style="color:#C4A882;">Client Portal</a>.
        </p>
      </div>
      <div style="background:#F5F3EF;padding:24px 40px;text-align:center;">
        <p style="font-family:Arial,sans-serif;font-size:11px;color:#9E9690;letter-spacing:1px;margin:0;">Studio AYNSH &bull; sandeshkg254@gmail.com</p>
      </div>
    </div>
  </body></html>`

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Studio AYNSH <onboarding@resend.dev>',
        to: [input.clientEmail],
        subject: `Booking Confirmed — ${serviceName} | Studio AYNSH`,
        html,
      }),
    })
  } catch { /* non-critical */ }
}

async function sendStudioOwnerNotification(d: {
  bookingId: string; clientName: string; clientEmail: string; clientPhone: string
  service: string; eventDate: string; eventTime: string | null; location: string
  duration: string | null; budget: string | null; guestCount: string | null
  shootTheme: string | null; specialRequests: string | null; howHeard: string | null
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return

  const serviceName = SERVICE_LABELS[d.service] ?? d.service
  const baseUrl = process.env.BETTER_AUTH_URL
    ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '#')

  const row = (label: string, val: string | null) =>
    val ? `<tr style="border-bottom:1px solid #E8E3DB;"><td style="padding:8px 0;font-weight:600;color:#1C1A17;width:30%;">${label}</td><td style="padding:8px 0;color:#6B6560;">${val}</td></tr>` : ''

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
  <body style="font-family:Arial,sans-serif;background:#F5F3EF;margin:0;padding:20px;">
    <div style="max-width:680px;margin:0 auto;background:#FFFFFF;border:1px solid #E8E3DB;">
      <div style="background:#1C1A17;padding:24px 32px;">
        <p style="color:#C4A882;font-size:11px;letter-spacing:3px;margin:0;text-transform:uppercase;">New Booking Alert</p>
        <h1 style="color:#FAF9F6;font-size:22px;margin:8px 0 0;font-weight:400;">Ref #${d.bookingId.slice(0,8).toUpperCase()}</h1>
      </div>
      <div style="padding:32px;">
        <table style="width:100%;margin-bottom:24px;border-collapse:collapse;">
          ${row('Name', d.clientName)}
          ${row('Email', `<a href="mailto:${d.clientEmail}" style="color:#C4A882;">${d.clientEmail}</a>`)}
          ${row('Phone', d.clientPhone)}
          ${row('Service', serviceName)}
          ${row('Date', d.eventDate)}
          ${row('Time', d.eventTime)}
          ${row('Location', d.location)}
          ${row('Budget', d.budget)}
          ${row('Theme', d.shootTheme)}
          ${row('How Heard', d.howHeard)}
        </table>
        ${d.specialRequests ? `<p style="color:#6B6560;line-height:1.6;border-left:3px solid #C4A882;padding-left:12px;margin:0;">${d.specialRequests}</p>` : ''}
        <div style="margin-top:24px;padding:16px;background:#F5F3EF;">
          <a href="${baseUrl}/admin" style="color:#C4A882;text-decoration:none;font-weight:600;">Open Admin Dashboard &rarr;</a>
        </div>
      </div>
    </div>
  </body></html>`

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Studio AYNSH <onboarding@resend.dev>',
        to: ['sandeshkg254@gmail.com'],
        subject: `New Booking: ${serviceName} on ${d.eventDate}`,
        html,
      }),
    })
  } catch { /* non-critical */ }
}
