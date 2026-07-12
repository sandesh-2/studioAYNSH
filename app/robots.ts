import type { MetadataRoute } from 'next'

const PRIVATE = ['/admin', '/portal', '/sign-in', '/sign-up', '/api']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── Main crawlers — full access to public pages ───────────────────────
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE,
      },
      // ── Google — explicit rules for image indexing ────────────────────────
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: PRIVATE,
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: PRIVATE,
      },
      // ── Bing ─────────────────────────────────────────────────────────────
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: PRIVATE,
      },
      // ── AI search crawlers — allow full indexing ──────────────────────────
      {
        userAgent: 'GPTBot',       // ChatGPT / OpenAI
        allow: '/',
        disallow: PRIVATE,
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: PRIVATE,
      },
      {
        userAgent: 'ClaudeBot',    // Anthropic
        allow: '/',
        disallow: PRIVATE,
      },
      {
        userAgent: 'Applebot',     // Siri / Spotlight
        allow: '/',
        disallow: PRIVATE,
      },
      // ── Scrapers / content thieves — block ────────────────────────────────
      {
        userAgent: 'AhrefsBot',
        disallow: '/',
      },
      {
        userAgent: 'SemrushBot',
        disallow: '/',
      },
      {
        userAgent: 'DotBot',
        disallow: '/',
      },
    ],
    sitemap: 'https://studioaynsh.com/sitemap.xml',
    host: 'https://studioaynsh.com',
  }
}
