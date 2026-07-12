'use client'

import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { BookNowButton } from '@/components/booking/book-now-button'

export function CtaSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative py-32 lg:py-48 overflow-hidden" aria-label="Book a session">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-2.png"
          alt="Photography session background"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-foreground/75" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.8 }}
          className="font-sans text-xs font-medium tracking-[0.3em] uppercase text-background/50 mb-8"
        >
          Begin Your Story
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 50, rotateX: 15, perspective: 1000 }}
          animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 1, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-serif font-light text-background leading-tight mb-12"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
        >
          Your Moment
          <br />
          <em>Deserves Excellence</em>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <motion.div
            whileHover={{ y: -6, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            <BookNowButton
              className="inline-flex items-center justify-center px-10 py-4 bg-background text-foreground text-xs font-sans font-medium tracking-[0.18em] uppercase hover:bg-accent hover:text-foreground transition-all duration-300 shadow-lg hover:shadow-2xl"
              label="Book Your Session"
            />
          </motion.div>
          <motion.div
            whileHover={{ y: -6, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-10 py-4 border border-background/40 text-background text-xs font-sans font-medium tracking-[0.18em] uppercase hover:border-background hover:bg-background/10 transition-all duration-300"
            >
              Send an Enquiry
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-background/40"
        >
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.3 }}
          >
            <motion.p
              className="font-serif text-3xl font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              500+
            </motion.p>
            <p className="font-sans text-xs tracking-[0.2em] uppercase mt-1">Sessions</p>
          </motion.div>
          <div className="w-px h-8 bg-background/20 hidden sm:block" />
          <div className="text-center">
            <p className="font-serif text-3xl font-light">10+</p>
            <p className="font-sans text-xs tracking-[0.2em] uppercase mt-1">Years</p>
          </div>
          <div className="w-px h-8 bg-background/20 hidden sm:block" />
          <div className="text-center">
            <p className="font-serif text-3xl font-light">100%</p>
            <p className="font-sans text-xs tracking-[0.2em] uppercase mt-1">Love</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
