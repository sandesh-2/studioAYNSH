'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { useState, useCallback, useRef } from 'react'
import { Home, BookImage, Info, Mail, X } from 'lucide-react'

// ─── Nav items ──────────────────────────────────────────────────────────────

const LEFT_ITEMS = [
  { label: 'Home',      href: '/',          icon: Home },
  { label: 'Portfolio', href: '/portfolio', icon: BookImage },
]

const RIGHT_ITEMS = [
  { label: 'About',   href: '/about',   icon: Info },
  { label: 'Contact', href: '/contact', icon: Mail },
]

// ─── Ripple helper ──────────────────────────────────────────────────────────

function useRipple() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const counter = useRef(0)

  const addRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = ++counter.current
    setRipples((prev) => [...prev, { id, x, y }])
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600)
  }, [])

  return { ripples, addRipple }
}

// ─── Main component ─────────────────────────────────────────────────────────

export function MobileAuthMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { ripples, addRipple } = useRipple()
  const prefersReduced = useReducedMotion()

  const toggle = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      addRipple(e)
      setIsOpen((v) => !v)
    },
    [addRipple],
  )

  const close = useCallback(() => setIsOpen(false), [])

  // Spring config — mirrors Apple's Dynamic Island spring feel
  const spring = prefersReduced
    ? { type: 'tween' as const, duration: 0.01 }
    : { type: 'spring' as const, stiffness: 380, damping: 38, mass: 0.9 }

  const stagger = prefersReduced ? 0 : 0.055

  return (
    <div className="flex justify-center">
      {/* ── The single floating island ─────────────────────────────────────── */}
      <motion.div
        layout
        layoutRoot
        animate={{
          width: isOpen ? 'auto' : 'auto',
        }}
        transition={spring}
        style={{
          /* Black glass pill */
          background: 'oklch(0.08 0.005 45 / 0.82)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderRadius: 9999,
          border: '1px solid oklch(1 0 0 / 0.10)',
          boxShadow:
            '0 8px 32px oklch(0 0 0 / 0.35), 0 2px 8px oklch(0 0 0 / 0.18), inset 0 1px 0 oklch(1 0 0 / 0.08)',
          overflow: 'hidden',
        }}
        className="relative"
      >
        {/* ── Collapsed: Menu pill ──────────────────────────────────────────── */}
        <AnimatePresence mode="wait" initial={false}>
          {!isOpen ? (
            <motion.button
              key="menu-pill"
              onClick={toggle}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ ...spring, duration: prefersReduced ? 0.01 : undefined }}
              className="relative flex items-center gap-2 px-5 py-2.5 overflow-hidden select-none"
              aria-label="Open navigation menu"
              aria-expanded={false}
            >
              {/* Ripple layer */}
              {ripples.map((r) => (
                <span
                  key={r.id}
                  className="pointer-events-none absolute rounded-full bg-white/15 animate-ping"
                  style={{
                    width: 80,
                    height: 80,
                    top: r.y - 40,
                    left: r.x - 40,
                    animationDuration: '0.55s',
                    animationTimingFunction: 'ease-out',
                    animationIterationCount: 1,
                  }}
                />
              ))}

              {/* Pill shimmer dot */}
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: 'oklch(0.78 0.065 70)' }}
              />

              {/* Label */}
              <span
                className="font-sans font-medium tracking-[0.18em] uppercase text-white/90"
                style={{ fontSize: 11, letterSpacing: '0.18em' }}
              >
                Menu
              </span>
            </motion.button>
          ) : (

            /* ── Expanded: Dynamic Island ──────────────────────────────────── */
            <motion.div
              key="island-expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReduced ? 0.01 : 0.18 }}
              className="flex items-center gap-1 px-3 py-2"
            >
              {/* Left items */}
              <div className="flex items-center gap-0.5">
                {LEFT_ITEMS.map((item, i) => (
                  <IslandNavItem
                    key={item.label}
                    item={item}
                    delay={i * stagger}
                    spring={spring}
                    onNavigate={close}
                    origin="left"
                  />
                ))}
              </div>

              {/* Center close button */}
              <motion.button
                onClick={(e) => { addRipple(e); close() }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...spring, delay: stagger * 1.5 }}
                className="relative mx-2 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full overflow-hidden"
                style={{
                  background: 'oklch(0.78 0.065 70 / 0.20)',
                  border: '1px solid oklch(0.78 0.065 70 / 0.35)',
                }}
                aria-label="Close menu"
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
              >
                {ripples.map((r) => (
                  <span
                    key={r.id}
                    className="pointer-events-none absolute rounded-full bg-white/20 animate-ping"
                    style={{ width: 40, height: 40, top: r.y - 20, left: r.x - 20, animationDuration: '0.45s', animationIterationCount: 1 }}
                  />
                ))}
                <X
                  size={13}
                  strokeWidth={2.2}
                  style={{ color: 'oklch(0.78 0.065 70)' }}
                />
              </motion.button>

              {/* Right items */}
              <div className="flex items-center gap-0.5">
                {RIGHT_ITEMS.map((item, i) => (
                  <IslandNavItem
                    key={item.label}
                    item={item}
                    delay={(i + 2) * stagger}
                    spring={spring}
                    onNavigate={close}
                    origin="right"
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

// ─── Individual nav item inside the island ───────────────────────────────────

type NavItem = { label: string; href: string; icon: React.ElementType }

function IslandNavItem({
  item,
  delay,
  spring,
  onNavigate,
  origin,
}: {
  item: NavItem
  delay: number
  spring: object
  onNavigate: () => void
  origin: 'left' | 'right'
}) {
  const [hovered, setHovered] = useState(false)
  const Icon = item.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: origin === 'left' ? -18 : 18, scale: 0.85 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: origin === 'left' ? -12 : 12, scale: 0.85 }}
      transition={{ ...spring, delay }}
    >
      <Link
        href={item.href}
        onClick={onNavigate}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex flex-col items-center gap-1 px-3.5 py-2 rounded-full select-none outline-none"
        style={{
          background: hovered ? 'oklch(0.78 0.065 70 / 0.15)' : 'transparent',
          transition: 'background 0.18s ease',
        }}
      >
        {/* Active indicator glow */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: 'inset 0 0 12px oklch(0.78 0.065 70 / 0.12)',
            border: '1px solid oklch(0.78 0.065 70 / 0.22)',
          }}
        />

        <Icon
          size={14}
          strokeWidth={1.8}
          style={{
            color: hovered
              ? 'oklch(0.85 0.055 70)'
              : 'oklch(1 0 0 / 0.65)',
            transition: 'color 0.18s ease',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 9.5,
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: hovered
              ? 'oklch(0.85 0.055 70)'
              : 'oklch(1 0 0 / 0.65)',
            transition: 'color 0.18s ease',
            lineHeight: 1,
          }}
        >
          {item.label}
        </span>
      </Link>
    </motion.div>
  )
}
