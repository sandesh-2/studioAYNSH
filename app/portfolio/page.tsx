import { PortfolioClient } from '@/components/portfolio/portfolio-client'
import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Photography Portfolio — Weddings, Portraits & More | Studio AYNSH Gorakhpur',
  description:
    'Browse Studio AYNSH\'s photography portfolio — cinematic weddings, pre-wedding shoots, portraits, fashion, drone and commercial photography from Gorakhpur and across India. Luxury photography showcase by Praveen Gupta.',
  keywords: [
    'Wedding Photography Portfolio Gorakhpur', 'Pre-Wedding Photos Gorakhpur',
    'Portrait Photography Portfolio', 'Fashion Photography India',
    'Drone Photography Portfolio', 'Studio AYNSH Portfolio',
    'Best Wedding Photos Gorakhpur', 'Candid Wedding Photography',
  ],
  alternates: {
    canonical: 'https://studioaynsh.com/portfolio',
  },
  openGraph: {
    title: 'Photography Portfolio — Weddings, Portraits & More | Studio AYNSH',
    description:
      'Cinematic weddings, pre-wedding shoots, portraits, fashion and drone photography portfolio from Studio AYNSH, Gorakhpur.',
    url: 'https://studioaynsh.com/portfolio',
    images: [
      {
        url: 'https://studioaynsh.com/api/og?title=Our%20Portfolio',
        width: 1200,
        height: 630,
        alt: 'Studio AYNSH Photography Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photography Portfolio | Studio AYNSH Gorakhpur',
    description: 'Cinematic weddings, pre-wedding, portraits and drone photography portfolio.',
    images: [{ url: 'https://studioaynsh.com/api/og?title=Our%20Portfolio', alt: 'Studio AYNSH Photography Portfolio' }],
  },
}

export default function PortfolioPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        {/* Page header */}
        <section className="py-20 lg:py-28 px-6 lg:px-12 max-w-7xl mx-auto">
          <p className="font-sans text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6">
            Our Work
          </p>
          <h1
            className="font-serif font-light text-foreground leading-tight"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
          >
            The Portfolio
          </h1>
        </section>

        <PortfolioClient />
      </main>
      <Footer />
    </>
  )
}
