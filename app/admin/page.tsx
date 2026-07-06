import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { getAllBookings, getAllClients } from '@/app/actions/admin'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin — Studio AYNSH',
}

export default async function AdminPage() {
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })
  if (!session?.user?.id) redirect('/sign-in')

  // Read role from DB — never trust session.user for authorization decisions
  const [dbUser] = await db
    .select({ role: user.role })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1)

  if (!dbUser || dbUser.role !== 'admin') redirect('/')

  const [bookings, clients] = await Promise.all([
    getAllBookings(),
    getAllClients(),
  ])

  return <AdminDashboard bookings={bookings} clients={clients} adminName={session.user.name} />
}
