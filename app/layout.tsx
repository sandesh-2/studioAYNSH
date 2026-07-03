import { Analytics } from '@vercel/analytics/next'
import { AiConcierge } from '@/components/ai-concierge'
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
  ],
  authors: [{ name: 'Praveen Gupta', url: 'https://studioaynsh.com' }],
  creator: 'Studio AYNSH',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Studio AYNSH',
    title: 'Studio AYNSH — We Capture The Untold Story',
    description:
      'Premium luxury photography and cinematography studio. Every image is a chapter of an untold story.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studio AYNSH — We Capture The Untold Story',
    description: 'Premium luxury photography and cinematography studio.',
    creator: '@studioaynsh',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
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
    <html lang="en" className={`${cormorant.variable} ${inter.variable} bg-background`}>
      <body className="antialiased font-sans">
        {children}
        <AiConcierge />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
