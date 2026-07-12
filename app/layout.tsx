import { Analytics } from '@vercel/analytics/next'
import { AiConcierge } from '@/components/ai-concierge'
import { PagePreloader } from '@/components/page-preloader'
import { LocalBusinessSchema } from '@/components/structured-data'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://studioaynsh.com'),
  title: {
    default: 'Studio AYNSH — Wedding Photographer Gorakhpur | Premium Photography',
    template: '%s | Studio AYNSH',
  },
  description:
    'Studio AYNSH — premium wedding photography and cinematography studio in Gorakhpur, Uttar Pradesh. Specialising in cinematic weddings, pre-wedding shoots, portraits, fashion, drone photography and commercial photography across India. Founded by Praveen Gupta.',
  keywords: [
    'Studio AYNSH',
    'Studio AYNSH Gorakhpur',
    'Wedding Photographer Gorakhpur',
    'Best Wedding Photographer Gorakhpur',
    'Photography Studio Gorakhpur',
    'Pre Wedding Photographer Gorakhpur',
    'Pre Wedding Shoot Gorakhpur',
    'Wedding Photography Gorakhpur',
    'Wedding Cinematographer Gorakhpur',
    'Best Photographer Gorakhpur',
    'Professional Photographer Gorakhpur',
    'Portrait Photographer Gorakhpur',
    'Fashion Photographer Gorakhpur',
    'Drone Photography Gorakhpur',
    'Wedding Videographer Gorakhpur',
    'Luxury Wedding Photographer India',
    'Destination Wedding Photographer',
    'Candid Wedding Photographer',
    'Photographer Uttar Pradesh',
    'Praveen Gupta photographer',
  ],
  authors: [{ name: 'Praveen Gupta', url: 'https://studioaynsh.com/about' }],
  creator: 'Praveen Gupta',
  publisher: 'Studio AYNSH',
  category: 'Photography',
  classification: 'Photography & Cinematography Services',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://studioaynsh.com',
    siteName: 'Studio AYNSH',
    title: 'Studio AYNSH — Wedding Photographer Gorakhpur | Premium Photography',
    description:
      'Premium wedding photography and cinematography studio in Gorakhpur. Cinematic weddings, pre-wedding shoots, portraits, fashion and drone photography across India.',
    images: [
      {
        url: 'https://studioaynsh.com/api/og?title=Studio%20AYNSH',
        width: 1200,
        height: 630,
        alt: 'Studio AYNSH — Premium Photography Studio, Gorakhpur',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@studioaynsh',
    creator: '@studioaynsh',
    title: 'Studio AYNSH — Wedding Photographer Gorakhpur',
    description:
      'Premium wedding photography and cinematography studio in Gorakhpur, India. We capture the untold story.',
    images: [
      {
        url: 'https://studioaynsh.com/api/og?title=Studio%20AYNSH',
        alt: 'Studio AYNSH — Premium Photography Studio, Gorakhpur',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://studioaynsh.com',
    languages: {
      'en-IN': 'https://studioaynsh.com',
    },
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f3ee',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${cormorant.variable} ${inter.variable} bg-background`}>
      <head>
        {/* Resource hints — critical third-party origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://maps.gstatic.com" />

        {/* PWA / native app */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Studio AYNSH" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="msapplication-TileColor" content="#f7f3ee" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Geographic / local SEO meta */}
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Gorakhpur, Uttar Pradesh, India" />
        <meta name="geo.position" content="26.722472;83.390111" />
        <meta name="ICBM" content="26.722472, 83.390111" />

        {/* Structured data — global */}
        <LocalBusinessSchema />
      </head>
      <body className="antialiased font-sans">
        <PagePreloader />
        {children}
        <AiConcierge />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
