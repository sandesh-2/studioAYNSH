import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import { ServicesContent } from '@/components/services/services-content'
import { FAQSchema, PhotographyServiceSchema, WebPageSchema } from '@/components/structured-data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Photography & Cinematography Services — Packages & Pricing | Studio AYNSH Gorakhpur',
  description:
    'Studio AYNSH offers premium photography and cinematography services in Gorakhpur — cinematic weddings (from ₹45,000), pre-wedding shoots, portraits, fashion photography, drone photography and commercial photography across Uttar Pradesh and India.',
  keywords: [
    'Wedding Photography Services Gorakhpur', 'Pre-Wedding Photography Packages',
    'Portrait Photography Pricing', 'Fashion Photography Gorakhpur',
    'Drone Photography Services India', 'Cinematography Services Gorakhpur',
    'Commercial Photography Gorakhpur', 'Photography Packages Gorakhpur',
    'Wedding Photography Prices India', 'Studio AYNSH Services',
  ],
  alternates: {
    canonical: 'https://studioaynsh.com/services',
  },
  openGraph: {
    title: 'Photography & Cinematography Services | Studio AYNSH Gorakhpur',
    description:
      'Cinematic weddings, pre-wedding shoots, portraits, fashion and drone photography services from Studio AYNSH, Gorakhpur. Transparent pricing, luxury results.',
    url: 'https://studioaynsh.com/services',
    images: [
      {
        url: 'https://studioaynsh.com/api/og?title=Our%20Services',
        width: 1200,
        height: 630,
        alt: 'Studio AYNSH Photography & Cinematography Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photography & Cinematography Services | Studio AYNSH',
    description: 'Weddings, pre-wedding, portraits, fashion and drone photography in Gorakhpur.',
    images: [{ url: 'https://studioaynsh.com/api/og?title=Our%20Services', alt: 'Studio AYNSH Services' }],
  },
}

export default function ServicesPage() {
  return (
    <>
      <PhotographyServiceSchema />
      <FAQSchema
        questions={[
          { q: 'What is the starting price for wedding photography at Studio AYNSH?', a: 'Wedding photography packages at Studio AYNSH start from ₹45,000 for the Classic package, which includes 6 hours of coverage and 500+ edited images.' },
          { q: 'Does Studio AYNSH cover destination weddings across India?', a: 'Yes. Studio AYNSH covers destination weddings across India, including popular locations in Rajasthan, Goa, Himachal Pradesh, Kerala and all major cities in Uttar Pradesh.' },
          { q: 'How long does it take to receive edited photos after the wedding?', a: 'Edited wedding photographs are typically delivered within 3–4 weeks of the event. Rush delivery is available on request.' },
          { q: 'Is drone photography included in wedding packages?', a: 'Drone photography and videography can be added to any wedding package. Standalone drone packages start from ₹12,000.' },
          { q: 'Does Studio AYNSH offer pre-wedding shoots outside Gorakhpur?', a: 'Yes. Studio AYNSH offers pre-wedding shoots at any location of your choice — including Delhi, Agra, Varanasi, Jaipur, and destinations across India.' },
          { q: 'Can I book a portrait or fashion photography session?', a: 'Absolutely. Studio AYNSH offers portrait photography starting at ₹8,000 and fashion / commercial photography from ₹25,000. Sessions can be done at the studio or on location.' },
        ]}
      />
      <WebPageSchema
        title="Photography & Cinematography Services | Studio AYNSH Gorakhpur"
        description="Cinematic weddings, pre-wedding shoots, portraits, fashion and drone photography services from Studio AYNSH, Gorakhpur."
        url="https://studioaynsh.com/services"
        breadcrumbItems={[
          { name: 'Home', url: 'https://studioaynsh.com' },
          { name: 'Services', url: 'https://studioaynsh.com/services' },
        ]}
      />
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
