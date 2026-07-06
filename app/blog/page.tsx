import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BlogGrid } from '@/components/blog/blog-grid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Journal — Studio AYNSH',
  description:
    'Photography insights, behind-the-scenes stories, and expert guides from Studio AYNSH. Explore tips on weddings, portraits, lighting, and more.',
  openGraph: {
    title: 'Journal — Studio AYNSH',
    description: 'Photography insights and expert guides from Studio AYNSH.',
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
