'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { useState, useCallback } from 'react'
import { Home, BookImage, Info, Mail, X } from 'lucide-react'

/* ─── nav data ─────────────────────────────────────────────────────────────── */
const LEFT_ITEMS = [
  { label: 'Home',      href: '/',          Icon: Home },
  { label: 'Portfolio', href: '/portfolio', Icon: BookImage },
]
const RIGHT_ITEMS = [
  { label: 'About',   href: '/about',   Icon: Info },
  { label: 'Contact', href: '/contact', Icon: Mail },
]

/* ─── tokens ───────────────────────────────────────────────────────────────── */
const GOLD        = 'oklch(0.78 0.065 70)'
const GOLD_DIM    = 'oklch(0.78 0.065 70 / 0.20)'
const GOLD_BORDER = 'oklch(0.78 0.065 70 / 0.45)'
const WHITE_70    = 'oklch(1 0 0 / 0.72)'
const DIVIDER     = 'oklch(1 0 0 / 0.12)'

const pillBase: React.CSSProperties = {
  background: 'oklch(0.08 0.005 45 / 0.92)',
  backdropFilter: 'blur(28px) saturate(180%)',
  WebkitBackdropFilter: 'blur(28px) saturate(180%)',
  border: '1px solid oklch(1 0 0 / 0.11)',
  boxShadow:
    '0 12px 40px oklch(0 0 0 / 0.50), 0 2px 8px oklch(0 0 0 / 0.22), inset 0 1px 0 oklch(1 0 0 / 0.08)',
  borderRadius: 9999,
  overflow: 'hidden',
}

/* ─── spring configs ───────────────────────────────────────────────────────── */
// Pill morph — snappy, no wobble
const MORPH_SPRING = { type: 'spring' as const, stiffness: 520, damping: 42, mass: 0.5 }
// Item emerge — slightly softer for the organic feel
const ITEM_SPRING  = { type: 'spring' as const, stiffness: 460, damping: 36, mass: 0.5 }
// Item exit — tween so it vanishes immediately (no spring overshoot on close)
const ITEM_EXIT    = { type: 'tween' as const, duration: 0.10, ease: 'easeIn' }

