import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import { AboutContent } from '@/components/about/about-content'
import { PersonSchema, WebPageSchema } from '@/components/structured-data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Studio AYNSH — Meet Praveen Gupta, Lead Photographer | Gorakhpur',
  description:
    'Meet Praveen Gupta — founder, CEO and lead photographer of Studio AYNSH, Gorakhpur\'s premier photography and cinematography studio. Capturing untold stories through cinematic excellence across India.',
  keywords: [
    'Praveen Gupta photographer', 'Praveen Gupta Gorakhpur', 'Studio AYNSH founder',
    'About Studio AYNSH', 'Lead photographer Gorakhpur', 'Best photographer Gorakhpur',
    'Photography studio owner Gorakhpur',
  ],
  alternates: {
    canonical: 'https://studioaynsh.com/about',
  },
  openGraph: {
    title: 'About Studio AYNSH — Meet Praveen Gupta, Lead Photographer',
    description:
      'Praveen Gupta, founder of Studio AYNSH — premium photography and cinematography studio in Gorakhpur, Uttar Pradesh.',
    url: 'https://studioaynsh.com/about',
    images: [
      {
        url: 'https://studioaynsh.com/api/og?title=About%20Studio%20AYNSH',
        width: 1200,
        height: 630,
        alt: 'Praveen Gupta — Founder of Studio AYNSH, Gorakhpur',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Studio AYNSH — Meet Praveen Gupta',
    description: 'Founder and lead photographer at Studio AYNSH, Gorakhpur\'s premier photography studio.',
    images: [{ url: 'https://studioaynsh.com/api/og?title=About%20Studio%20AYNSH', alt: 'Praveen Gupta — Studio AYNSH' }],
  },
}

export default function AboutPage() {
  return (
    <>
      <PersonSchema />
      <WebPageSchema
        title="About Studio AYNSH — Meet Praveen Gupta, Lead Photographer"
        description="Praveen Gupta, founder of Studio AYNSH — premium photography and cinematography studio in Gorakhpur, Uttar Pradesh."
        url="https://studioaynsh.com/about"
        breadcrumbItems={[
          { name: 'Home', url: 'https://studioaynsh.com' },
          { name: 'About', url: 'https://studioaynsh.com/about' },
        ]}
      />
      <Navigation />
      <main className="pt-20">
        <AboutContent />
      </main>
      <Footer />
    </>
  )
}
