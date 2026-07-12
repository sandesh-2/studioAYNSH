import { CtaSection } from '@/components/home/cta-section'
import { HeroSection } from '@/components/home/hero-section'
import { PhilosophySection } from '@/components/home/philosophy-section'
import { ServicesPreview } from '@/components/home/services-preview'
import { ShowcaseSection } from '@/components/home/showcase-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Studio AYNSH — Wedding Photographer Gorakhpur | Premium Photography & Cinematography',
  description:
    'Studio AYNSH — best wedding photographer in Gorakhpur, Uttar Pradesh. Premium photography and cinematography for weddings, pre-wedding shoots, portraits, fashion, drone and commercial photography across India. Founded by Praveen Gupta.',
  keywords: [
    'Studio AYNSH', 'Wedding Photographer Gorakhpur', 'Best Wedding Photographer Gorakhpur',
    'Photography Studio Gorakhpur', 'Pre Wedding Shoot Gorakhpur', 'Praveen Gupta photographer',
    'Destination Wedding Photographer India', 'Candid Wedding Photography', 'Drone Photography Gorakhpur',
  ],
  alternates: {
    canonical: 'https://studioaynsh.com',
  },
  openGraph: {
    title: 'Studio AYNSH — Wedding Photographer Gorakhpur | Premium Photography',
    description:
      'Best wedding photographer in Gorakhpur. Cinematic weddings, pre-wedding shoots, portraits and drone photography across India.',
    url: 'https://studioaynsh.com',
    images: [
      {
        url: 'https://studioaynsh.com/api/og?title=Studio%20AYNSH',
        width: 1200,
        height: 630,
        alt: 'Studio AYNSH — Premium Photography Studio, Gorakhpur',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studio AYNSH — Wedding Photographer Gorakhpur',
    description: 'Best wedding photographer in Gorakhpur. Cinematic weddings, pre-wedding, portraits, drone photography.',
    images: [{ url: 'https://studioaynsh.com/api/og?title=Studio%20AYNSH', alt: 'Studio AYNSH — Premium Photography' }],
  },
}

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <ShowcaseSection />
        <PhilosophySection />
        <ServicesPreview />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
