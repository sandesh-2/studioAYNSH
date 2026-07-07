'use client'

import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'

const showcaseImages = [
  {
    src: '/images/portfolio-wedding-1.png',
    alt: 'Luxury Indian wedding ceremony photography',
    category: 'Wedding',
    aspect: 'tall',
  },
  {
    src: '/images/portfolio-portrait-1.png',
    alt: 'Editorial portrait photography',
    category: 'Portrait',
    aspect: 'standard',
  },
  {
    src: '/images/portfolio-prewedding-1.png',
    alt: 'Romantic pre-wedding photography',
    category: 'Pre-Wedding',
    aspect: 'wide',
  },
  {
    src: '/images/portfolio-fashion-1.png',
    alt: 'High-end fashion photography',
    category: 'Fashion',
    aspect: 'standard',
  },
  {
    src: '/images/portfolio-drone-1.png',
    alt: 'Aerial drone photography',
    category: 'Drone',
    aspect: 'wide',
  },
]

function ShowcaseItem({
  image,
  index,
}: {
  image: (typeof showcaseImages)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateY: -15, perspective: 1000 }}
      animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
      whileHover={{ y: -8, rotateY: 5 }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative overflow-hidden cursor-pointer"
    >
      <div
        className={`relative overflow-hidden ${
          image.aspect === 'tall'
            ? 'aspect-[3/4]'
            : image.aspect === 'wide'
            ? 'aspect-[4/3]'
            : 'aspect-square'
        }`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-500" />
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <span className="inline-block font-sans text-xs font-medium tracking-[0.2em] uppercase text-background border border-background/50 px-3 py-1.5">
            {image.category}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export function ShowcaseSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  return (
    <section className="py-24 lg:py-36 bg-background" aria-label="Photography showcase">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div ref={titleRef} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <p className="font-sans text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Featured Work
            </p>
            <h2 className="font-serif font-light text-foreground leading-tight"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
              Stories Worth
              <br />
              <em>Remembering</em>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-4 text-xs font-sans font-medium tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-300 group"
            >
              <span className="w-8 h-px bg-muted-foreground group-hover:w-12 group-hover:bg-foreground transition-all duration-400" />
              View All Work
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {showcaseImages.map((image, i) => (
            <ShowcaseItem key={image.src} image={image} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
