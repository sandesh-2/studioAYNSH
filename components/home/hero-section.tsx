'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { BookNowButton } from '@/components/booking/book-now-button'

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[700px] max-h-[1100px] overflow-hidden flex items-end"
      aria-label="Hero"
    >
      {/* Parallax image */}
      <motion.div
        style={{ y: imageY }}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src="/images/hero-1.png"
          alt="Cinematic wedding photography by Studio AYNSH"
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/30 via-transparent to-transparent" />
      </motion.div>

      {/* Text content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full pb-20 lg:pb-28"
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="font-sans text-xs font-medium tracking-[0.3em] uppercase text-background/60 mb-6"
        >
          Gorakhpur &bull; Uttar Pradesh &bull; India
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40, rotateX: 20, perspective: 1000 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-serif font-light text-background leading-none mb-8"
          style={{ fontSize: 'clamp(3rem, 9vw, 8rem)' }}
        >
          We Capture
          <br />
          <span className="italic font-light">The Untold</span>
          <br />
          Story
        </motion.h1>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
        >
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-background text-foreground text-xs font-sans font-medium tracking-[0.18em] uppercase hover:bg-accent transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View Portfolio
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ x: 6 }}
            transition={{ duration: 0.3 }}
          >
            <BookNowButton
              label="Book a Session"
              className="inline-flex items-center gap-3 text-xs font-sans font-medium tracking-[0.18em] uppercase text-background/70 hover:text-background transition-colors duration-300 group"
            >
              <span className="w-8 h-px bg-background/50 group-hover:w-12 group-hover:bg-background transition-all duration-400" />
              Book a Session
            </BookNowButton>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        style={{ opacity }}
        className="absolute bottom-8 right-8 lg:right-12 z-10 flex flex-col items-center gap-3"
      >
        <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-background/40 rotate-90 origin-center">
          Scroll
        </span>
        <div className="w-px h-12 bg-background/30 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 right-0 bg-background/60"
            animate={{ y: ['0%', '100%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ height: '50%' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
