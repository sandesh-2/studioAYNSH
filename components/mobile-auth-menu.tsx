'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { Home, Image, Info, Mail } from 'lucide-react'

export function MobileAuthMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    {
      side: 'left',
      items: [
        { label: 'Home', icon: Home, href: '/' },
        { label: 'Portfolio', icon: Image, href: '/portfolio' },
      ],
    },
    {
      side: 'right',
      items: [
        { label: 'About', icon: Info, href: '/about' },
        { label: 'Contact', icon: Mail, href: '/contact' },
      ],
    },
  ]

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  // Container animation when menu opens/closes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  }

  // Individual menu item slide animation
  const itemVariants = {
    hiddenLeft: {
      opacity: 0,
      x: -60,
      y: 20,
    },
    hiddenRight: {
      opacity: 0,
      x: 60,
      y: 20,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
    exitLeft: {
      opacity: 0,
      x: -60,
      y: 20,
    },
    exitRight: {
      opacity: 0,
      x: 60,
      y: 20,
    },
  }

  return (
    <>
      {/* Backdrop overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMenu}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Menu items container — splits left and right */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-between px-8 pointer-events-none"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Left side menu items */}
            <motion.div className="flex flex-col gap-6 pointer-events-auto">
              {menuItems[0].items.map((item) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.label}
                    initial="hiddenLeft"
                    animate="visible"
                    exit="exitLeft"
                    variants={itemVariants}
                    transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className="group inline-flex items-center gap-4 px-6 py-3 bg-card border border-border rounded-lg hover:border-accent hover:bg-accent/5 transition-all duration-300"
                    >
                      <Icon className="w-5 h-5 text-accent group-hover:text-foreground transition-colors" />
                      <span className="font-sans text-sm font-medium text-foreground tracking-wide">{item.label}</span>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Right side menu items */}
            <motion.div className="flex flex-col gap-6 pointer-events-auto">
              {menuItems[1].items.map((item) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.label}
                    initial="hiddenRight"
                    animate="visible"
                    exit="exitRight"
                    variants={itemVariants}
                    transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className="group inline-flex items-center gap-4 px-6 py-3 bg-card border border-border rounded-lg hover:border-accent hover:bg-accent/5 transition-all duration-300"
                    >
                      <Icon className="w-5 h-5 text-accent group-hover:text-foreground transition-colors" />
                      <span className="font-sans text-sm font-medium text-foreground tracking-wide">{item.label}</span>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Menu Button — returns element to be placed in header */}
      <div className="inline-block mb-8">
        <motion.button
          onClick={toggleMenu}
          className="relative px-6 py-3 font-sans font-semibold text-xs tracking-widest uppercase text-foreground"
          style={{
            background: 'linear-gradient(to bottom, var(--accent), var(--gold))',
            borderRadius: '6px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
          whileHover={{
            y: -3,
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          }}
          whileTap={{
            y: -1,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {/* Top 3D shine effect */}
          <div
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"
            style={{ borderRadius: '6px 6px 0 0' }}
          />

          {/* Button text with icon rotation */}
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {isOpen ? (
              <span className="text-lg">✕</span>
            ) : (
              <span>Menu</span>
            )}
          </motion.div>

          {/* Bottom 3D shadow effect */}
          <div className="absolute -bottom-2 left-2 right-2 h-1 bg-black/15 blur-md pointer-events-none" style={{ borderRadius: '50%' }} />
        </motion.button>
      </div>
    </>
  )
}
