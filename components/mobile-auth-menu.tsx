'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { useState, useCallback } from 'react'
import { Home, BookImage, Info, Mail, X } from 'lucide-react'

const LEFT_ITEMS = [
  { label: 'Home',      href: '/',          icon: Home },
  { label: 'Portfolio', href: '/portfolio', icon: BookImage },
]

const RIGHT_ITEMS = [
  { label: 'About',   href: '/about',   icon: Info },
  { label: 'Contact', href: '/contact', icon: Mail },
]

// Shared pill styles — reused in both states
const PILL_BASE: React.CSSProperties = {
  background: 'oklch(0.08 0.005 45 / 0.88)',
  backdropFilter: 'blur(20px) saturate(160%)',
  WebkitBackdropFilter: 'blur(20px) saturate(160%)',
  border: '1px solid oklch(1 0 0 / 0.10)',
  boxShadow:
    '0 8px 28px oklch(0 0 0 / 0.40), 0 2px 6px oklch(0 0 0 / 0.20), inset 0 1px 0 oklch(1 0 0 / 0.08)',
  borderRadius: 9999,
}

const GOLD = 'oklch(0.78 0.065 70)'
const GOLD_DIM = 'oklch(0.78 0.065 70 / 0.18)'
const GOLD_BORDER = 'oklch(0.78 0.065 70 / 0.32)'
const WHITE_DIM = 'oklch(1 0 0 / 0.60)'

export function MobileAuthMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const reduced = useReducedMotion()

  // Tight spring — fast enough to feel instant, slow enough to read
  const spring = reduced
    ? { type: 'tween' as const, duration: 0.01 }
    : { type: 'spring' as const, stiffness: 500, damping: 42, mass: 0.8 }

  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((v) => !v), [])

  return (
    <div className="flex justify-center">
      {/*
        Single persistent pill — `layout` lets framer smoothly interpolate
        its bounding box between the two inner size variants without
        remounting anything. `overflow:hidden` clips content during morph.
      */}
      <motion.div
        layout
        transition={spring}
        style={{ ...PILL_BASE, overflow: 'hidden' }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {!isOpen ? (
            /* ─── Collapsed pill ──────────────────────────────────────── */
            <motion.button
              key="closed"
              layout
              onClick={toggle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0.01 : 0.12, ease: 'easeOut' }}
              className="flex items-center gap-2 px-5 py-2.5 select-none focus:outline-none"
              aria-label="Open navigation menu"
              aria-expanded={false}
            >
              {/* Pulsing gold dot */}
              <motion.span
                animate={reduced ? {} : { opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="block w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: GOLD }}
              />
              <span
                className="font-sans font-medium uppercase tracking-widest text-white/90 whitespace-nowrap"
                style={{ fontSize: 11 }}
              >
                Menu
              </span>
            </motion.button>

          ) : (

            /* ─── Expanded island ─────────────────────────────────────── */
            <motion.div
              key="open"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0.01 : 0.14, ease: 'easeOut' }}
              className="flex items-center px-2 py-1.5"
            >
              {/* Left items */}
              {LEFT_ITEMS.map((item, i) => (
                <NavItem
                  key={item.label}
                  item={item}
                  delay={reduced ? 0 : i * 0.03}
                  spring={spring}
                  origin="left"
                  onNavigate={close}
                />
              ))}

              {/* Divider */}
              <motion.span
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ ...spring, delay: reduced ? 0 : 0.06 }}
                className="mx-1 block h-5 w-px flex-shrink-0"
                style={{ background: 'oklch(1 0 0 / 0.12)' }}
              />

              {/* Close button */}
              <motion.button
                onClick={toggle}
                initial={{ opacity: 0, scale: 0.6, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ ...spring, delay: reduced ? 0 : 0.04 }}
                className="mx-1.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full focus:outline-none"
                style={{ background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}` }}
                whileHover={{ scale: 1.15, background: 'oklch(0.78 0.065 70 / 0.28)' } as any}
                whileTap={{ scale: 0.88 }}
                aria-label="Close menu"
              >
                <X size={11} strokeWidth={2.4} style={{ color: GOLD }} />
              </motion.button>

              {/* Divider */}
              <motion.span
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ ...spring, delay: reduced ? 0 : 0.06 }}
                className="mx-1 block h-5 w-px flex-shrink-0"
                style={{ background: 'oklch(1 0 0 / 0.12)' }}
              />

              {/* Right items */}
              {RIGHT_ITEMS.map((item, i) => (
                <NavItem
                  key={item.label}
                  item={item}
                  delay={reduced ? 0 : (i + 2) * 0.03}
                  spring={spring}
                  origin="right"
                  onNavigate={close}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// ─── Individual nav item ──────────────────────────────────────────────────────

type NavItem = { label: string; href: string; icon: React.ElementType }

function NavItem({
  item,
  delay,
  spring,
  origin,
  onNavigate,
}: {
  item: NavItem
  delay: number
  spring: object
  origin: 'left' | 'right'
  onNavigate: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const Icon = item.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: origin === 'left' ? -14 : 14 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: origin === 'left' ? -8 : 8 }}
      transition={{ ...spring, delay }}
    >
      <Link
        href={item.href}
        onClick={onNavigate}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-full select-none focus:outline-none"
        style={{
          minWidth: 52,
          background: hovered ? GOLD_DIM : 'transparent',
          transition: 'background 0.15s ease',
        }}
      >
        <Icon
          size={13}
          strokeWidth={1.9}
          style={{
            color: hovered ? GOLD : WHITE_DIM,
            transition: 'color 0.15s ease',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 8.5,
            fontWeight: 500,
            letterSpacing: '0.13em',
            textTransform: 'uppercase',
            lineHeight: 1,
            color: hovered ? GOLD : WHITE_DIM,
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
