'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const leftNavLinks = [
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Services', href: '/services' },
  { label: 'Journal', href: '/blog' },
]

const rightNavLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Portal', href: '/portal' },
]

const allNavLinks = [...leftNavLinks, ...rightNavLinks]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-background/95 backdrop-blur-sm border-b border-border shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          {/* Left nav */}
          <nav className="hidden md:flex items-center gap-10" aria-label="Left navigation">
            {leftNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-sans font-medium tracking-[0.12em] uppercase transition-colors duration-200 relative group ${
                  pathname === link.href
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                } drop-shadow-sm md:drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px bg-accent transition-all duration-300 ${
                    pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Center logo */}
          <Link href="/" className="flex flex-col leading-none group absolute left-1/2 transform -translate-x-1/2">
            <span className="font-serif text-xl font-light tracking-[0.15em] text-foreground uppercase drop-shadow-sm md:drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              studio
            </span>
            <span className="font-serif text-2xl font-semibold tracking-[0.2em] text-foreground uppercase -mt-1 drop-shadow-sm md:drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              AYNSH
            </span>
          </Link>

          {/* Right nav + CTA + hamburger */}
          <div className="flex items-center gap-6 ml-auto">
            <nav className="hidden md:flex items-center gap-10" aria-label="Right navigation">
              {rightNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-sans font-medium tracking-[0.12em] uppercase transition-colors duration-200 relative group ${
                    pathname === link.href
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  } drop-shadow-sm md:drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-accent transition-all duration-300 ${
                      pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              ))}
            </nav>
            <Link
              href="/booking"
              className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-xs font-sans font-medium tracking-[0.15em] uppercase border border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
            >
              Book Now
            </Link>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden flex flex-col gap-1.5 p-2 group"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span
                className={`block w-6 h-px bg-foreground drop-shadow-sm transition-all duration-300 origin-center ${
                  menuOpen ? 'rotate-45 translate-y-[7px]' : ''
                }`}
              />
              <span
                className={`block w-6 h-px bg-foreground drop-shadow-sm transition-all duration-300 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block w-6 h-px bg-foreground drop-shadow-sm transition-all duration-300 origin-center ${
                  menuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-background flex flex-col justify-center px-8"
          >
            <nav className="flex flex-col gap-8" aria-label="Mobile navigation">
              {allNavLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 + 0.1, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    className="font-serif text-4xl font-light tracking-wide text-foreground hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center px-8 py-3 text-sm font-sans font-medium tracking-[0.15em] uppercase border border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-300 mt-4"
                >
                  Book Now
                </Link>
              </motion.div>
            </nav>
            <div className="absolute bottom-12 left-8 right-8 flex items-center justify-between">
              <p className="text-sm font-sans text-muted-foreground tracking-wide">
                +91 7084019414
              </p>
              <p className="text-sm font-sans text-muted-foreground tracking-wide">
                samratgupta7754@gmail.com
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
