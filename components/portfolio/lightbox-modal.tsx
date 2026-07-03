'use client'

import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useCallback, useRef } from 'react'

interface LightboxItem {
  id: number
  src: string
  alt: string
  category: string
  title: string
  location: string
}

interface LightboxModalProps {
  items: LightboxItem[]
  index: number | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export function LightboxModal({ items, index, onClose, onPrev, onNext }: LightboxModalProps) {
  const item = index !== null ? items[index] : null

  // Touch / swipe support
  const dragX = useMotionValue(0)
  const opacity = useTransform(dragX, [-200, 0, 200], [0.4, 1, 0.4])
  const touchStartX = useRef<number | null>(null)

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    },
    [onClose, onPrev, onNext]
  )

  useEffect(() => {
    if (item) {
      window.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [item, handleKey])

  // Touch swipe handlers
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (delta < -50) onNext()
    else if (delta > 50) onPrev()
  }

  const hasPrev = index !== null && index > 0
  const hasNext = index !== null && index < items.length - 1

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] bg-foreground/96 flex items-center justify-center"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo: ${item.title}`}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Close */}
          <button
            className="absolute top-5 right-5 z-10 p-2.5 text-background/60 hover:text-background transition-colors duration-200"
            onClick={(e) => { e.stopPropagation(); onClose() }}
            aria-label="Close lightbox"
          >
            <X size={22} />
          </button>

          {/* Counter */}
          {index !== null && (
            <div className="absolute top-5 left-5 z-10 font-sans text-xs text-background/40 tracking-[0.15em]">
              {index + 1} / {items.length}
            </div>
          )}

          {/* Prev button */}
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            disabled={!hasPrev}
            aria-label="Previous image"
            className="absolute left-4 md:left-8 z-10 p-3 text-background/60 hover:text-background disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200 border border-background/20 hover:border-background/60 bg-foreground/30 hover:bg-foreground/50 backdrop-blur-sm"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            disabled={!hasNext}
            aria-label="Next image"
            className="absolute right-4 md:right-8 z-10 p-3 text-background/60 hover:text-background disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200 border border-background/20 hover:border-background/60 bg-foreground/30 hover:bg-foreground/50 backdrop-blur-sm"
          >
            <ChevronRight size={22} />
          </button>

          {/* Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.97, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.97, x: -30 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              style={{ opacity, aspectRatio: '4/3', maxHeight: '78vh' }}
              className="relative w-full max-w-5xl mx-16 md:mx-24"
              onClick={(e) => e.stopPropagation()}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) onNext()
                else if (info.offset.x > 80) onPrev()
                dragX.set(0)
              }}
              onDrag={(_, info) => dragX.set(info.offset.x)}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-contain select-none"
                sizes="(max-width: 1200px) 90vw, 1200px"
                priority
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          {/* Caption */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`cap-${item.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-7 left-1/2 -translate-x-1/2 text-center pointer-events-none"
            >
              <p className="font-serif text-background text-xl font-light">{item.title}</p>
              <p className="font-sans text-background/45 text-[10px] tracking-[0.22em] uppercase mt-1">
                {item.category} &bull; {item.location}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Dot navigation */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); /* handled via index */ }}
                aria-label={`Image ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  i === index ? 'bg-background w-4' : 'bg-background/30 hover:bg-background/60'
                }`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
