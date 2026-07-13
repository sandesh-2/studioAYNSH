'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { useState, useCallback } from 'react'
import { Home, BookImage, Info, Mail, X } from 'lucide-react'

/* ── Nav data ──────────────────────────────────────────────────────────────── */
const LEFT_ITEMS  = [
  { label: 'Home',      href: '/',          icon: Home },
  { label: 'Portfolio', href: '/portfolio', icon: BookImage },
]
const RIGHT_ITEMS = [
  { label: 'About',   href: '/about',   icon: Info },
  { label: 'Contact', href: '/contact', icon: Mail },
]

/* ── Design tokens ─────────────────────────────────────────────────────────── */
const GOLD        = 'oklch(0.78 0.065 70)'
const GOLD_DIM    = 'oklch(0.78 0.065 70 / 0.22)'
const GOLD_BORDER = 'oklch(0.78 0.065 70 / 0.40)'
const WHITE_60    = 'oklch(1 0 0 / 0.65)'
const DIVIDER     = 'oklch(1 0 0 / 0.13)'

const PILL_STYLE: React.CSSProperties = {
  background: 'oklch(0.08 0.005 45 / 0.90)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  border: '1px solid oklch(1 0 0 / 0.11)',
  boxShadow:
    '0 10px 36px oklch(0 0 0 / 0.45), 0 2px 8px oklch(0 0 0 / 0.22), inset 0 1px 0 oklch(1 0 0 / 0.09)',
  borderRadius: 9999,
  overflow: 'hidden',
}

