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
    default: 'Studio AYNSH — We Capture The Untold Story',
    template: '%s | Studio AYNSH',
  },
  description:
    'Studio AYNSH is a premium luxury photography and cinematography studio based in Gorakhpur, India. Specializing in wedding, portrait, fashion, and commercial photography.',
  keywords: [
    'luxury photography',
    'wedding photography',
    'portrait photography',
    'fashion photography',
    'cinematography',
    'Gorakhpur photographer',
    'Praveen Gupta',
    'Studio AYNSH',
    'pre-wedding photography',
    'drone photography',
    'professional studio',
    'photography services',
  ],
  authors: [{ name: 'Praveen Gupta', url: 'https://studioaynsh.com' }],
  creator: 'Studio AYNSH',
  publisher: 'Studio AYNSH',
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
    title: 'Studio AYNSH — We Capture The Untold Story',
    description:
      'Premium luxury photography and cinematography studio. Every image is a chapter of an untold story.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Studio AYNSH - Premium Photography',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studio AYNSH — We Capture The Untold Story',
    description: 'Premium luxury photography and cinematography studio.',
    creator: '@studioaynsh',
    images: ['/twitter-image.jpg'],
  },
  verification: {
    google: 'google-site-verification-code-here',
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Studio AYNSH" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="msapplication-TileColor" content="#f7f3ee" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="canonical" href="https://studioaynsh.com" />
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
