'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { booking, message, user } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  if (session.user.role !== 'admin') throw new Error('Forbidden')
  return session.user
}

export async function getAllBookings() {
  await requireAdmin()
  return db.select().from(booking).orderBy(desc(booking.createdAt))
}

export async function getAllClients() {
  await requireAdmin()
  return db.select().from(user).orderBy(desc(user.createdAt))
}

export async function updateBookingStatus(
  bookingId: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
) {
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
  await requireAdmin()
  await db
    .update(booking)
    .set({ adminNotes, updatedAt: new Date() })
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
  await requireAdmin()
  await db
    .update(booking)
    .set({ totalAmount, depositAmount, depositPaid, updatedAt: new Date() })
    .where(eq(booking.id, bookingId))
  revalidatePath('/admin')
}

export async function sendAdminMessage(bookingId: string, content: string) {
  const admin = await requireAdmin()
  await db.insert(message).values({
    id: randomUUID(),
    bookingId,
    senderId: admin.id,
    senderRole: 'admin',
    content,
  })
  revalidatePath('/admin')
  revalidatePath('/portal')
}

export async function getBookingMessages(bookingId: string) {
  await requireAdmin()
  return db.select().from(message).where(eq(message.bookingId, bookingId))
}
