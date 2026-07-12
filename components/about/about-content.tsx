'use client'

import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { BookNowButton } from '@/components/booking/book-now-button'
import { useRef } from 'react'

const timeline = [
  { year: '2013', event: 'First camera, first frame. A quiet obsession begins.' },
  { year: '2015', event: 'First paid wedding assignment in Gorakhpur.' },
  { year: '2017', event: 'Studio AYNSH formally established.' },
  { year: '2019', event: 'Expanded to fashion and commercial photography.' },
  { year: '2021', event: 'Drone certification and aerial cinematography added.' },
  { year: '2023', event: '500+ sessions milestone. Pan-India operations.' },
  { year: '2024', event: 'Recognition as one of UP\'s leading luxury studios.' },
]

const gear = [
  'Sony Alpha A7R V', 'Sony FE 24–70mm f/2.8 GM II',
  'Sony FE 85mm f/1.4 GM', 'Sony FE 16–35mm f/2.8 GM',
  'DJI Mavic 3 Pro (Drone)', 'Profoto B10 Plus',
  'Elinchrom ELB 500 TTL', 'Custom Lightroom presets',
]

const values = [
  { title: 'Craft', body: 'Technical mastery in service of artistic vision. Every setting chosen with intention.' },
  { title: 'Emotion', body: 'We are not documenting events. We are preserving feelings that would otherwise be lost.' },
  { title: 'Trust', body: 'Our clients invite us into their most important moments. We honour that privilege absolutely.' },
  { title: 'Excellence', body: 'Good enough is not a phrase we understand. Every image is refined until it is right.' },
]

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

export function AboutContent() {
  return (
    <article>
      {/* Hero */}
      <section className="py-20 lg:py-28 px-6 lg:px-12 max-w-7xl mx-auto">
        <FadeUp>
          <p className="font-sans text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6">
            The Studio
          </p>
          <h1
            className="font-serif font-light text-foreground leading-tight"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
          >
            About AYNSH
          </h1>
        </FadeUp>
      </section>

      {/* Intro split */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Photo */}
          <FadeUp>
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/images/photographer.png"
                alt="Praveen Gupta — Lead Photographer, Studio AYNSH"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 to-transparent p-8">
                <p className="font-serif text-background text-2xl font-light">Praveen Gupta</p>
                <p className="font-sans text-background/60 text-xs tracking-[0.2em] uppercase mt-1">
                  Lead Photographer &amp; Creative Director
                </p>
              </div>
            </div>
          </FadeUp>

          {/* Text */}
          <div className="flex flex-col justify-center gap-8 lg:pt-12">
            <FadeUp delay={0.1}>
              <p className="font-serif text-foreground text-2xl lg:text-3xl font-light leading-relaxed italic">
                &ldquo;I don&apos;t photograph what I see. I photograph what I feel.&rdquo;
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="font-sans text-base text-muted-foreground leading-relaxed">
                Born in Gorakhpur, Uttar Pradesh, Praveen Gupta developed an obsession with light and
                human emotion from childhood. Over a decade of disciplined practice and countless
                thousands of frames, he has built Studio AYNSH into one of India&apos;s most
                respected luxury photography practices.
              </p>
            </FadeUp>
            <FadeUp delay={0.3}>
              <p className="font-sans text-base text-muted-foreground leading-relaxed">
                His philosophy is simple: photography must feel true. Not posed, not constructed —
                true. Every session he leads is guided by patience, presence, and an unwavering
                commitment to finding the authentic moment within the orchestrated one.
              </p>
            </FadeUp>
            <FadeUp delay={0.4}>
              <p className="font-sans text-base text-muted-foreground leading-relaxed">
                Studio AYNSH works exclusively in the luxury segment — small client roster,
                immense personal attention, and imagery that genuinely endures.
              </p>
            </FadeUp>
            <FadeUp delay={0.5}>
              <BookNowButton
                className="inline-flex items-center gap-4 text-xs font-sans font-medium tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 group"
              >
                <span className="w-8 h-px bg-muted-foreground group-hover:w-12 group-hover:bg-foreground transition-all duration-400" />
                Work With Praveen
              </BookNowButton>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 lg:py-32 bg-foreground px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <p className="font-sans text-xs font-medium tracking-[0.3em] uppercase text-background/30 mb-4">Core Values</p>
            <h2 className="font-serif font-light text-background text-4xl lg:text-5xl mb-16">What We Believe</h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <FadeUp key={v.title} delay={i * 0.1}>
                <div className="border-t border-background/20 pt-8">
                  <h3 className="font-serif text-background text-2xl font-light mb-4">{v.title}</h3>
                  <p className="font-sans text-background/50 text-sm leading-relaxed">{v.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 lg:py-32 px-6 lg:px-12 max-w-7xl mx-auto">
        <FadeUp>
          <p className="font-sans text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4">Journey</p>
          <h2 className="font-serif font-light text-foreground text-4xl lg:text-5xl mb-16">A Decade of Craft</h2>
        </FadeUp>
        <div className="relative">
          <div className="absolute left-[70px] top-0 bottom-0 w-px bg-border hidden md:block" />
          <div className="space-y-8">
            {timeline.map((item, i) => (
              <FadeUp key={item.year} delay={i * 0.07}>
                <div className="flex items-start gap-8">
                  <span className="font-sans text-sm font-medium text-muted-foreground/50 tracking-[0.1em] w-16 shrink-0 pt-0.5">{item.year}</span>
                  <div className="relative">
                    <div className="absolute -left-[29px] top-2 w-2 h-2 rounded-full bg-accent hidden md:block" />
                    <p className="font-serif text-foreground text-lg font-light">{item.event}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Gear */}
      <section className="py-24 lg:py-32 bg-secondary px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <p className="font-sans text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4">Equipment</p>
            <h2 className="font-serif font-light text-foreground text-4xl lg:text-5xl mb-16">The Gear</h2>
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gear.map((item, i) => (
              <FadeUp key={item} delay={i * 0.06}>
                <div className="border border-border p-5">
                  <p className="font-sans text-sm text-foreground leading-snug">{item}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </article>
  )
}
