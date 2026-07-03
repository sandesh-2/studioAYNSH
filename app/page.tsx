import { CtaSection } from '@/components/home/cta-section'
import { HeroSection } from '@/components/home/hero-section'
import { PhilosophySection } from '@/components/home/philosophy-section'
import { ServicesPreview } from '@/components/home/services-preview'
import { ShowcaseSection } from '@/components/home/showcase-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'

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
