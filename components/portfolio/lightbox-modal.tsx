'use client'

import { AnimatePresence, motion, useMotionValue, useTransform, animate } from 'framer-motion'
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
const ZOOM_MIN  = 1
const ZOOM_MAX  = 3

export function LightboxModal({ items, index, onClose, onPrev, onNext }: LightboxModalProps) {
  const item = index !== null ? items[index] : null

  const [zoom, setZoom]             = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Pan offset (pixels) — bounded manually so image never leaves frame
  const panX = useMotionValue(0)
  const panY = useMotionValue(0)

  // Swipe-to-navigate opacity at zoom = 1
  const swipeX  = useMotionValue(0)
  const opacity = useTransform(swipeX, [-200, 0, 200], [0.4, 1, 0.4])

  const containerRef = useRef<HTMLDivElement>(null)
  const imageWrapRef = useRef<HTMLDivElement>(null)

  // ── Reset pan + zoom when image changes ─────────────────────────────────
  useEffect(() => {
    setZoom(1)
    panX.set(0)
    panY.set(0)
    swipeX.set(0)
  }, [index]) // eslint-disable-line react-hooks/exhaustive-deps

  // Animate pan back to origin when zoom resets to 1
  useEffect(() => {
    if (zoom <= 1) {
      animate(panX, 0, { duration: 0.2 })
      animate(panY, 0, { duration: 0.2 })
    }
  }, [zoom]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Compute pan bounds from zoom level + current container size ──────────
  // Returns the max pixel offsets so the image edge never exits the container.
  function getPanBounds() {
    const el = imageWrapRef.current
    if (!el || zoom <= 1) return { left: 0, right: 0, top: 0, bottom: 0 }
    const { width, height } = el.getBoundingClientRect()
    // The image is scaled about the center so each edge extends by (zoom-1)/2
    const hw = (width  * (zoom - 1)) / 2
    const hh = (height * (zoom - 1)) / 2
    // Framer dragConstraints: left/top are negative, right/bottom are positive
    return { left: -hw, right: hw, top: -hh, bottom: hh }
  }

  // Snap pan back inside bounds (called after drag ends)
  function clampPan() {
    const { left, right, top, bottom } = getPanBounds()
    const cx = Math.max(left, Math.min(right,  panX.get()))
    const cy = Math.max(top,  Math.min(bottom, panY.get()))
    animate(panX, cx, { duration: 0.18, ease: 'easeOut' })
    animate(panY, cy, { duration: 0.18, ease: 'easeOut' })
  }

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) { document.exitFullscreen?.(); setIsFullscreen(false) }
        else onClose()
      }
      if (e.key === 'ArrowLeft')  onPrev()
      if (e.key === 'ArrowRight') onNext()
      if ((e.key === '+' || e.key === '=') && !e.ctrlKey)
        setZoom((z) => +(Math.min(z + ZOOM_STEP, ZOOM_MAX)).toFixed(2))
      if (e.key === '-' && !e.ctrlKey)
        setZoom((z) => +(Math.max(z - ZOOM_STEP, ZOOM_MIN)).toFixed(2))
    },
    [onClose, onPrev, onNext, isFullscreen],
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

  // ── Fullscreen API ────────────────────────────────────────────────────────
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
    const onFSChange = () => { if (!document.fullscreenElement) setIsFullscreen(false) }
    document.addEventListener('fullscreenchange', onFSChange)
    return () => document.removeEventListener('fullscreenchange', onFSChange)
  }, [])

  // ── Helpers ───────────────────────────────────────────────────────────────
  const hasPrev = index !== null && index > 0
  const hasNext = index !== null && index < items.length - 1

  function zoomIn()  { setZoom((z) => +(Math.min(z + ZOOM_STEP, ZOOM_MAX)).toFixed(2)) }
  function zoomOut() { setZoom((z) => +(Math.max(z - ZOOM_STEP, ZOOM_MIN)).toFixed(2)) }

  const iconBtn =
    'p-2.5 text-background/55 hover:text-background transition-colors duration-200 border border-background/15 hover:border-background/50 bg-foreground/25 hover:bg-foreground/45 backdrop-blur-sm'

  // ── Backdrop click: only close when clicking the dark background directly ─
  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }

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
          // Only close when clicking the raw backdrop, not any child element
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo: ${item.title}`}
        >
          {/* ── Top bar ───────────────────────────────────────────────── */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-4">
            <span className="font-sans text-xs text-background/40 tracking-[0.15em]">
              {index !== null ? `${index + 1} / ${items.length}` : ''}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); zoomOut() }}
                disabled={zoom <= ZOOM_MIN}
                aria-label="Zoom out"
                className={`${iconBtn} disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                <ZoomOut size={16} />
              </button>

              <span className="font-sans text-[10px] text-background/40 tracking-[0.12em] min-w-[36px] text-center select-none">
                {Math.round(zoom * 100)}%
              </span>

              <button
                onClick={(e) => { e.stopPropagation(); zoomIn() }}
                disabled={zoom >= ZOOM_MAX}
                aria-label="Zoom in"
                className={`${iconBtn} disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                <ZoomIn size={16} />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); toggleFullscreen() }}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                className={iconBtn}
              >
                {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); onClose() }}
                aria-label="Close lightbox"
                className={iconBtn}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* ── Prev button — always enabled when hasPrev ─────────────── */}
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            disabled={!hasPrev}
            aria-label="Previous image"
            className="absolute left-4 md:left-8 z-10 p-3 text-background/60 hover:text-background disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200 border border-background/20 hover:border-background/60 bg-foreground/30 hover:bg-foreground/50 backdrop-blur-sm"
          >
            <ChevronLeft size={22} />
          </button>

          {/* ── Next button — always enabled when hasNext ─────────────── */}
          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            disabled={!hasNext}
            aria-label="Next image"
            className="absolute right-4 md:right-8 z-10 p-3 text-background/60 hover:text-background disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-200 border border-background/20 hover:border-background/60 bg-foreground/30 hover:bg-foreground/50 backdrop-blur-sm"
          >
            <ChevronRight size={22} />
          </button>

          {/* ── Image container ────────────────────────────────────────── */}
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
              // Swipe-to-navigate at zoom = 1 only
              drag={zoom === 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDrag={(_, info) => { if (zoom === 1) swipeX.set(info.offset.x) }}
              onDragEnd={(_, info) => {
                swipeX.set(0)
                if (zoom > 1) return
                if (info.offset.x < -80) onNext()
                else if (info.offset.x > 80) onPrev()
              }}
            >
              {/*
                Pan layer — manually bounded via `dragConstraints` object.
                We pass computed pixel values so Framer Motor clamps correctly
                even though the visual scale is applied on a child element.
              */}
              <motion.div
                ref={imageWrapRef}
                style={{ x: panX, y: panY, width: '100%', height: '100%' }}
                drag={zoom > 1 ? true : false}
                dragConstraints={getPanBounds()}
                dragElastic={0}
                dragMomentum={false}
                onDragEnd={clampPan}
                whileDrag={{ cursor: 'grabbing' }}
              >
                {/* Scale layer: visual zoom anchored at center */}
                <motion.div
                  className="w-full h-full"
                  animate={{ scale: zoom }}
                  transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{
                    transformOrigin: 'center center',
                    cursor: zoom > 1 ? 'grab' : 'default',
                  }}
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
