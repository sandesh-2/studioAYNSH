'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import {
  bookingV2,
  bookingEvent,
  bookingFinancials,
  bookingNote,
  bookingActivityLog,
  user,
  PROGRESS_STAGES,
  type ProgressStageKey,
  type FullBooking,
} from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
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

// ── Auth guard ─────────────────────────────────────────────────────────────
// Role is always re-checked from the DB — never trusted from the session token
// to prevent privilege escalation via stale session data.

async function requireAdmin() {
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })
  if (!session?.user?.id) throw new Error('Unauthorized')

  const [dbUser] = await db
    .select({ id: user.id, role: user.role, name: user.name, email: user.email })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1)

  if (!dbUser || dbUser.role !== 'admin') throw new Error('Forbidden')
  return dbUser
}

// ── Helpers ────────────────────────────────────────────────────────────────

async function fetchFullBooking(bookingId: string): Promise<FullBooking | null> {
  const [core] = await db
    .select()
    .from(bookingV2)
    .where(eq(bookingV2.id, bookingId))
    .limit(1)

  if (!core) return null

  const [event, financials, notes] = await Promise.all([
    db.select().from(bookingEvent).where(eq(bookingEvent.bookingId, bookingId)).limit(1)
      .then((r) => r[0] ?? null),
    db.select().from(bookingFinancials).where(eq(bookingFinancials.bookingId, bookingId)).limit(1)
      .then((r) => r[0] ?? null),
    db.select().from(bookingNote).where(eq(bookingNote.bookingId, bookingId))
      .orderBy(desc(bookingNote.createdAt)),
  ])

  return { ...core, event, financials, notes }
}

// ── Queries ────────────────────────────────────────────────────────────────

