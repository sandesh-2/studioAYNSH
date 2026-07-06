'use client'

import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    quote:
      'Studio AYNSH transformed our wedding into a timeless film. Every photograph is a piece of art we will treasure forever. Praveen has an extraordinary gift for capturing emotion.',
    author: 'Priya & Rohan Sharma',
    detail: 'Wedding — Gorakhpur, 2024',
  },
  {
    quote:
      'The pre-wedding shoot was beyond anything we imagined. The team made us feel completely at ease while creating images of breathtaking beauty. Pure magic.',
    author: 'Ananya & Karan Verma',
    detail: 'Pre-Wedding — Lucknow, 2024',
  },
  {
    quote:
      'Our brand campaign needed editorial excellence. Studio AYNSH delivered exactly that — visuals that positioned our label as truly premium. The results were remarkable.',
    author: 'Meera Agarwal',
    detail: 'Fashion Campaign — Delhi, 2023',
  },
]

export function TestimonialsSection() {
  const [active, setActive] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-advance carousel on mobile
  useEffect(() => {
    if (!isMobile) return
    const timer = setTimeout(() => {
      setActive((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearTimeout(timer)
  }, [active, isMobile])

  const handlePrev = () => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  const handleNext = () => setActive((prev) => (prev + 1) % testimonials.length)

  return (
    <section
      ref={ref}
      id="testimonials"
      className="py-24 lg:py-36 bg-secondary overflow-hidden"
      aria-label="Client testimonials"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className="font-sans text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Client Stories
          </p>
          <h2
            className="font-serif font-light text-foreground leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
          >
            Words of <em>Gratitude</em>
          </h2>
        </motion.div>

        {/* Mobile Carousel */}
        {isMobile && (
          <div className="flex flex-col gap-8 lg:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <p
                  className="font-serif font-light text-foreground leading-relaxed mb-6"
                  style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)' }}
                >
                  &ldquo;{testimonials[active].quote}&rdquo;
                </p>
                <div className="mb-8">
                  <p className="font-serif font-medium text-foreground text-lg">
                    {testimonials[active].author}
                  </p>
                  <p className="font-sans text-xs text-muted-foreground tracking-[0.15em] uppercase mt-1">
                    {testimonials[active].detail}
                  </p>
                </div>

                {/* Mobile carousel controls */}
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={handlePrev}
                    className="p-2 border border-border hover:bg-background transition-all duration-200"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-5 h-5 text-foreground" />
                  </button>

                  {/* Dot indicators */}
                  <div className="flex items-center justify-center gap-2">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`h-2 transition-all duration-300 ${
                          i === active
                            ? 'w-8 bg-accent'
                            : 'w-2 bg-border hover:bg-muted-foreground'
                        }`}
                        aria-label={`Go to testimonial ${i + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    className="p-2 border border-border hover:bg-background transition-all duration-200"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-5 h-5 text-foreground" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Desktop Layout */}
        {!isMobile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start hidden lg:grid">
            {/* Quote display */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <p
                    className="font-serif font-light text-foreground leading-relaxed mb-10"
                    style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)' }}
                  >
                    &ldquo;{testimonials[active].quote}&rdquo;
                  </p>
                  <div>
                    <p className="font-serif font-medium text-foreground text-lg">
                      {testimonials[active].author}
                    </p>
                    <p className="font-sans text-xs text-muted-foreground tracking-[0.15em] uppercase mt-1">
                      {testimonials[active].detail}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex flex-row lg:flex-col gap-4">
              {testimonials.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`group flex items-center gap-4 text-left p-4 border transition-all duration-300 ${
                    active === i
                      ? 'border-foreground bg-background'
                      : 'border-transparent hover:border-border'
                  }`}
                  aria-label={`View testimonial from ${t.author}`}
                >
                  <div
                    className={`w-1 self-stretch transition-colors duration-300 ${
                      active === i ? 'bg-accent' : 'bg-transparent'
                    }`}
                  />
                  <div className="min-w-0">
                    <p className={`font-serif text-sm font-medium transition-colors duration-300 ${
                      active === i ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {t.author.split(' & ')[0]}
                    </p>
                    <p className="font-sans text-xs text-muted-foreground/70 tracking-wide mt-0.5 truncate">
                      {t.detail}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
