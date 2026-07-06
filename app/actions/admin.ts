'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { booking, user, PROGRESS_STAGES, type ProgressStageKey } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

/**
 * Read the user's role directly from the DB — not from the session object.
 * Better Auth's session.user only carries base fields; the role additionalField
 * lives in the user table and must be queried explicitly to prevent privilege
 * escalation through stale or tampered session data.
 */
async function requireAdmin() {
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })
  if (!session?.user?.id) throw new Error('Unauthorized')

  const [dbUser] = await db
    .select({ id: user.id, role: user.role, name: user.name, email: user.email })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1)

  if (!dbUser) throw new Error('Unauthorized')
  if (dbUser.role !== 'admin') throw new Error('Forbidden')
  return dbUser
}

export async function getAllBookings() {
  await requireAdmin()
  return db.select().from(booking).orderBy(desc(booking.createdAt))
}

export async function getAllClients() {
  await requireAdmin()
  return db.select().from(user).orderBy(desc(user.createdAt))
}

const VALID_STATUSES = new Set(['pending', 'confirmed', 'completed', 'cancelled'])

export async function updateBookingStatus(
  bookingId: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
) {
  if (!bookingId || typeof bookingId !== 'string') throw new Error('Invalid booking ID')
  if (!VALID_STATUSES.has(status)) throw new Error('Invalid status value')
  await requireAdmin()
  await db
    .update(booking)
    .set({
      status,
      updatedAt: new Date(),
      confirmedAt: status === 'confirmed' ? new Date() : undefined,
    })
    .where(eq(booking.id, bookingId))
  revalidatePath('/admin')
  revalidatePath('/portal')
}

export async function updateBookingNotes(bookingId: string, adminNotes: string) {
  if (!bookingId || typeof bookingId !== 'string') throw new Error('Invalid booking ID')
  const safeNotes = (adminNotes ?? '').trim().slice(0, 5000)
  await requireAdmin()
  await db
    .update(booking)
    .set({ adminNotes: safeNotes, updatedAt: new Date() })
    .where(eq(booking.id, bookingId))
  revalidatePath('/admin')
  revalidatePath('/portal')
}

export async function updateBookingAmount(
  bookingId: string,
  totalAmount: string,
  depositAmount: string,
  depositPaid: boolean,
) {
  if (!bookingId || typeof bookingId !== 'string') throw new Error('Invalid booking ID')
  const safeTotal   = (totalAmount ?? '').trim().slice(0, 40)
  const safeDeposit = (depositAmount ?? '').trim().slice(0, 40)
  await requireAdmin()
  await db
    .update(booking)
    .set({
      totalAmount: safeTotal || null,
      depositAmount: safeDeposit || null,
      depositPaid: Boolean(depositPaid),
      updatedAt: new Date(),
    })
    .where(eq(booking.id, bookingId))
  revalidatePath('/admin')
}

const VALID_PROGRESS_STAGES = new Set(PROGRESS_STAGES.map((s) => s.key))

export async function updateBookingProgress(bookingId: string, progressStage: ProgressStageKey) {
  if (!bookingId || typeof bookingId !== 'string') throw new Error('Invalid booking ID')
  if (!VALID_PROGRESS_STAGES.has(progressStage)) throw new Error('Invalid progress stage')
  await requireAdmin()
  await db
    .update(booking)
    .set({ progressStage, updatedAt: new Date() })
    .where(eq(booking.id, bookingId))
  revalidatePath('/admin')
  revalidatePath('/portal')
}
