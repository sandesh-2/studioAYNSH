import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BlogPostContent } from '@/components/blog/blog-post-content'
import { blogPosts, getBlogPost } from '@/lib/blog-data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return { title: 'Post Not Found — Studio AYNSH' }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.heroImage, alt: post.heroAlt }],
      type: 'article',
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <BlogPostContent post={post} />
      </main>
      <Footer />
    </>
  )
}
