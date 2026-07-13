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
    hoverColor: '#E1306C',
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
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    href: 'https://wa.me/917084019414',
    external: true,
    hoverColor: '#25D366',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        fill="currentColor"
        className="w-4 h-4 flex-shrink-0"
        aria-hidden="true"
      >
        <path d="M476.9 161.1C435 119.1 379.2 96 319.9 96C197.5 96 97.9 195.6 97.9 318C97.9 357.1 108.1 395.3 127.5 429L96 544L213.7 513.1C246.1 530.8 282.6 540.1 319.8 540.1L319.9 540.1C442.2 540.1 544 440.5 544 318.1C544 258.8 518.8 203.1 476.9 161.1zM319.9 502.7C286.7 502.7 254.2 493.8 225.9 477L219.2 473L149.4 491.3L168 423.2L163.6 416.2C145.1 386.8 135.4 352.9 135.4 318C135.4 216.3 218.2 133.5 320 133.5C369.3 133.5 415.6 152.7 450.4 187.6C485.2 222.5 506.6 268.8 506.5 318.1C506.5 419.9 421.6 502.7 319.9 502.7zM421.1 364.5C415.6 361.7 388.3 348.3 383.2 346.5C378.1 344.6 374.4 343.7 370.7 349.3C367 354.9 356.4 367.3 353.1 371.1C349.9 374.8 346.6 375.3 341.1 372.5C308.5 356.2 287.1 343.4 265.6 306.5C259.9 296.7 271.3 297.4 281.9 276.2C283.7 272.5 282.8 269.3 281.4 266.5C280 263.7 268.9 236.4 264.3 225.3C259.8 214.5 255.2 216 251.8 215.8C248.6 215.6 244.9 215.6 241.2 215.6C237.5 215.6 231.5 217 226.4 222.5C221.3 228.1 207 241.5 207 268.8C207 296.1 226.9 322.5 229.6 326.2C232.4 329.9 268.7 385.9 324.4 410C359.6 425.2 373.4 426.5 391 423.9C401.7 422.3 423.8 410.5 428.4 397.5C433 384.5 433 373.4 431.6 371.1C430.3 368.6 426.6 367.2 421.1 364.5z" />
      </svg>
    ),
  },
  {
    key: 'phone',
    label: '+91 7084019414',
    href: 'tel:+917084019414',
    external: false,
    hoverColor: '#4A90E2',
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
    hoverColor: '#EA4335',
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
        <rect x="2" y="4" width="20" height="16" rx="2" />
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
                    className="group inline-flex items-center gap-2.5 font-sans text-sm text-background/50 transition-all duration-300"
                    style={{
                      background: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      const container = e.currentTarget as HTMLAnchorElement
                      container.style.color = item.hoverColor
                    }}
                    onMouseLeave={(e) => {
                      const container = e.currentTarget as HTMLAnchorElement
                      container.style.color = 'inherit'
                    }}
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