/* ─── component ────────────────────────────────────────────────────────────── */
export function MobileAuthMenu() {
  const [isOpen, setIsOpen]   = useState(false)
  const reduced               = useReducedMotion()

  // Use useCallback to guarantee stable references — no extra renders
  const open  = useCallback(() => setIsOpen(true),  [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <div className="flex justify-center">
      {/*
        Single persistent pill — `layout` smoothly morphs its bounding box.
        The pill itself never unmounts; only its contents swap.
      */}
      <motion.div
        layout
        transition={reduced ? { duration: 0 } : MORPH_SPRING}
        style={pillBase}
      >
        <AnimatePresence initial={false} mode="popLayout">

          {/* ── COLLAPSED ───────────────────────────────────────────────── */}
          {!isOpen && (
            <motion.button
              key="menu-pill"
              onClick={open}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.07, ease: 'easeOut' }}
              aria-label="Open navigation menu"
              aria-expanded={false}
              className="flex items-center gap-2.5 select-none focus:outline-none whitespace-nowrap"
              style={{ padding: '11px 22px' }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: '0.20em',
                  textTransform: 'uppercase',
                  color: 'oklch(1 0 0 / 0.88)',
                }}
              >
                Menu
              </span>
            </motion.button>
          )}

          {/* ── EXPANDED ────────────────────────────────────────────────── */}
          {isOpen && (
            <motion.div
              key="nav-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.07, ease: 'easeOut' }}
              /*
                5-col grid:  [left pair] [divider] [close wrapper] [divider] [right pair]
                All columns are sized by their FIXED content — no 1fr that can
                cause reflow. The close column is always exactly 40px.
              */
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1px 40px 1px auto',
                alignItems: 'center',
                columnGap: 4,
                padding: '7px 8px',
              }}
            >
              {/* left pair */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {LEFT_ITEMS.map((item, i) => (
                  <NavItem
                    key={item.label}
                    item={item}
                    index={i}
                    side="left"
                    reduced={!!reduced}
                    onNavigate={close}
                  />
                ))}
              </div>

              {/* left rule */}
              <Divider reduced={!!reduced} delay={0.04} />

              {/*
                Close button wrapper — fixed 40×40px box, NEVER animated for
                size. The X animates purely visually (scale/rotate/opacity) inside
                this container so its grid column width is always exactly 40px.
              */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <motion.button
                  onClick={close}
                  initial={{ opacity: 0, scale: 0.35, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.35, rotate: 45 }}
                  transition={reduced ? { duration: 0 } : { ...MORPH_SPRING, delay: 0.06 }}
                  whileHover={{ scale: 1.10 }}
                  whileTap={{ scale: 0.88 }}
                  aria-label="Close navigation menu"
                  style={{
                    width: 30,
                    height: 30,
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
                  <X size={14} strokeWidth={2.2} style={{ color: GOLD, display: 'block' }} />
                </motion.button>
              </div>

              {/* right rule */}
              <Divider reduced={!!reduced} delay={0.04} />

              {/* right pair */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {RIGHT_ITEMS.map((item, i) => (
                  <NavItem
                    key={item.label}
                    item={item}
                    index={i + 2}
                    side="right"
                    reduced={!!reduced}
                    onNavigate={close}
                  />
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  )
}

/* ─── Divider ──────────────────────────────────────────────────────────────── */
function Divider({ reduced, delay }: { reduced: boolean; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0 }}
      transition={reduced ? { duration: 0 } : { type: 'tween', duration: 0.14, delay, ease: 'easeOut' }}
      style={{
        display: 'block',
        width: 1,
        height: 30,
        background: DIVIDER,
        flexShrink: 0,
        transformOrigin: 'center',
      }}
    />
  )
}

/* ─── NavItem ──────────────────────────────────────────────────────────────── */
interface NavItemProps {
  item: { label: string; href: string; Icon: React.ElementType }
  index: number
  side: 'left' | 'right'
  reduced: boolean
  onNavigate: () => void
}

function NavItem({ item, index, side, reduced, onNavigate }: NavItemProps) {
  const [hovered, setHovered] = useState(false)
  const { Icon, label, href } = item

  /*
    "Emerge from hole" effect:
      • All items start at scale 0 from the centre (x: 0)
      • They animate to their natural position — NO transitionEnd hack,
        no layout-affecting x offset. The spread is purely achieved by
        the flex gap between items, so nothing causes reflow.
      • Exit uses a fast tween (not a spring) so items vanish immediately
        on close — no spring overshoot delays.

    Stagger: 18ms — barely perceptible, gives a burst feel not a sequence.
  */
  const openDelay  = reduced ? 0 : index * 0.018
  const closeDelay = reduced ? 0 : (3 - index) * 0.012

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.2 }}
      animate={reduced
        ? { opacity: 1, scale: 1 }
        : {
            opacity: 1,
            scale: 1,
            transition: {
              opacity: { duration: 0.12, delay: openDelay, ease: 'easeOut' },
              scale:   { ...ITEM_SPRING, delay: openDelay },
            } as any,
          }
      }
      exit={{ opacity: 0, scale: 0.2 }}
      transition={reduced
        ? { duration: 0 }
        : { type: 'tween', duration: 0.10, delay: closeDelay, ease: 'easeIn' }
      }
      style={{ transformOrigin: 'center' }}
    >
      <Link
        href={href}
        onClick={onNavigate}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={label}
        className="flex flex-col items-center justify-center focus:outline-none select-none"
        style={{
          padding: '7px 11px',
          borderRadius: 9999,
          background: hovered ? GOLD_DIM : 'transparent',
          transition: 'background 0.15s ease',
          minWidth: 48,
          gap: 3,
        }}
      >
        <Icon
          size={22}
          strokeWidth={1.6}
          style={{
            color: hovered ? GOLD : WHITE_70,
            transition: 'color 0.15s ease',
            display: 'block',
            flexShrink: 0,
          }}
        />
        {/* Labels: hidden on mobile (icons only), visible sm+ */}
        <span
          className="hidden sm:block"
          style={{
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            lineHeight: 1,
            color: hovered ? GOLD : WHITE_70,
            transition: 'color 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      </Link>
    </motion.div>
  )
}
