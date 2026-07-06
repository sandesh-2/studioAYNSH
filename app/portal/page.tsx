import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user, bookingV2, bookingEvent, bookingFinancials, bookingNote } from '@/lib/db/schema'
import { desc, eq, inArray } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ClientPortalUI } from '@/components/portal/client-portal-ui'
import type { Metadata } from 'next'
import type { FullBooking } from '@/lib/db/schema'

export const metadata: Metadata = {
  title: 'Client Portal — Studio AYNSH',
  description: 'Track your bookings and communicate with Studio AYNSH.',
}

export default async function PortalPage() {
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })
  if (!session?.user?.id) redirect('/sign-in')

  // Read role from DB — never rely on session for authorization
  const [dbUser] = await db
    .select({ role: user.role })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1)

  if (dbUser?.role === 'admin') redirect('/admin')

  // Fetch bookings for this user from the new normalised tables
  const coreBookings = await db
    .select()
    .from(bookingV2)
    .where(eq(bookingV2.userId, session.user.id))
    .orderBy(desc(bookingV2.createdAt))

  let fullBookings: FullBooking[] = []

  if (coreBookings.length > 0) {
    const ids = coreBookings.map((b) => b.id)

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

    fullBookings = coreBookings.map((b) => ({
      ...b,
      event:      eventsMap.get(b.id) ?? null,
      financials: financialsMap.get(b.id) ?? null,
      notes:      notesMap.get(b.id) ?? [],
    }))
  }

  return (
    <>
      <Navigation />
      <ClientPortalUI user={session.user} bookings={fullBookings} />
      <Footer />
    </>
  )
}
