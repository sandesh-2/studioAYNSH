'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { LightboxModal } from './lightbox-modal'

const categories = ['All', 'Wedding', 'Pre-Wedding', 'Portrait', 'Fashion', 'Drone', 'Commercial', 'Birthday']

interface GalleryItem {
  id: number
  src: string
  alt: string
  category: string
  title: string
  location: string
  span?: 'wide' | 'tall' | 'normal'
}

const galleryItems: GalleryItem[] = [
  { id: 1, src: '/images/portfolio-wedding-1.png', alt: 'Grand wedding ceremony', category: 'Wedding', title: 'Grand Union', location: 'Gorakhpur', span: 'wide' },
  { id: 2, src: '/images/portfolio-portrait-1.png', alt: 'Elegant portrait', category: 'Portrait', title: 'Inner Light', location: 'Lucknow', span: 'tall' },
  { id: 3, src: '/images/portfolio-prewedding-1.png', alt: 'Forest pre-wedding', category: 'Pre-Wedding', title: 'Before Forever', location: 'Nainital', span: 'normal' },
  { id: 4, src: '/images/portfolio-fashion-1.png', alt: 'Fashion editorial', category: 'Fashion', title: 'Dressed in Gold', location: 'Delhi', span: 'normal' },
  { id: 5, src: '/images/portfolio-drone-1.png', alt: 'Aerial palace view', category: 'Drone', title: 'From Above', location: 'Jaipur', span: 'wide' },
  { id: 6, src: '/images/portfolio-wedding-1.png', alt: 'Wedding details', category: 'Wedding', title: 'Golden Vows', location: 'Varanasi', span: 'normal' },
  { id: 7, src: '/images/portfolio-portrait-1.png', alt: 'Studio portrait', category: 'Portrait', title: 'Quiet Confidence', location: 'Gorakhpur', span: 'tall' },
  { id: 8, src: '/images/portfolio-prewedding-1.png', alt: 'Sunrise pre-wedding', category: 'Pre-Wedding', title: 'Dawn Promise', location: 'Agra', span: 'normal' },
  { id: 9, src: '/images/portfolio-fashion-1.png', alt: 'Commercial shoot', category: 'Commercial', title: 'Brand Story', location: 'Mumbai', span: 'normal' },
  { id: 10, src: '/images/portfolio-drone-1.png', alt: 'Aerial ceremony', category: 'Drone', title: 'Sky Canvas', location: 'Udaipur', span: 'normal' },
  { id: 11, src: '/images/portfolio-wedding-1.png', alt: 'Night wedding', category: 'Wedding', title: 'Starlit Vows', location: 'Gorakhpur', span: 'wide' },
  { id: 12, src: '/images/portfolio-portrait-1.png', alt: 'Birthday portrait', category: 'Birthday', title: 'Milestone', location: 'Lucknow', span: 'normal' },
]

export function PortfolioClient() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null)

  const filtered =
    activeCategory === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory)

  return (
    <>
      {/* Filter bar */}
      <div className="px-6 lg:px-12 max-w-7xl mx-auto mb-12">
        <div className="flex flex-wrap gap-2 border-b border-border pb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-sans text-xs font-medium tracking-[0.15em] uppercase px-4 py-2 border transition-all duration-250 ${
                activeCategory === cat
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry grid */}
      <div className="px-6 lg:px-12 max-w-7xl mx-auto pb-24">
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 auto-rows-[200px] md:auto-rows-[220px]">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                onClick={() => setLightboxItem(item)}
                className={`group relative overflow-hidden cursor-pointer bg-muted ${
                  item.span === 'wide' ? 'col-span-2' : ''
                } ${item.span === 'tall' ? 'row-span-2' : ''}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-500" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  <p className="font-serif text-background font-medium text-lg leading-tight">{item.title}</p>
                  <p className="font-sans text-background/70 text-xs tracking-[0.15em] uppercase mt-1">{item.category} &bull; {item.location}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <LightboxModal item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </>
  )
}
