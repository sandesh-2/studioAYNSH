'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useCallback } from 'react'

interface LightboxItem {
  id: number
  src: string
  alt: string
  category: string
  title: string
  location: string
}

interface LightboxModalProps {
  item: LightboxItem | null
  onClose: () => void
}

export function LightboxModal({ item, onClose }: LightboxModalProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
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

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-foreground/95 flex items-center justify-center p-4 md:p-12"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Lightbox: ${item.title}`}
        >
          {/* Close */}
          <button
            className="absolute top-6 right-6 p-2 text-background/60 hover:text-background transition-colors duration-200"
            onClick={onClose}
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          {/* Image */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative w-full max-w-5xl max-h-[80vh] aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-contain"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
          </motion.div>

          {/* Caption */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
            <p className="font-serif text-background text-xl font-light">{item.title}</p>
            <p className="font-sans text-background/50 text-xs tracking-[0.2em] uppercase mt-1">
              {item.category} &bull; {item.location}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
