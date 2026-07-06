'use client'

import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useCallback, useRef, useState } from 'react'

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

const ZOOM_STEP = 0.4
const ZOOM_MIN = 1
const ZOOM_MAX = 3

export function LightboxModal({ items, index, onClose, onPrev, onNext }: LightboxModalProps) {
  const item = index !== null ? items[index] : null

  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Touch / swipe support
  const dragX = useMotionValue(0)
  const opacity = useTransform(dragX, [-200, 0, 200], [0.4, 1, 0.4])
  const touchStartX = useRef<number | null>(null)

  // Reset zoom when image changes
  useEffect(() => {
    setZoom(1)
  }, [index])

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) { document.exitFullscreen?.(); setIsFullscreen(false) }
        else onClose()
      }
      if (e.key === 'ArrowLeft' && zoom === 1) onPrev()
      if (e.key === 'ArrowRight' && zoom === 1) onNext()
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(z + ZOOM_STEP, ZOOM_MAX))
      if (e.key === '-') setZoom((z) => Math.max(z - ZOOM_STEP, ZOOM_MIN))
    },
    [onClose, onPrev, onNext, zoom, isFullscreen]
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

  // Fullscreen API
  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }, [])

  useEffect(() => {
    function onFSChange() {
      if (!document.fullscreenElement) setIsFullscreen(false)
    }
    document.addEventListener('fullscreenchange', onFSChange)
    return () => document.removeEventListener('fullscreenchange', onFSChange)
  }, [])

  // Touch swipe handlers (only when not zoomed)
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || zoom > 1) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (delta < -50) onNext()
    else if (delta > 50) onPrev()
  }

  const hasPrev = index !== null && index > 0
  const hasNext = index !== null && index < items.length - 1

  // Icon button shared style
  const iconBtn =
    'p-2.5 text-background/55 hover:text-background transition-colors duration-200 border border-background/15 hover:border-background/50 bg-foreground/25 hover:bg-foreground/45 backdrop-blur-sm'

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] bg-foreground/96 flex items-center justify-center"
          onClick={zoom === 1 ? onClose : undefined}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo: ${item.title}`}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* ── Top bar ───────────────────────────────────────────────── */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-4">
            {/* Counter */}
            <span className="font-sans text-xs text-background/40 tracking-[0.15em]">
              {index !== null ? `${index + 1} / ${items.length}` : ''}
            </span>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Zoom out */}
              <button
                onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(z - ZOOM_STEP, ZOOM_MIN)) }}
                disabled={zoom <= ZOOM_MIN}
                aria-label="Zoom out"
                className={`${iconBtn} disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                <ZoomOut size={16} />
              </button>

              {/* Zoom level indicator */}
              <span className="font-sans text-[10px] text-background/40 tracking-[0.12em] min-w-[36px] text-center select-none">
                {Math.round(zoom * 100)}%
              </span>

              {/* Zoom in */}
              <button
                onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(z + ZOOM_STEP, ZOOM_MAX)) }}
                disabled={zoom >= ZOOM_MAX}
                aria-label="Zoom in"
                className={`${iconBtn} disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                <ZoomIn size={16} />
              </button>

              {/* Fullscreen */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleFullscreen() }}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                className={iconBtn}
              >
                {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
              </button>

              {/* Close */}
              <button
                onClick={(e) => { e.stopPropagation(); onClose() }}
                aria-label="Close lightbox"
                className={iconBtn}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* ── Prev / Next ────────────────────────────────────────────── */}
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            disabled={!hasPrev || zoom > 1}
            aria-label="Previous image"
            className="absolute left-4 md:left-8 z-10 p-3 text-background/60 hover:text-background disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200 border border-background/20 hover:border-background/60 bg-foreground/30 hover:bg-foreground/50 backdrop-blur-sm"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            disabled={!hasNext || zoom > 1}
            aria-label="Next image"
            className="absolute right-4 md:right-8 z-10 p-3 text-background/60 hover:text-background disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200 border border-background/20 hover:border-background/60 bg-foreground/30 hover:bg-foreground/50 backdrop-blur-sm"
          >
            <ChevronRight size={22} />
          </button>

          {/* ── Image ─────────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.97, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.97, x: -30 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              style={{ opacity, aspectRatio: '4/3', maxHeight: '78vh' }}
              className="relative w-full max-w-5xl mx-16 md:mx-24 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              drag={zoom > 1 ? true : 'x'}
              dragConstraints={zoom > 1 ? undefined : { left: 0, right: 0 }}
              dragElastic={zoom > 1 ? 0.05 : 0.18}
              onDragEnd={(_, info) => {
                if (zoom > 1) return
                if (info.offset.x < -80) onNext()
                else if (info.offset.x > 80) onPrev()
                dragX.set(0)
              }}
              onDrag={(_, info) => { if (zoom === 1) dragX.set(info.offset.x) }}
            >
              <motion.div
                className="w-full h-full"
                animate={{ scale: zoom }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ transformOrigin: 'center center', cursor: zoom > 1 ? 'move' : 'default' }}
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
            </motion.div>
          </AnimatePresence>

          {/* ── Caption ───────────────────────────────────────────────── */}
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

          {/* ── Dot navigation ────────────────────────────────────────── */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {items.map((_, i) => (
              <span
                key={i}
                aria-label={`Image ${i + 1}`}
                className={`block h-1.5 rounded-full transition-all duration-200 ${
                  i === index ? 'bg-background w-4' : 'bg-background/30 w-1.5'
                }`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