export async function getAllBookings(): Promise<FullBooking[]> {
  await requireAdmin()

  const bookings = await db
    .select()
    .from(bookingV2)
    .orderBy(desc(bookingV2.createdAt))

  if (bookings.length === 0) return []

  // Batch-fetch related rows for all bookings
  const [events, financials, notes] = await Promise.all([
    db.select().from(bookingEvent),
    db.select().from(bookingFinancials),
    db.select().from(bookingNote).orderBy(desc(bookingNote.createdAt)),
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

export async function getAllClients() {
  await requireAdmin()
  return db.select().from(user).orderBy(desc(user.createdAt))
}

// ── Calendar view ──────────────────────────────────────────────────────────

export async function getAllBookingsForCalendar() {
  await requireAdmin()

  const events = await db.select().from(bookingEvent)
  const bookings = await db.select().from(bookingV2)

  const bookingsMap = new Map(bookings.map((b) => [b.id, b]))

  return events
    .filter((e) => e.eventDate && e.bookingId)
    .map((e) => {
      const booking = bookingsMap.get(e.bookingId)
      return {
        bookingId: e.bookingId,
        date: e.eventDate,
        service: booking?.service || 'other',
        clientName: booking?.clientName || 'Unknown',
      }
    })
}

// ── Status update ──────────────────────────────────────────────────────────

const VALID_STATUSES = new Set(['pending', 'confirmed', 'completed', 'cancelled'])

export async function updateBookingStatus(
  bookingId: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
) {
  if (!bookingId) throw new Error('Invalid booking ID')
  if (!VALID_STATUSES.has(status)) throw new Error('Invalid status value')
  const admin = await requireAdmin()

  const [current] = await db
    .select({ status: bookingV2.status })
    .from(bookingV2)
    .where(eq(bookingV2.id, bookingId))
    .limit(1)

  if (!current) throw new Error('Booking not found')

  await db
    .update(bookingV2)
    .set({
      status,
      updatedAt:   new Date(),
      confirmedAt: status === 'confirmed' ? new Date() : undefined,
    })
    .where(eq(bookingV2.id, bookingId))

  // Audit log
  await db.insert(bookingActivityLog).values({
    id:            uuidv4(),
    bookingId,
    actorId:       admin.id,
    actorRole:     'admin',
    eventType:     'status_changed',
    previousValue: current.status,
    newValue:      status,
  })

  revalidatePath('/admin')
  revalidatePath('/portal')
}

// ── Progress update ────────────────────────────────────────────────────────

const VALID_PROGRESS_STAGES = new Set(PROGRESS_STAGES.map((s) => s.key))

export async function updateBookingProgress(bookingId: string, progressStage: ProgressStageKey) {
  if (!bookingId) throw new Error('Invalid booking ID')
  if (!VALID_PROGRESS_STAGES.has(progressStage)) throw new Error('Invalid progress stage')
  const admin = await requireAdmin()

  const [current] = await db
    .select({ progressStage: bookingV2.progressStage })
    .from(bookingV2)
    .where(eq(bookingV2.id, bookingId))
    .limit(1)

  if (!current) throw new Error('Booking not found')

  await db
    .update(bookingV2)
    .set({ progressStage, updatedAt: new Date() })
    .where(eq(bookingV2.id, bookingId))

  await db.insert(bookingActivityLog).values({
    id:            uuidv4(),
    bookingId,
    actorId:       admin.id,
    actorRole:     'admin',
    eventType:     'progress_changed',
    previousValue: current.progressStage,
    newValue:      progressStage,
  })

  revalidatePath('/admin')
  revalidatePath('/portal')
}

// ── Notes (append-only) ────────────────────────────────────────────────────

export async function addBookingNote(bookingId: string, content: string) {
  if (!bookingId) throw new Error('Invalid booking ID')
  const safeContent = (content ?? '').trim().slice(0, 5000)
  if (!safeContent) throw new Error('Note cannot be empty')
  const admin = await requireAdmin()

  const noteId = uuidv4()

  await db.insert(bookingNote).values({
    id:        noteId,
    bookingId,
    authorId:  admin.id,
    content:   safeContent,
  })

  await db.insert(bookingActivityLog).values({
    id:        uuidv4(),
    bookingId,
    actorId:   admin.id,
    actorRole: 'admin',
    eventType: 'note_added',
    newValue:  safeContent.slice(0, 80),
  })

  revalidatePath('/admin')
  revalidatePath('/portal')
}

// ── Financials update ──────────────────────────────────────────────────────

export async function updateBookingFinancials(
  bookingId:     string,
  totalAmount:   string,
  depositAmount: string,
  depositPaid:   boolean,
  paymentNotes?: string,
) {
  if (!bookingId) throw new Error('Invalid booking ID')

  // Validate numeric inputs — reject anything that's not a valid decimal
  const parseAmount = (v: string): string | null => {
    const s = v?.trim()
    if (!s) return null
    if (!/^\d+(\.\d{1,2})?$/.test(s)) throw new Error(`Invalid amount: ${s}`)
    return s
  }

  const safeTotal   = parseAmount(totalAmount)
  const safeDeposit = parseAmount(depositAmount)
  const safeNotes   = (paymentNotes ?? '').trim().slice(0, 500) || null

  const admin = await requireAdmin()

  // Upsert: update if row exists, insert if not (safety net)
  const [existing] = await db
    .select({ id: bookingFinancials.id })
    .from(bookingFinancials)
    .where(eq(bookingFinancials.bookingId, bookingId))
    .limit(1)

  if (existing) {
    await db
      .update(bookingFinancials)
      .set({
        totalAmount:   safeTotal,
        depositAmount: safeDeposit,
        depositPaid:   Boolean(depositPaid),
        depositPaidAt: depositPaid ? new Date() : null,
        paymentNotes:  safeNotes,
        updatedAt:     new Date(),
      })
      .where(eq(bookingFinancials.bookingId, bookingId))
  } else {
    await db.insert(bookingFinancials).values({
      id:            uuidv4(),
      bookingId,
      totalAmount:   safeTotal,
      depositAmount: safeDeposit,
      depositPaid:   Boolean(depositPaid),
      depositPaidAt: depositPaid ? new Date() : null,
      paymentNotes:  safeNotes,
    })
  }

  await db.insert(bookingActivityLog).values({
    id:        uuidv4(),
    bookingId,
    actorId:   admin.id,
    actorRole: 'admin',
    eventType: 'financials_updated',
    newValue:  `total=${safeTotal ?? '—'} deposit=${safeDeposit ?? '—'} paid=${depositPaid}`,
  })

  revalidatePath('/admin')
}

// ── Activity log ───────────────────────────────────────────────────────────

export async function getBookingActivity(bookingId: string) {
  if (!bookingId) throw new Error('Invalid booking ID')
  await requireAdmin()
  return db
    .select()
    .from(bookingActivityLog)
    .where(eq(bookingActivityLog.bookingId, bookingId))
    .orderBy(desc(bookingActivityLog.createdAt))
}
