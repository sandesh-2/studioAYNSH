import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { booking } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
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
  if (!session?.user) redirect('/sign-in')

  const bookings = await db
    .select()
    .from(booking)
    .where(eq(booking.userId, session.user.id))
    .orderBy(desc(booking.createdAt))

  return (
    <>
      <Navigation />
      <ClientPortalUI user={session.user} bookings={bookings} />
      <Footer />
    </>
  )
}
