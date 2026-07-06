/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow both quality values used across the app (75 default + 90 for hero/lightbox)
    qualities: [75, 90],
  },
  // Limit server action payloads to prevent abuse (OWASP A05)
  experimental: {
    serverActions: {
      bodySizeLimit: '512kb',
    },
  },

  // OWASP-aligned HTTP security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking (OWASP A05)
          { key: 'X-Frame-Options', value: 'DENY' },
          // Prevent MIME sniffing (OWASP A05)
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Enforce HTTPS (OWASP A02)
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          // Referrer policy — don't leak URL to third parties
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Disable browser features not needed (OWASP A05)
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          // Content Security Policy (OWASP A03 — XSS)
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https://*.vercel-storage.com https://*.public.blob.vercel-storage.com",
              "connect-src 'self' https://api.resend.com https://*.vercel-analytics.com https://va.vercel-scripts.com",
              "media-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
      // API routes — stricter CSP, no caching of sensitive data
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ]
  },
}

export default nextConfig
