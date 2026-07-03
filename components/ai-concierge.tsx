'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { MessageSquare, X, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// ─── FAQ data ────────────────────────────────────────────────────────────────
interface FaqItem {
  question: string
  answer: string
}

const FAQS: FaqItem[] = [
  {
    question: 'What services does Studio AYNSH offer?',
    answer:
      'We offer Wedding Photography, Pre-Wedding Shoots, Portrait & Fashion Photography, Drone Aerial Photography, Commercial Shoots, and Birthday / Anniversary sessions — all delivered with a cinematic, editorial sensibility.',
  },
  {
    question: 'How do I book a session?',
    answer:
      'Visit our Booking page and fill in the enquiry form. Praveen personally reviews every request and responds within 24 hours to discuss your vision, dates, and a custom package.',
  },
  {
    question: 'What are your pricing and packages?',
    answer:
      'Packages start from ₹20,000 and are fully customised to your needs. Head to our Services page for an overview, or submit a booking enquiry for a personalised quote.',
  },
  {
    question: 'Do you travel outside Gorakhpur?',
    answer:
      'Absolutely. Studio AYNSH has covered shoots across Lucknow, Delhi, Jaipur, Varanasi, Nainital, Agra, Udaipur, and Mumbai. Outstation travel charges apply depending on the destination.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'Edited galleries are delivered within 4–6 weeks for weddings and 1–2 weeks for portrait and commercial sessions. We never rush the edit — every image is a chapter of the untold story.',
  },
  {
    question: 'What is your shooting style?',
    answer:
      'Our style is candid, cinematic, and editorial — light-driven, emotion-led, and timeless. We blend documentary storytelling with fine-art composition so your images feel both real and elevated.',
  },
  {
    question: 'Can I see more portfolio work?',
    answer:
      'Yes — visit the Portfolio page for our full gallery. You can filter by category: Weddings, Pre-Wedding, Portrait, Fashion, Drone, and Commercial.',
  },
  {
    question: 'How do I access my delivered photos?',
    answer:
      'Your private gallery is available through our Client Portal, where you can view, download, and share your full edited collection securely.',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────
export function AiConcierge() {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<FaqItem | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Outside-click to close
  useEffect(() => {
    if (!isOpen) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  function toggle() {
    setIsOpen((prev) => !prev)
    if (isOpen) setSelected(null)
  }

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="w-[340px] sm:w-[390px] bg-background border border-border shadow-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: 560 }}
            role="dialog"
            aria-label="Studio AYNSH FAQ Concierge"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-foreground shrink-0">
              <div>
                <p className="font-serif text-background text-base font-medium tracking-wide leading-none">
                  Studio AYNSH
                </p>
                <p className="font-sans text-background/50 text-[10px] tracking-[0.18em] uppercase mt-1">
                  FAQ Concierge
                </p>
              </div>
              <button
                onClick={() => { setIsOpen(false); setSelected(null) }}
                className="text-background/50 hover:text-background transition-colors duration-200 p-1"
                aria-label="Close concierge"
              >
                <X size={17} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {selected ? (
                  /* Answer view */
                  <motion.div
                    key="answer"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="p-5 flex flex-col gap-4"
                  >
                    <button
                      onClick={() => setSelected(null)}
                      className="self-start font-sans text-[10px] tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1"
                    >
                      <ChevronRight size={10} className="rotate-180" />
                      Back to questions
                    </button>
                    <h3 className="font-serif text-foreground text-lg font-light leading-snug">
                      {selected.question}
                    </h3>
                    <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                      {selected.answer}
                    </p>
                  </motion.div>
                ) : (
                  /* FAQ list */
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                  >
                    <p className="px-5 pt-5 pb-3 font-sans text-xs text-muted-foreground leading-relaxed">
                      Select a question below to learn more about Studio AYNSH.
                    </p>
                    <ul role="list">
                      {FAQS.map((faq, i) => (
                        <li key={i}>
                          <button
                            onClick={() => setSelected(faq)}
                            className="w-full flex items-center justify-between gap-3 px-5 py-3.5 border-b border-border/60 text-left hover:bg-secondary transition-colors duration-200 group"
                          >
                            <span className="font-sans text-sm text-foreground leading-snug group-hover:text-foreground/80 transition-colors duration-200">
                              {faq.question}
                            </span>
                            <ChevronRight
                              size={14}
                              className="text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform duration-200"
                            />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="px-5 py-4">
                      <a
                        href="/booking"
                        className="block w-full text-center py-3 bg-foreground text-background font-sans text-xs tracking-[0.18em] uppercase hover:bg-accent hover:text-foreground transition-all duration-300"
                      >
                        Book a Session
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating action button — toggles between logo icon and X */}
      <motion.button
        onClick={toggle}
        className="w-14 h-14 bg-foreground text-background flex items-center justify-center shadow-lg hover:bg-accent hover:text-foreground transition-all duration-300 rounded-none"
        aria-label={isOpen ? 'Close FAQ Concierge' : 'Open FAQ Concierge'}
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="msg"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageSquare size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
