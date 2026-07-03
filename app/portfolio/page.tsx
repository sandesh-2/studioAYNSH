import { PortfolioClient } from '@/components/portfolio/portfolio-client'
import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Browse Studio AYNSH\'s portfolio — wedding, pre-wedding, portrait, fashion, drone, and commercial photography from across India.',
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
