import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import { BookingForm } from '@/components/booking/booking-form'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Photography Session | Studio AYNSH Gorakhpur',
  description:
    'Book your photography or cinematography session with Studio AYNSH in Gorakhpur. Wedding, pre-wedding, portrait, fashion, drone and commercial photography across India. Reserve your date with Praveen Gupta.',
  keywords: [
    'Book photography session Gorakhpur', 'Book wedding photographer Gorakhpur',
    'Photography session booking India', 'Studio AYNSH booking',
    'Reserve wedding photographer', 'Pre-wedding shoot booking',
  ],
  alternates: {
    canonical: 'https://studioaynsh.com/booking',
  },
  openGraph: {
    title: 'Book a Photography Session | Studio AYNSH Gorakhpur',
    description: 'Reserve your photography session with Studio AYNSH, Gorakhpur. Weddings, pre-wedding, portraits and more.',
    url: 'https://studioaynsh.com/booking',
    images: [
      {
        url: 'https://studioaynsh.com/api/og?title=Book%20a%20Session',
        width: 1200,
        height: 630,
        alt: 'Book a Photography Session — Studio AYNSH Gorakhpur',
      },
    ],
  },
  robots: {
    index: false, // Booking requires auth — keep out of search index
    follow: false,
  },
}

export default async function BookingPage() {
  const headersList = await headers()
  const session = await auth.api.getSession({ headers: headersList })

  // Require sign-in — redirect guests to sign-in with a return URL
  if (!session?.user) {
    redirect('/sign-in?redirect=/booking')
  }

  // Fetch fresh user data (name, email, phone) for autofill
  const [dbUser] = await db
    .select({ name: user.name, email: user.email, phone: user.phone })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1)

  const loggedInUser = dbUser
    ? { name: dbUser.name, email: dbUser.email, phone: dbUser.phone ?? '' }
    : null

  return (
    <>
      <Navigation />
      <main className="pt-20">
        <section className="py-20 lg:py-28 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left: Info */}
            <div>
              <p className="font-sans text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6">
                Reserve Your Date
              </p>
              <h1
                className="font-serif font-light text-foreground leading-tight mb-8"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
              >
                Book a
                <br />
                <em>Session</em>
              </h1>
              <p className="font-sans text-base text-muted-foreground leading-relaxed mb-10 max-w-sm">
                Every great photograph begins with a conversation. Tell us about your vision and
                we&apos;ll craft the perfect session together.
              </p>

              {/* Signed-in indicator */}
              <div className="inline-flex items-center gap-2 border border-border px-4 py-2.5 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="font-sans text-xs text-muted-foreground">
                  Booking as <span className="text-foreground">{dbUser?.name ?? session.user.name}</span>
                </span>
                <Link href="/portal" className="font-sans text-[10px] tracking-[0.1em] uppercase text-muted-foreground/60 hover:text-foreground transition-colors duration-200 ml-1">
                  Portal
                </Link>
              </div>


            </div>

            {/* Right: Form */}
            <BookingForm loggedInUser={loggedInUser} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
