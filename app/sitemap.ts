import type { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog-data'

const BASE_URL = 'https://studioaynsh.com'

// Use a pinned "last modified" date per content type.
// Avoid `new Date()` — it makes every deployment invalidate every URL's
// lastModified timestamp, which wastes Googlebot crawl budget.
const DATES = {
  home:      '2025-07-01',
  portfolio: '2025-07-01',
  services:  '2025-06-01',
  about:     '2025-06-01',
  blog:      '2025-07-01',
  booking:   '2025-06-01',
  contact:   '2025-06-01',
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: DATES.home,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: { languages: { 'en-IN': BASE_URL } },
    },
    {
      url: `${BASE_URL}/portfolio`,
      lastModified: DATES.portfolio,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: { languages: { 'en-IN': `${BASE_URL}/portfolio` } },
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: DATES.services,
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: { languages: { 'en-IN': `${BASE_URL}/services` } },
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: DATES.about,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages: { 'en-IN': `${BASE_URL}/about` } },
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: DATES.blog,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: { 'en-IN': `${BASE_URL}/blog` } },
    },
    {
      url: `${BASE_URL}/booking`,
      lastModified: DATES.booking,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages: { 'en-IN': `${BASE_URL}/booking` } },
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: DATES.contact,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages: { 'en-IN': `${BASE_URL}/contact` } },
    },
  ]

  // Blog post URLs — derive lastModified from the post's date field if parseable
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => {
    const parsed = new Date(post.date)
    const lastModified = isNaN(parsed.getTime()) ? DATES.blog : parsed.toISOString().split('T')[0]
    return {
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: { languages: { 'en-IN': `${BASE_URL}/blog/${post.slug}` } },
    }
  })

  return [...staticRoutes, ...blogRoutes]
}
