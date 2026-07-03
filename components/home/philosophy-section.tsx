'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const words = [
  'Luxury', 'Editorial', 'Minimal', 'Timeless', 'Elegant',
  'Sophisticated', 'Cinematic', 'Quiet', 'Modern', 'Authentic',
]

export function PhilosophySection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 lg:py-40 bg-foreground overflow-hidden" aria-label="Studio philosophy">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Large statement */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="font-sans text-xs font-medium tracking-[0.3em] uppercase text-background/30 mb-8"
            >
              Our Philosophy
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="font-serif font-light text-background leading-tight"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              Photography
              <br />
              as a form of
              <br />
              <em className="font-light">fine art</em>
            </motion.h2>
          </div>

          {/* Right: Text + words */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-sans text-base text-background/60 leading-relaxed mb-10 max-w-md"
            >
              Every frame we create is intentional. We believe in the power of
              silence — in the space between moments where true emotion lives.
              Our lens seeks what ordinary eyes overlook.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="font-sans text-base text-background/60 leading-relaxed mb-12 max-w-md"
            >
              Praveen Gupta leads every session personally — bringing over a
              decade of mastery in light, composition and human connection. The
              result is imagery that transcends documentation and becomes art.
            </motion.p>

            {/* Keyword cloud */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              {words.map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.05, duration: 0.4 }}
                  className="font-sans text-xs font-medium tracking-[0.15em] uppercase text-background/40 border border-background/15 px-3 py-1.5"
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
