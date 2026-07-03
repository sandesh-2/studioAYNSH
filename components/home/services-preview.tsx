'use client'

import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'

const services = [
  {
    number: '01',
    title: 'Wedding Photography',
    subtitle: 'Destination & Ceremony',
    description: 'Every wedding is a universe of emotions. We document yours with cinematic precision.',
    href: '/services#wedding',
  },
  {
    number: '02',
    title: 'Pre-Wedding',
    subtitle: 'Romance & Storytelling',
    description: 'Before the vows, a story begins. Let us frame your love with editorial artistry.',
    href: '/services#pre-wedding',
  },
  {
    number: '03',
    title: 'Portrait',
    subtitle: 'Individual & Editorial',
    description: 'A portrait is more than a likeness — it is a revelation of character and soul.',
    href: '/services#portrait',
  },
  {
    number: '04',
    title: 'Fashion',
    subtitle: 'Commercial & Editorial',
    description: 'Where garments meet vision. We create imagery that defines brands and movements.',
    href: '/services#fashion',
  },
  {
    number: '05',
    title: 'Drone Photography',
    subtitle: 'Aerial & Landscape',
    description: 'A new perspective on your story — vast, sweeping, and breathtakingly cinematic.',
    href: '/services#drone',
  },
  {
    number: '06',
    title: 'Commercial',
    subtitle: 'Brand & Product',
    description: 'Visual storytelling that positions your brand as the luxury it truly is.',
    href: '/services#commercial',
  },
]

export function ServicesPreview() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="py-24 lg:py-36 bg-background" aria-label="Our services">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="font-sans text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4">
              What We Offer
            </p>
            <h2
              className="font-serif font-light text-foreground leading-tight"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
            >
              Crafted for
              <br />
              <em>Every Milestone</em>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-4 text-xs font-sans font-medium tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 group"
            >
              <span className="w-8 h-px bg-muted-foreground group-hover:w-12 group-hover:bg-foreground transition-all duration-400" />
              All Services
            </Link>
          </motion.div>
        </div>

        {/* Service list */}
        <div className="divide-y divide-border">
          {services.map((service, i) => (
            <motion.div
              key={service.number}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 + 0.2 }}
            >
              <Link
                href={service.href}
                className="group flex items-center justify-between py-7 gap-8 hover:bg-muted/50 -mx-4 px-4 transition-colors duration-300"
              >
                <div className="flex items-center gap-8 min-w-0">
                  <span className="font-sans text-xs text-muted-foreground/50 tracking-[0.2em] shrink-0 w-6">
                    {service.number}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-serif font-medium text-foreground text-xl lg:text-2xl tracking-wide group-hover:text-accent transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="font-sans text-xs text-muted-foreground tracking-[0.15em] uppercase mt-0.5">
                      {service.subtitle}
                    </p>
                  </div>
                </div>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-xs hidden lg:block shrink-0">
                  {service.description}
                </p>
                <span className="shrink-0 w-8 h-px bg-muted-foreground/30 group-hover:w-12 group-hover:bg-accent transition-all duration-400" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
