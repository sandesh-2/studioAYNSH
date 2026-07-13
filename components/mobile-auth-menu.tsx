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

const PILL_BASE: React.CSSProperties = {
  background: 'oklch(0.08 0.005 45 / 0.88)',
  backdropFilter: 'blur(20px) saturate(160%)',
  WebkitBackdropFilter: 'blur(20px) saturate(160%)',
  border: '1px solid oklch(1 0 0 / 0.10)',
  boxShadow:
    '0 8px 28px oklch(0 0 0 / 0.40), 0 2px 6px oklch(0 0 0 / 0.20), inset 0 1px 0 oklch(1 0 0 / 0.08)',
  borderRadius: 9999,
}

const GOLD        = 'oklch(0.78 0.065 70)'
const GOLD_DIM    = 'oklch(0.78 0.065 70 / 0.18)'
const GOLD_BORDER = 'oklch(0.78 0.065 70 / 0.32)'
const WHITE_DIM   = 'oklch(1 0 0 / 0.60)'
const DIVIDER     = 'oklch(1 0 0 / 0.12)'

export function MobileAuthMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const reduced = useReducedMotion()

  const spring = reduced
    ? { type: 'tween' as const, duration: 0.01 }
    : { type: 'spring' as const, stiffness: 420, damping: 38, mass: 0.7 }

  const close  = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((v) => !v), [])

  return (
    <div className="flex justify-center">
      {/*
        Single persistent pill — layout prop lets Framer interpolate
        the bounding box without remounting. overflow:hidden clips during morph.
      */}
      <motion.div
        layout
        transition={spring}
        style={{ ...PILL_BASE, overflow: 'hidden' }}
      >
        <AnimatePresence mode="wait" initial={false}>

          {/* ── Collapsed pill ────────────────────────────────────── */}
          {!isOpen && (
            <motion.button
              key="closed"
              onClick={toggle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0.01 : 0.10, ease: 'easeOut' }}
              className="flex items-center gap-2 px-5 py-2.5 select-none focus:outline-none whitespace-nowrap"
              aria-label="Open navigation menu"
              aria-expanded={false}
            >
              <motion.span
                animate={reduced ? {} : { opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="block w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: GOLD }}
              />
              <span
                className="font-sans font-medium uppercase tracking-widest text-white/90"
                style={{ fontSize: 11 }}
              >
                Menu
              </span>
            </motion.button>
          )}

          {/* ── Expanded island ───────────────────────────────────── */}
          {isOpen && (
            <motion.div
              key="open"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0.01 : 0.12, ease: 'easeOut' }}
              /*
                Grid layout: 2 left items | close btn | 2 right items
                The close button occupies a fixed-width column in the exact
                centre — it never shifts regardless of item animation state.
                items-center vertically aligns all columns.
              */
              className="grid items-center px-2 py-1.5"
              style={{ gridTemplateColumns: '1fr auto auto auto 1fr', gap: 0 }}
            >

              {/* Left pair */}
              <div className="flex items-center justify-end">
                {LEFT_ITEMS.map((item, i) => (
                  <NavItem
                    key={item.label}
                    item={item}
                    delay={reduced ? 0 : i * 0.025}
                    spring={spring}
                    origin="left"
                    onNavigate={close}
                  />
                ))}
              </div>

              {/* Left divider */}
              <motion.span
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ ...spring, delay: reduced ? 0 : 0.04 }}
                className="block h-5 w-px mx-1 flex-shrink-0"
                style={{ background: DIVIDER }}
              />

              {/*
                Close button — fixed size, absolutely centred in the grid.
                Does NOT animate position — only opacity+scale from its own
                keyframes, so it cannot shift other columns.
              */}
              <motion.button
                onClick={toggle}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ ...spring, delay: reduced ? 0 : 0.03 }}
                className="flex items-center justify-center rounded-full focus:outline-none flex-shrink-0"
                style={{
                  width: 24,
                  height: 24,
                  background: GOLD_DIM,
                  border: `1px solid ${GOLD_BORDER}`,
                }}
                whileHover={{ scale: 1.15, background: 'oklch(0.78 0.065 70 / 0.28)' } as any}
                whileTap={{ scale: 0.88 }}
                aria-label="Close menu"
              >
                <X size={11} strokeWidth={2.4} style={{ color: GOLD }} />
              </motion.button>

              {/* Right divider */}
              <motion.span
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ ...spring, delay: reduced ? 0 : 0.04 }}
                className="block h-5 w-px mx-1 flex-shrink-0"
                style={{ background: DIVIDER }}
              />

              {/* Right pair */}
              <div className="flex items-center justify-start">
                {RIGHT_ITEMS.map((item, i) => (
                  <NavItem
                    key={item.label}
                    item={item}
                    delay={reduced ? 0 : (i + 2) * 0.025}
                    spring={spring}
                    origin="right"
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

// ── Individual nav item ────────────────────────────────────────────────────────

type NavItemData = { label: string; href: string; icon: React.ElementType }

function NavItem({
  item,
  delay,
  spring,
  origin,
  onNavigate,
}: {
  item: NavItemData
  delay: number
  spring: object
  origin: 'left' | 'right'
  onNavigate: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const Icon = item.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: origin === 'left' ? -12 : 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: origin === 'left' ? -8 : 8 }}
      transition={{ ...spring, delay }}
    >
      <Link
        href={item.href}
        onClick={onNavigate}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex flex-col items-center justify-center gap-0.5 rounded-full select-none focus:outline-none"
        style={{
          padding: '6px 10px',
          background: hovered ? GOLD_DIM : 'transparent',
          transition: 'background 0.15s ease',
        }}
      >
        <Icon
          size={14}
          strokeWidth={1.8}
          style={{
            color: hovered ? GOLD : WHITE_DIM,
            transition: 'color 0.15s ease',
            flexShrink: 0,
          }}
        />
        {/*
          Label: hidden on small screens (< sm = 640px), visible on sm+.
          This prevents overflow clipping the last item on narrow phones.
        */}
        <span
          className="hidden sm:block"
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
