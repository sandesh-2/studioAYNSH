import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { booking, user } from '@/lib/db/schema'
import { desc, eq, or } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { ClientPortalUI } from '@/components/portal/client-portal-ui'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Client Portal — Studio AYNSH',
  description: 'Track your bookings and communicate with Studio AYNSH.',
}

export default async function PortalPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) redirect('/sign-in')

  // Read role from DB — never rely on session for authorization
  const [dbUser] = await db
    .select({ role: user.role })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1)

  if (dbUser?.role === 'admin') redirect('/admin')

  // Fetch bookings by userId OR by email (covers bookings made before sign-up)
  const bookings = await db
    .select()
    .from(booking)
    .where(
      or(
        eq(booking.userId, session.user.id),
        eq(booking.clientEmail, session.user.email.toLowerCase()),
      ),
    )
    .orderBy(desc(booking.createdAt))

  return (
    <>
      <Navigation />
      <ClientPortalUI user={session.user} bookings={bookings} />
      <Footer />
    </>
  )
}
