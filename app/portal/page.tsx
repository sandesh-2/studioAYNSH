import { Footer } from '@/components/footer'
import { Navigation } from '@/components/navigation'
import { ClientPortalUI } from '@/components/portal/client-portal-ui'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Client Portal',
  description: 'Secure client portal for Studio AYNSH — view your gallery, download photos, and track your project.',
}

export default function PortalPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20 min-h-screen">
        <ClientPortalUI />
      </main>
      <Footer />
    </>
  )
}
