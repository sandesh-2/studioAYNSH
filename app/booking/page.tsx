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
  title: 'Book a Session',
  description:
    'Book your photography session with Studio AYNSH. Wedding, portrait, pre-wedding, fashion, and commercial photography in Gorakhpur and across India.',
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

              {/* Contact details */}
              <div className="space-y-6">
                <div className="border-t border-border pt-6">
                  <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground/60 mb-1">Direct Line</p>
                  <a href="tel:+917084019414" className="font-serif text-foreground text-xl hover:text-accent transition-colors duration-200">
                    +91 7084019414
                  </a>
                </div>
                <div className="border-t border-border pt-6">
                  <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground/60 mb-1">Email</p>
                  <a href="mailto:samratgupta7754@gmail.com" className="font-serif text-foreground text-xl hover:text-accent transition-colors duration-200">
                    samratgupta7754@gmail.com
                  </a>
                </div>
                <div className="border-t border-border pt-6">
                  <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground/60 mb-1">WhatsApp</p>
                  <a
                    href="https://wa.me/917084019414"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-serif text-foreground text-xl hover:text-accent transition-colors duration-200"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
                <div className="border-t border-border pt-6">
                  <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground/60 mb-1">Studio</p>
                  <address className="font-sans text-sm text-muted-foreground not-italic leading-relaxed">
                    Bhagat Chauraha, Rampur Road<br />
                    Taramandal, Gorakhpur<br />
                    Uttar Pradesh — 273016
                  </address>
                </div>
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
