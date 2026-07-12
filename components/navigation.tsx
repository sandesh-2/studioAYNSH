'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown, LogOut, User } from 'lucide-react'
import { useSession } from '@/lib/auth-client'
import { signOut } from '@/lib/auth-client'
import { BookNowButton } from '@/components/booking/book-now-button'

const leftNavLinks = [
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Services', href: '/services' },
  { label: 'Journal', href: '/blog' },
]

const rightNavLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const allNavLinks = [...leftNavLinks, ...rightNavLinks]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const userRole = (session?.user as any)?.role || null

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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setDropdownOpen(false)
    router.push('/')
    router.refresh()
  }

  const getPortalLink = () => {
    if (userRole === 'admin') return '/admin'
    return '/portal'
  }

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-background/92 backdrop-blur-md border-b border-border/30'
            : 'bg-transparent'
        }`}
      >
        {/* Desktop Navigation */}
        <div className="hidden lg:flex max-w-7xl mx-auto px-12 h-20 items-center">
          {/* Left nav - flex with flex-1 for mathematical spacing */}
          <nav className="flex items-center gap-12 flex-1" aria-label="Left navigation">
            {leftNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-sans font-medium tracking-[0.15em] uppercase transition-all duration-300 relative group whitespace-nowrap ${
                  pathname === link.href
                    ? 'text-foreground'
                    : 'text-muted-foreground/75 hover:text-foreground'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[1.5px] bg-gradient-to-r from-gold to-champagne transition-all duration-400 ${
                    pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Center logo - true center with flex-center concept */}
          <Link 
            href="/" 
            className="flex flex-col leading-none hover:opacity-75 transition-opacity duration-300 flex-shrink-0 mx-auto"
          >
            <span className="font-serif text-sm font-light tracking-[0.2em] text-foreground/80 uppercase text-center">
              studio
            </span>
            <span className="font-serif text-[1.75rem] font-light tracking-[0.18em] text-foreground -mt-1.5 leading-none text-center">
              AYNSH
            </span>
          </Link>

          {/* Right nav - flex-1 mirroring left for golden ratio */}
          <nav className="flex items-center gap-12 flex-1 justify-end" aria-label="Right navigation">
            {rightNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-sans font-medium tracking-[0.15em] uppercase transition-all duration-300 relative group whitespace-nowrap ${
                  pathname === link.href
                    ? 'text-foreground'
                    : 'text-muted-foreground/75 hover:text-foreground'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[1.5px] bg-gradient-to-r from-gold to-champagne transition-all duration-400 ${
                    pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}

            {/* Auth State: Portal/My Account - Show Portal only before login */}
            {session ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-xs font-sans font-medium tracking-[0.15em] uppercase transition-all duration-300 text-muted-foreground/75 hover:text-foreground whitespace-nowrap"
                >
                  My Account
                  <ChevronDown 
                    size={13} 
                    className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} 
                    strokeWidth={2.5}
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-3 w-44 border border-border/30 bg-background/95 backdrop-blur-sm shadow-lg z-50"
                    >
                      <Link
                        href={getPortalLink()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 w-full px-5 py-3.5 text-xs font-sans font-medium tracking-[0.1em] text-muted-foreground/75 hover:text-foreground hover:bg-secondary/50 transition-all border-b border-border/20"
                      >
                        <User size={14} strokeWidth={1.5} />
                        My Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-5 py-3.5 text-xs font-sans font-medium tracking-[0.1em] text-muted-foreground/75 hover:text-foreground hover:bg-secondary/50 transition-all text-left"
                      >
                        <LogOut size={14} strokeWidth={1.5} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/portal"
                className={`text-xs font-sans font-medium tracking-[0.15em] uppercase transition-all duration-300 relative group whitespace-nowrap ${
                  pathname === '/portal'
                    ? 'text-foreground'
                    : 'text-muted-foreground/75 hover:text-foreground'
                }`}
              >
                Portal
                <span
                  className={`absolute -bottom-1 left-0 h-[1.5px] bg-gradient-to-r from-gold to-champagne transition-all duration-400 ${
                    pathname === '/portal' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            )}
          </nav>
          
          {/* Book Now button - visible on desktop, hidden after login */}
          {!session && (
            <BookNowButton
              className="inline-flex ml-8 items-center justify-center px-6 py-2 text-xs font-sans font-medium tracking-[0.15em] uppercase border border-foreground/60 text-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300 hover:shadow-sm"
              label="Book Now"
            />
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Left: Logo */}
          <Link 
            href="/" 
            className="flex flex-col leading-none hover:opacity-75 transition-opacity duration-300 flex-shrink-0"
          >
            <span className="font-serif text-xs font-light tracking-[0.2em] text-foreground/80 uppercase">
              studio
            </span>
            <span className="font-serif text-sm font-light tracking-[0.18em] text-foreground -mt-0.5 leading-none">
              AYNSH
            </span>
          </Link>

          {/* Right: Icons + Hamburger */}
          <div className="flex items-center gap-3">
            {/* My Account / Portal Icon */}
            {session ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="p-2.5 hover:opacity-70 transition-opacity text-foreground"
                  aria-label="Account menu"
                >
                  <User size={18} strokeWidth={1.5} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-40 border border-border/30 bg-background/95 backdrop-blur-sm shadow-lg z-50"
                    >
                      <Link
                        href={getPortalLink()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 w-full px-4 py-3 text-xs font-sans font-medium text-muted-foreground/75 hover:text-foreground hover:bg-secondary/50 transition-all border-b border-border/20"
                      >
                        <User size={13} strokeWidth={1.5} />
                        Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-3 text-xs font-sans font-medium text-muted-foreground/75 hover:text-foreground hover:bg-secondary/50 transition-all text-left"
                      >
                        <LogOut size={13} strokeWidth={1.5} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/portal"
                className="p-2.5 hover:opacity-70 transition-opacity text-foreground"
                aria-label="Portal login"
              >
                <User size={18} strokeWidth={1.5} />
              </Link>
            )}

            {/* Hamburger menu - elegant icon design */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 hover:opacity-60 transition-opacity ml-1 flex items-center justify-center"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                /* Elegant X icon when open */
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="transition-all duration-300">
                  <path
                    d="M3 3L17 17"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-foreground"
                  />
                  <path
                    d="M17 3L3 17"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-foreground"
                  />
                </svg>
              ) : (
                /* Hamburger menu lines when closed */
                <span className="flex flex-col gap-1.5">
                  <span className="block w-5 h-px bg-foreground transition-all duration-300" />
                  <span className="block w-5 h-px bg-foreground transition-all duration-300" />
                  <span className="block w-5 h-px bg-foreground transition-all duration-300" />
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu - Full screen elegant overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-0 z-40 lg:hidden bg-background/99 backdrop-blur-lg flex flex-col justify-center px-6 pb-32 pt-32"
          >
            <nav className="flex flex-col gap-6" aria-label="Mobile navigation">
              {/* Main navigation links */}
              {allNavLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 + 0.1, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-serif text-3xl sm:text-4xl font-light tracking-widest text-foreground hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Separator before auth/account section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: allNavLinks.length * 0.08 + 0.1, duration: 0.4 }}
                className="pt-8 border-t border-border/20"
              >
                {/* Show Portal only before login */}
                {!session && (
                  <Link
                    href="/portal"
                    onClick={() => setMenuOpen(false)}
                    className="block font-serif text-3xl sm:text-4xl font-light tracking-widest text-foreground hover:text-gold transition-colors duration-300 mb-10"
                  >
                    Portal
                  </Link>
                )}

                {/* Show My Account and Sign Out only after login */}
                {session && (
                  <div className="space-y-6 mb-10">
                    <Link
                      href={getPortalLink()}
                      onClick={() => setMenuOpen(false)}
                      className="block font-serif text-2xl font-light tracking-widest text-foreground hover:text-gold transition-colors duration-300"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut()
                        setMenuOpen(false)
                      }}
                      className="block font-serif text-2xl font-light tracking-widest text-foreground hover:text-gold transition-colors duration-300"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Show Book Now only before login */}
              {!session && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (allNavLinks.length + 1) * 0.08 + 0.1, duration: 0.4 }}
                >
                  <BookNowButton
                    className="inline-flex items-center justify-center px-8 py-3 text-sm font-sans font-medium tracking-[0.15em] uppercase border border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
                    label="Book Now"
                  />
                </motion.div>
              )}
            </nav>

            {/* Footer contact info - positioned below menu with proper spacing */}
            <div className="mt-auto pt-12 border-t border-border/20 flex flex-col items-center justify-center gap-3">
              <p className="text-xs font-sans text-muted-foreground/70 tracking-wider">
                +91 7084019414
              </p>
              <p className="text-xs font-sans text-muted-foreground/70 tracking-wider break-all text-center">
                samratgupta7754@gmail.com
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
