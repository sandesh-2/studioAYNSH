import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/portal', '/sign-in', '/sign-up', '/api'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/portal', '/sign-in', '/sign-up', '/api'],
      },
    ],
    sitemap: 'https://studioaynsh.com/sitemap.xml',
    host: 'https://studioaynsh.com',
  }
}
