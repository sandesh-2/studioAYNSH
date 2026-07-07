import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import { AboutContent } from '@/components/about/about-content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Studio AYNSH | Meet Praveen Gupta',
  description:
    'Meet Praveen Gupta, lead photographer and founder of Studio AYNSH — a premium luxury photography studio based in Gorakhpur, India. Capturing untold stories through visual excellence.',
  keywords: ['Praveen Gupta', 'photographer', 'Studio AYNSH founder', 'photography expertise'],
  openGraph: {
    title: 'About Studio AYNSH | Meet Praveen Gupta',
    description:
      'Learn about Praveen Gupta and Studio AYNSH, a premium luxury photography studio in Gorakhpur, India.',
    url: 'https://studioaynsh.com/about',
  },
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