/* ── Main component ────────────────────────────────────────────────────────── */
export function MobileAuthMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const reduced = useReducedMotion()

  /*
   * Spring used for the pill morph (layout) and the close-button scale.
   * Kept snappy so there's no perceived lag.
   */
  const morphSpring = reduced
    ? { type: 'tween' as const, duration: 0 }
    : { type: 'spring' as const, stiffness: 500, damping: 40, mass: 0.6 }

  const close  = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((v) => !v), [])

  return (
    <div className="flex justify-center">
      {/*
       * Single persistent pill.
       * `layout` tells Framer to smoothly interpolate its bounding box
       * whenever its children change size — this is the morph.
       */}
      <motion.div layout transition={morphSpring} style={PILL_STYLE}>

        {/*
         * AnimatePresence mode="sync" (default) so the exit animation of
         * the open state and entry animation of the closed pill run at the
         * same time — eliminates the close delay.
         */}
        <AnimatePresence initial={false}>

          {isOpen ? (
            /*
             * ── EXPANDED ────────────────────────────────────────────────
             *
             * Layout: fixed 5-column grid
             *   [left-pair]  [divider]  [close-btn-wrapper]  [divider]  [right-pair]
             *
             * The close-btn-wrapper is a FIXED-SIZE div (never animated for
             * size) so its grid column width never changes — the X button
             * animates entirely within that fixed box.
             */
            <motion.div
              key="open"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.08, ease: 'easeOut' }}
              className="grid items-center"
              style={{
                gridTemplateColumns: '1fr 1px auto 1px 1fr',
                columnGap: 6,
                padding: '8px 10px',
              }}
            >

              {/* Left pair */}
              <div className="flex items-center justify-end gap-0.5">
                {LEFT_ITEMS.map((item, i) => (
                  <NavItem
                    key={item.label}
                    item={item}
                    index={i}
                    origin="left"
                    reduced={!!reduced}
                    onNavigate={close}
                  />
                ))}
              </div>

              {/* Left divider — fixed size, no layout shift */}
              <motion.span
                key="divL"
                initial={{ opacity: 0, scaleY: 0.2 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0.2 }}
                transition={{ duration: reduced ? 0 : 0.12 }}
                style={{ display: 'block', height: 28, width: 1, background: DIVIDER, flexShrink: 0 }}
              />

              {/*
               * Close button wrapper — fixed 32×32 so the grid column
               * NEVER changes width. The button itself animates scale/opacity
               * purely visually inside this container.
               */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <motion.button
                  key="close-btn"
                  onClick={toggle}
                  initial={{ opacity: 0, scale: 0.4, rotate: -90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.4, rotate: 90 }}
                  transition={morphSpring}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.88 }}
                  aria-label="Close navigation menu"
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: GOLD_DIM,
                    border: `1px solid ${GOLD_BORDER}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <X size={12} strokeWidth={2.5} style={{ color: GOLD }} />
                </motion.button>
              </div>

              {/* Right divider */}
              <motion.span
                key="divR"
                initial={{ opacity: 0, scaleY: 0.2 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0.2 }}
                transition={{ duration: reduced ? 0 : 0.12 }}
                style={{ display: 'block', height: 28, width: 1, background: DIVIDER, flexShrink: 0 }}
              />

              {/* Right pair */}
              <div className="flex items-center justify-start gap-0.5">
                {RIGHT_ITEMS.map((item, i) => (
                  <NavItem
                    key={item.label}
                    item={item}
                    index={i + 2}
                    origin="right"
                    reduced={!!reduced}
                    onNavigate={close}
                  />
                ))}
              </div>

            </motion.div>

          ) : (

            /*
             * ── COLLAPSED ───────────────────────────────────────────────
             */
            <motion.button
              key="closed"
              onClick={toggle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.08, ease: 'easeOut' }}
              aria-label="Open navigation menu"
              aria-expanded={false}
              className="flex items-center gap-2 select-none focus:outline-none whitespace-nowrap"
              style={{ padding: '10px 20px' }}
            >
              {/* Pulsing gold dot */}
              <motion.span
                animate={reduced ? {} : { opacity: [0.35, 1, 0.35], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  display: 'block',
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: GOLD,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'oklch(1 0 0 / 0.90)',
                }}
              >
                Menu
              </span>
            </motion.button>

          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

/* ── NavItem ───────────────────────────────────────────────────────────────── */
type NavItemData = { label: string; href: string; icon: React.ElementType }

function NavItem({
  item,
  index,
  origin,
  reduced,
  onNavigate,
}: {
  item: NavItemData
  index: number
  origin: 'left' | 'right'
  reduced: boolean
  onNavigate: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const Icon = item.icon

  /*
   * "Hole" origin effect:
   *   - starts scaled to 0 and offset toward the centre (items emerge from
   *     a single point and spread outward)
   *   - on exit, collapses back to centre with the same motion reversed
   *
   * Stagger is kept very short (20ms per item) so all four appear almost
   * simultaneously — giving a burst feeling rather than a slow sequence.
   */
  const xOffset  = origin === 'left' ? -18 : 18
  const delay    = reduced ? 0 : index * 0.020
  const exitDelay = reduced ? 0 : (3 - index) * 0.015

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3, x: 0 }}
      animate={{ opacity: 1, scale: 1, x: xOffset, transitionEnd: { x: 0 } }}
      exit={{ opacity: 0, scale: 0.3, x: 0 }}
      transition={{
        opacity:  { duration: 0.14, delay, ease: 'easeOut' },
        scale:    { type: 'spring', stiffness: 460, damping: 34, mass: 0.55, delay },
        x:        { type: 'spring', stiffness: 400, damping: 32, mass: 0.55, delay },
      }}
      style={{ originX: origin === 'left' ? 1 : 0, originY: 0.5 }}
    >
      <Link
        href={item.href}
        onClick={onNavigate}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex flex-col items-center justify-center focus:outline-none select-none"
        style={{
          padding: '6px 10px',
          borderRadius: 9999,
          background: hovered ? GOLD_DIM : 'transparent',
          transition: 'background 0.15s ease',
          minWidth: 44,
        }}
      >
        <Icon
          size={18}
          strokeWidth={1.7}
          style={{ color: hovered ? GOLD : WHITE_60, transition: 'color 0.15s ease', flexShrink: 0 }}
        />
        <span
          className="hidden sm:block"
          style={{
            marginTop: 3,
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            lineHeight: 1,
            color: hovered ? GOLD : WHITE_60,
            transition: 'color 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          {item.label}
        </span>
      </Link>
    </motion.div>
  )
}
