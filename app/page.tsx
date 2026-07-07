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
  title: 'Studio AYNSH — We Capture The Untold Story',
  description:
    'Premium luxury photography and cinematography studio in Gorakhpur. Specializing in wedding, portrait, fashion, and commercial photography. We capture your untold story.',
  openGraph: {
    title: 'Studio AYNSH — We Capture The Untold Story',
    description:
      'Premium luxury photography and cinematography studio in Gorakhpur. Specializing in wedding, portrait, fashion, and commercial photography.',
    url: 'https://studioaynsh.com',
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
