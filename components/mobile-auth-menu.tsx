'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Home, Image, Info, Mail } from 'lucide-react'

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
        staggerChildren: 0.1,
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
    hidden: (direction: 'left' | 'right') => ({
      opacity: 0,
      x: direction === 'left' ? -100 : 100,
      y: 20,
    }),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
    exit: (direction: 'left' | 'right') => ({
      opacity: 0,
      x: direction === 'left' ? -100 : 100,
      y: 20,
    }),
  }

  // Center button rotation and scale
  const buttonVariants = {
    closed: { rotate: 0, scale: 1 },
    open: { rotate: 90, scale: 1.1 },
  }

  return (
    <>
      {/* Center menu button */}
      <motion.div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={buttonVariants}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={toggleMenu}
          className="p-4 rounded-full bg-foreground text-background shadow-2xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} strokeWidth={2} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} strokeWidth={2} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </motion.div>

      {/* Menu overlay background */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Menu items container */}
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
                    custom="left"
                    variants={itemVariants}
                    transition={{ type: 'spring', stiffness: 100, damping: 12 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className="inline-flex items-center gap-3 text-foreground font-sans text-sm font-medium tracking-wide hover:text-foreground/80 transition-colors duration-200"
                    >
                      <div className="p-2 bg-foreground/5 rounded-lg hover:bg-foreground/10 transition-colors">
                        <Icon size={20} strokeWidth={1.5} />
                      </div>
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Right side menu items */}
            <motion.div className="flex flex-col gap-6 pointer-events-auto text-right">
              {menuItems[1].items.map((item) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.label}
                    custom="right"
                    variants={itemVariants}
                    transition={{ type: 'spring', stiffness: 100, damping: 12 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className="inline-flex items-center gap-3 text-foreground font-sans text-sm font-medium tracking-wide hover:text-foreground/80 transition-colors duration-200 flex-row-reverse"
                    >
                      <div className="p-2 bg-foreground/5 rounded-lg hover:bg-foreground/10 transition-colors">
                        <Icon size={20} strokeWidth={1.5} />
                      </div>
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
