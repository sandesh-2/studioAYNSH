import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BlogPostContent } from '@/components/blog/blog-post-content'
import { ArticleSchema, BreadcrumbSchema } from '@/components/structured-data'
import { blogPosts, getBlogPost } from '@/lib/blog-data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const BASE_URL = 'https://studioaynsh.com'

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

  const canonicalUrl = `${BASE_URL}/blog/${post.slug}`
  const ogImage = post.heroImage.startsWith('http') ? post.heroImage : `${BASE_URL}${post.heroImage}`

  return {
    title: `${post.title} | Studio AYNSH Journal`,
    description: post.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonicalUrl,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      authors: ['Praveen Gupta'],
      tags: [post.category, 'photography', 'Studio AYNSH', 'Gorakhpur'],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.heroAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [{ url: ogImage, alt: post.heroAlt }],
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

  const canonicalUrl = `${BASE_URL}/blog/${post.slug}`
  const ogImage = post.heroImage.startsWith('http') ? post.heroImage : `${BASE_URL}${post.heroImage}`
  const dateISO = new Date(post.date).toISOString()

  return (
    <>
      <ArticleSchema
        title={post.title}
        description={post.excerpt}
        url={canonicalUrl}
        image={ogImage}
        imageAlt={post.heroAlt}
        datePublished={dateISO}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: BASE_URL },
          { name: 'Journal', url: `${BASE_URL}/blog` },
          { name: post.title, url: canonicalUrl },
        ]}
      />
      <Navigation />
      <main className="pt-20">
        <BlogPostContent post={post} />
      </main>
      <Footer />
    </>
  )
}
