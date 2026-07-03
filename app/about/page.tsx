import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import { AboutContent } from '@/components/about/about-content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Meet Praveen Gupta, lead photographer at Studio AYNSH — a premium photography studio based in Gorakhpur, India.',
}

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <AboutContent />
      </main>
      <Footer />
    </>
  )
}
