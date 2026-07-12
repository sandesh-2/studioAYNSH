import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BlogGrid } from '@/components/blog/blog-grid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Photography Blog & Journal — Tips, Stories & Guides | Studio AYNSH Gorakhpur',
  description:
    'Photography insights, wedding tips, behind-the-scenes stories and expert guides from Studio AYNSH Gorakhpur. Written by lead photographer Praveen Gupta — covering weddings, portraits, lighting, cinematography and drone photography.',
  keywords: [
    'Photography Blog Gorakhpur', 'Wedding Photography Tips India', 'Pre-Wedding Photography Guide',
    'Portrait Photography Tips', 'Cinematography Blog', 'Studio AYNSH Blog',
    'Photography Journal India', 'Behind the scenes photography',
  ],
  alternates: {
    canonical: 'https://studioaynsh.com/blog',
  },
  openGraph: {
    title: 'Photography Blog & Journal | Studio AYNSH Gorakhpur',
    description:
      'Wedding tips, photography insights and behind-the-scenes stories from Studio AYNSH, Gorakhpur.',
    url: 'https://studioaynsh.com/blog',
    type: 'website',
    images: [
      {
        url: 'https://studioaynsh.com/api/og?title=Blog%20%26%20Journal',
        width: 1200,
        height: 630,
        alt: 'Studio AYNSH Photography Blog & Journal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photography Blog & Journal | Studio AYNSH',
    description: 'Wedding tips, photography insights and behind-the-scenes from Studio AYNSH.',
    images: [{ url: 'https://studioaynsh.com/api/og?title=Blog%20%26%20Journal', alt: 'Studio AYNSH Blog' }],
  },
}

export default function BlogPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <BlogGrid />
      </main>
      <Footer />
    </>
  )
}
