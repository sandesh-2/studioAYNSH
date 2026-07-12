'use client'

import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { BookNowButton } from '@/components/booking/book-now-button'
import { useRef } from 'react'

const services = [
  {
    id: 'wedding',
    number: '01',
    title: 'Wedding Photography',
    subtitle: 'Destination & Ceremony',
    image: '/images/service-wedding.png',
    description:
      'Your wedding day is the most important chapter of your love story. We document it with cinematic precision — from the quiet moments of preparation to the grand celebration, every emotion preserved forever.',
    includes: ['Full-day coverage', 'Second shooter', 'Edited digital gallery', 'Print-ready files', 'Private online gallery', 'Luxury album (optional)'],
    packages: [
      { name: 'Classic', price: '₹45,000', detail: '6 hours · 500+ images' },
      { name: 'Premium', price: '₹75,000', detail: '10 hours · 1000+ images · Second Shooter' },
      { name: 'Signature', price: '₹1,20,000', detail: 'Full day · Unlimited · Album included' },
    ],
  },
  {
    id: 'pre-wedding',
    number: '02',
    title: 'Pre-Wedding',
    subtitle: 'Romance & Storytelling',
    image: '/images/service-prewedding.png',
    description:
      'Before the vows, your love deserves its own story. Our pre-wedding sessions are crafted editorial experiences — locations chosen carefully, light sculpted thoughtfully, moments guided genuinely.',
    includes: ['3–5 hour shoot', 'Multiple locations', '200+ edited images', 'Outfit changes', 'Private gallery', 'Cinematic BTS reel'],
    packages: [
      { name: 'Intimate', price: '₹18,000', detail: '2 hours · 1 location · 100+ images' },
      { name: 'Story', price: '₹32,000', detail: '4 hours · 2 locations · 250+ images' },
      { name: 'Cinematic', price: '₹55,000', detail: '6 hours · Unlimited · Short film' },
    ],
  },
  {
    id: 'portrait',
    number: '03',
    title: 'Portrait Photography',
    subtitle: 'Individual & Editorial',
    image: '/images/service-portrait.png',
    description:
      'A portrait is not just a photograph — it is a revelation of character. Whether for personal branding, family memories, or artistic expression, we create portraits that speak with quiet authority.',
    includes: ['Studio or outdoor session', '60+ edited images', 'Wardrobe consultation', 'Retouching', 'Print-ready files', 'Digital delivery'],
    packages: [
      { name: 'Essential', price: '₹8,000', detail: '1 hour · Studio · 30+ images' },
      { name: 'Extended', price: '₹15,000', detail: '2 hours · Studio + Outdoor · 75+ images' },
      { name: 'Editorial', price: '₹28,000', detail: '4 hours · Full editorial session' },
    ],
  },
  {
    id: 'fashion',
    number: '04',
    title: 'Fashion Photography',
    subtitle: 'Commercial & Editorial',
    image: '/images/service-fashion.png',
    description:
      'Fashion photography at its finest — where garments meet vision and brands are brought to life. We create imagery that does not just show clothes, but tells the complete story of the collection.',
    includes: ['Concept development', 'Styling collaboration', 'Multiple looks', 'Retouched selects', 'Commercial licensing', 'Campaign deliverables'],
    packages: [
      { name: 'Look Book', price: '₹25,000', detail: '3 hours · 3 looks · 50 images' },
      { name: 'Campaign', price: '₹60,000', detail: '6 hours · 6 looks · 150 images' },
      { name: 'Full Production', price: 'Custom', detail: 'Fully produced editorial' },
    ],
  },
  {
    id: 'drone',
    number: '05',
    title: 'Drone Photography',
    subtitle: 'Aerial & Landscape',
    image: '/images/service-drone.png',
    description:
      'See your world from a perspective that takes your breath away. Our certified drone operators capture sweeping aerial footage and photographs that add an entirely new dimension to your visual story.',
    includes: ['Licensed drone operators', '4K aerial footage', 'Still photography', 'Post-production', 'Multiple passes', 'Delivery within 7 days'],
    packages: [
      { name: 'Aerial Stills', price: '₹12,000', detail: '1 hour · 20+ images' },
      { name: 'Aerial + Video', price: '₹22,000', detail: '2 hours · Stills + 4K footage' },
      { name: 'Cinematic', price: '₹40,000', detail: 'Half-day · Full cinematic package' },
    ],
  },
  {
    id: 'commercial',
    number: '06',
    title: 'Commercial Photography',
    subtitle: 'Brand & Product',
    image: '/images/service-commercial.png',
    description:
      'Visual storytelling that positions your brand at the intersection of aspiration and authenticity. From product photography to brand campaigns, we create imagery that converts and endures.',
    includes: ['Art direction', 'Concept development', 'Product styling', 'Commercial licensing', 'Brand guidelines adherence', 'Multiple use formats'],
    packages: [
      { name: 'Product', price: '₹15,000', detail: '20 products · White background + lifestyle' },
      { name: 'Brand Day', price: '₹45,000', detail: 'Full brand shoot · All assets' },
      { name: 'Campaign', price: 'Custom', detail: 'Multi-day production' },
    ],
  },
]

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const imageRight = index % 2 !== 0

  return (
    <motion.div
      ref={ref}
      id={service.id}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="border-t border-border pt-16 pb-20"
    >
      {/* Top row: number + title + image */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-12 items-start ${imageRight ? '' : ''}`}>
        {/* Title block */}
        <div className={imageRight ? 'lg:order-1' : 'lg:order-2'}>
          <p className="font-sans text-xs text-muted-foreground/40 tracking-[0.25em] mb-4">{service.number}</p>
          <h2 className="font-serif font-medium text-foreground text-3xl lg:text-5xl leading-tight mb-3">
            {service.title}
          </h2>
          <p className="font-sans text-xs text-muted-foreground tracking-[0.2em] uppercase mb-6">{service.subtitle}</p>
          <p className="font-sans text-base text-muted-foreground leading-relaxed">{service.description}</p>
        </div>

        {/* Service image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, delay: index * 0.05 + 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`relative aspect-[4/3] overflow-hidden bg-muted ${imageRight ? 'lg:order-2' : 'lg:order-1'}`}
        >
          <Image
            src={service.image}
            alt={`${service.title} by Studio AYNSH`}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {/* Subtle overlay with category label */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-5">
            <p className="font-sans text-[10px] text-background/70 tracking-[0.22em] uppercase">{service.subtitle}</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom row: includes + packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* What's included */}
        <div>
          <h3 className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-foreground mb-5">
            What&apos;s Included
          </h3>
          <ul className="space-y-2.5">
            {service.includes.map((item) => (
              <li key={item} className="flex items-center gap-3 font-sans text-sm text-muted-foreground">
                <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Packages */}
        <div>
          <h3 className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-foreground mb-5">Packages</h3>
          <div className="space-y-3">
            {service.packages.map((pkg) => (
              <div
                key={pkg.name}
                className="flex items-start justify-between p-4 border border-border hover:border-foreground/30 transition-colors duration-300"
              >
                <div>
                  <p className="font-serif font-medium text-foreground text-lg">{pkg.name}</p>
                  <p className="font-sans text-xs text-muted-foreground mt-1">{pkg.detail}</p>
                </div>
                <p className="font-serif text-xl font-light text-foreground shrink-0 ml-4">{pkg.price}</p>
              </div>
            ))}
          </div>
          <BookNowButton
            className="inline-flex items-center gap-3 mt-8 text-xs font-sans font-medium tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 group"
          >
            <span className="w-6 h-px bg-muted-foreground group-hover:w-10 group-hover:bg-foreground transition-all duration-300" />
            Book This Service
          </BookNowButton>
        </div>
      </div>
    </motion.div>
  )
}

export function ServicesContent() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
      {services.map((service, i) => (
        <ServiceCard key={service.id} service={service} index={i} />
      ))}

      {/* Final CTA */}
      <div className="py-16 border-t border-border text-center">
        <p className="font-sans text-sm text-muted-foreground mb-2">Need something bespoke?</p>
        <h2 className="font-serif font-light text-foreground text-3xl lg:text-4xl mb-8">
          Let&apos;s Create Something <em>Extraordinary</em>
        </h2>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-10 py-4 bg-foreground text-background text-xs font-sans font-medium tracking-[0.18em] uppercase hover:bg-accent hover:text-foreground transition-all duration-300"
        >
          Get in Touch
        </Link>
      </div>
    </div>
  )
}
