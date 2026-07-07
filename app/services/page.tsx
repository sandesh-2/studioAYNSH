import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import { ServicesContent } from '@/components/services/services-content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Photography & Cinematography Services',
  description:
    'Studio AYNSH offers premium photography and cinematography services — wedding, pre-wedding, portrait, fashion, drone, commercial photography in Gorakhpur and across India.',
  keywords: [
    'photography services',
    'wedding photography',
    'pre-wedding shoots',
    'portrait photography',
    'fashion photography',
    'drone photography',
    'cinematography',
    'commercial photography',
  ],
  openGraph: {
    title: 'Photography & Cinematography Services | Studio AYNSH',
    description:
      'Professional photography services including wedding, portrait, fashion, and drone photography across India.',
    url: 'https://studioaynsh.com/services',
  },
}

export default function ServicesPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <section className="py-20 lg:py-28 px-6 lg:px-12 max-w-7xl mx-auto">
          <p className="font-sans text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6">
            What We Do
          </p>
          <h1
            className="font-serif font-light text-foreground leading-tight mb-6"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
          >
            Our Services
          </h1>
          <p className="font-sans text-base text-muted-foreground leading-relaxed max-w-xl">
            Every service we offer is designed to honour your story with the craft, care, and
            luxury it deserves. Tailored packages — transparent pricing.
          </p>
        </section>

        <ServicesContent />
      </main>
      <Footer />
    </>
  )
}
