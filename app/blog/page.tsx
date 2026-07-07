import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BlogGrid } from '@/components/blog/blog-grid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Photography Blog & Journal | Studio AYNSH Insights',
  description:
    'Photography insights, behind-the-scenes stories, and expert guides from Studio AYNSH. Explore tips on weddings, portraits, lighting, cinematography, and more.',
  keywords: [
    'photography blog',
    'photography tips',
    'wedding photography guides',
    'portrait photography',
    'photography tutorials',
    'behind the scenes',
  ],
  openGraph: {
    title: 'Photography Blog & Journal | Studio AYNSH Insights',
    description:
      'Photography insights, behind-the-scenes stories, and expert guides from Studio AYNSH.',
    url: 'https://studioaynsh.com/blog',
    type: 'website',
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
