import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import { StudioMap } from '@/components/studio-map'
import { WebPageSchema } from '@/components/structured-data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Studio AYNSH — Book Your Session | Gorakhpur Photography Studio',
  description:
    'Contact Studio AYNSH in Gorakhpur to book your photography or cinematography session. Reach Praveen Gupta by phone (+91 7084019414), WhatsApp or email. Bhagat Chauraha, Taramandal, Gorakhpur — 273016.',
  keywords: [
    'Contact Studio AYNSH', 'Book photography session Gorakhpur', 'Photography studio contact Gorakhpur',
    'Praveen Gupta contact', 'Studio AYNSH phone number', 'Photography booking Gorakhpur',
    'Wedding photographer contact Gorakhpur',
  ],
  alternates: {
    canonical: 'https://studioaynsh.com/contact',
  },
  openGraph: {
    title: 'Contact Studio AYNSH — Book Your Photography Session',
    description:
      'Contact Studio AYNSH in Gorakhpur for wedding, portrait, fashion or commercial photography bookings.',
    url: 'https://studioaynsh.com/contact',
    images: [
      {
        url: 'https://studioaynsh.com/api/og?title=Contact%20Us',
        width: 1200,
        height: 630,
        alt: 'Contact Studio AYNSH — Gorakhpur Photography Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Studio AYNSH | Gorakhpur Photography Studio',
    description: 'Book your photography session with Studio AYNSH, Gorakhpur.',
    images: [{ url: 'https://studioaynsh.com/api/og?title=Contact%20Us', alt: 'Contact Studio AYNSH' }],
  },
}

export default function ContactPage() {
  return (
    <>
      <WebPageSchema
        title="Contact Studio AYNSH — Book Your Photography Session"
        description="Contact Studio AYNSH in Gorakhpur for photography and cinematography bookings. Reach Praveen Gupta by phone, WhatsApp or email."
        url="https://studioaynsh.com/contact"
        breadcrumbItems={[
          { name: 'Home', url: 'https://studioaynsh.com' },
          { name: 'Contact', url: 'https://studioaynsh.com/contact' },
        ]}
      />
      <Navigation />
      <main className="pt-20">
        <section className="py-20 lg:py-28 px-6 lg:px-12 max-w-7xl mx-auto">
          <p className="font-sans text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6">
            Get in Touch
          </p>
          <h1
            className="font-serif font-light text-foreground leading-tight mb-16"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
          >
            Contact
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-border">
            {[
              {
                label: 'Phone',
                value: '+91 7084019414',
                href: 'tel:+917084019414',
              },
              {
                label: 'Email',
                value: 'samratgupta7754@gmail.com',
                href: 'mailto:samratgupta7754@gmail.com',
              },
              {
                label: 'WhatsApp',
                value: 'Chat with us',
                href: 'https://wa.me/917084019414',
                external: true,
              },
              {
                label: 'Instagram',
                value: '@studioaynsh',
                href: 'https://instagram.com/studioaynsh',
                external: true,
              },
            ].map((item) => (
              <div key={item.label} className="border-b md:border-r border-border last:border-r-0 py-10 px-0 md:px-8 first:pl-0 last:pr-0">
                <p className="font-sans text-xs tracking-[0.25em] uppercase text-muted-foreground/50 mb-3">{item.label}</p>
                <a
                  href={item.href}
                  target={'external' in item && item.external ? '_blank' : undefined}
                  rel={'external' in item && item.external ? 'noopener noreferrer' : undefined}
                  className="font-serif text-foreground text-lg hover:text-accent transition-colors duration-200 break-all"
                >
                  {item.value}
                </a>
              </div>
            ))}
          </div>

          {/* Address + Map placeholder */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="font-sans text-xs tracking-[0.25em] uppercase text-muted-foreground/50 mb-6">Studio Address</p>
              <address className="font-serif text-foreground text-2xl font-light not-italic leading-relaxed">
                Bhagat Chauraha<br />
                Rampur Road, Taramandal<br />
                Gorakhpur — 273016<br />
                Uttar Pradesh, India
              </address>
            </div>

            {/* Map showing studio location */}
            <StudioMap />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
