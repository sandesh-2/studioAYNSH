'use client'

import Link from 'next/link'

const footerLinks = {
  Work: [
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Services', href: '/services' },
    { label: 'Client Portal', href: '/portal' },
  ],
  Studio: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Testimonials', href: '/#testimonials' },
  ],
  Connect: [
    { label: 'Book a Session', href: '/booking' },
    { label: 'Contact', href: '/contact' },
  ],
}

// ── Social contact items ──────────────────────────────────────────────────

const socialLinks = [
  {
    key: 'instagram',
    label: '@studioaynsh',
    href: 'https://instagram.com/studioaynsh',
    external: true,
    // On hover: Instagram gradient — magenta to orange
    hoverClass: 'hover:text-[#E1306C]',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 flex-shrink-0"
        aria-hidden="true"
      >
        {/* Square body */}
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        {/* Circle (lens) */}
        <circle cx="12" cy="12" r="4" />
        {/* Flash dot */}
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: 'whatsapp',
    label: '+91 7084019414',
    href: 'https://wa.me/917084019414',
    external: true,
    // On hover: yellowish-orange
    hoverClass: 'hover:text-[#FFA500]',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 flex-shrink-0"
        aria-hidden="true"
      >
        {/* Speech bubble outline */}
        <path d="M21 12a9 9 0 0 1-9 9 9.5 9.5 0 0 1-4-1L3 21l2-6a9 9 0 0 1 16-3z" />
        {/* Phone icon inside bubble */}
        <path d="M10 10h4a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2z" fill="currentColor" opacity="0.3" />
        <path d="M11 11c-.3-.5-.5-1.1-.5-1.7V8" />
        <path d="M13 11c.3-.5.5-1.1.5-1.7V8" />
      </svg>
    ),
  },
  {
    key: 'phone',
    label: '+91 7084019414',
    href: 'tel:+917084019414',
    external: false,
    // On hover: yellowish-orange
    hoverClass: 'hover:text-[#FFA500]',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 flex-shrink-0"
        aria-hidden="true"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 5.9 5.9l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.71 2.01z" />
      </svg>
    ),
  },
  {
    key: 'email',
    label: 'samratgupta7754@gmail.com',
    href: 'mailto:samratgupta7754@gmail.com',
    external: false,
    // On hover: Gmail red
    hoverClass: 'hover:text-[#EA4335]',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 flex-shrink-0"
        aria-hidden="true"
      >
        {/* Envelope body */}
        <rect x="2" y="4" width="20" height="16" rx="2" />
        {/* Chevron / fold line */}
        <polyline points="2,4 12,13 22,4" />
      </svg>
    ),
  },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-10">
        {/* Top: Brand + Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16 mb-20">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex flex-col leading-none mb-6">
              <span className="font-serif text-lg font-light tracking-[0.15em] text-background/70 uppercase">
                studio
              </span>
              <span className="font-serif text-3xl font-semibold tracking-[0.2em] text-background uppercase -mt-1">
                AYNSH
              </span>
            </Link>
            <p className="font-sans text-sm text-background/50 leading-relaxed max-w-xs mb-8">
              We Capture The Untold Story. Premium photography and cinematography studio
              based in Gorakhpur, Uttar Pradesh.
            </p>

            {/* Social / contact icons */}
            <ul className="space-y-3">
              {socialLinks.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className={`group inline-flex items-center gap-2.5 font-sans text-sm text-background/50 transition-colors duration-200 ${item.hoverClass}`}
                    aria-label={item.label}
                  >
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-sans text-xs font-medium tracking-[0.2em] uppercase text-background/40 mb-6">
                {section}
              </h3>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-background/60 hover:text-background transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-background/10 mb-8" />

        {/* Bottom: address + copyright */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="font-sans text-xs text-background/30 tracking-wide">
            Bhagat Chauraha, Rampur Road, Taramandal, Gorakhpur — 273016, Uttar Pradesh, India
          </p>
          <p className="font-sans text-xs text-background/30 tracking-wide">
            &copy; {new Date().getFullYear()} Studio AYNSH. All rights reserved.
          </p>
        </div>

        {/* Large brand mark */}
        <div className="mt-12 overflow-hidden">
          <p
            className="font-serif font-semibold text-background/5 select-none pointer-events-none"
            style={{ fontSize: 'clamp(4rem, 18vw, 14rem)', lineHeight: 1, letterSpacing: '0.05em' }}
            aria-hidden="true"
          >
            AYNSH
          </p>
        </div>
      </div>
    </footer>
  )
}
