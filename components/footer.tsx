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
    { label: 'Instagram', href: 'https://instagram.com/studioaynsh', external: true },
  ],
}

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
            <div className="space-y-2">
              <p className="font-sans text-sm text-background/50">
                <a
                  href="mailto:samratgupta7754@gmail.com"
                  className="hover:text-background transition-colors duration-200"
                >
                  samratgupta7754@gmail.com
                </a>
              </p>
              <p className="font-sans text-sm text-background/50">
                <a
                  href="tel:+917084019414"
                  className="hover:text-background transition-colors duration-200"
                >
                  +91 7084019414
                </a>
              </p>
            </div>
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
                      target={'external' in link && link.external ? '_blank' : undefined}
                      rel={'external' in link && link.external ? 'noopener noreferrer' : undefined}
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
