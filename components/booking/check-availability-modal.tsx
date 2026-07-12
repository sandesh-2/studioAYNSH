'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  X, Calendar, Clock, CheckCircle, XCircle, Loader2,
  ArrowRight, MessageSquare, Image, Layers, BookOpen,
  ChevronUp, ChevronDown,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { checkAvailability } from '@/app/actions/booking'

// ── Inline mini calendar for the modal ───────────────────────────────────

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function pad(n: number) { return String(n).padStart(2, '0') }

function MiniCalendar({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const maxDate = new Date(today)
  maxDate.setMonth(maxDate.getMonth() + 5)

  const [view, setView] = useState<{ year: number; month: number }>(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }))

  // Always reset to current month when the calendar first renders / re-mounts
  useEffect(() => {
    setView({ year: today.getFullYear(), month: today.getMonth() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const firstDay = new Date(view.year, view.month, 1).getDay()
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  // Compare at month granularity only — no time-component issues
  const todayMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const canGoPrev = new Date(view.year, view.month - 1, 1) >= todayMonthStart
  const canGoNext = new Date(view.year, view.month + 1, 1) <= maxDate

  function prevMonth() {
    if (!canGoPrev) return
    setView((v) => {
      const d = new Date(v.year, v.month - 1, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }
  function nextMonth() {
    if (!canGoNext) return
    setView((v) => {
      const d = new Date(v.year, v.month + 1, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  function isPast(day: number) {
    return new Date(view.year, view.month, day) < today
  }
  function isBeyondMax(day: number) {
    return new Date(view.year, view.month, day) > maxDate
  }
  function isSelected(day: number) {
    return value === `${view.year}-${pad(view.month + 1)}-${pad(day)}`
  }
  function isToday(day: number) {
    return (
      today.getFullYear() === view.year &&
      today.getMonth() === view.month &&
      today.getDate() === day
    )
  }

  return (
    <div className="select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          className={`p-1.5 transition-colors duration-150 ${
            canGoPrev ? 'text-muted-foreground hover:text-foreground' : 'text-muted-foreground/20 cursor-not-allowed'
          }`}
          aria-label="Previous month"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="font-serif text-foreground text-sm font-light">
          {MONTHS[view.month]} {view.year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          disabled={!canGoNext}
          className={`p-1.5 transition-colors duration-150 ${
            canGoNext ? 'text-muted-foreground hover:text-foreground' : 'text-muted-foreground/20 cursor-not-allowed'
          }`}
          aria-label="Next month"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_SHORT.map((d) => (
          <div key={d} className="text-center font-sans text-[9px] tracking-[0.12em] text-muted-foreground/50 uppercase py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="h-8" />
          const past = isPast(day)
          const beyond = isBeyondMax(day)
          const disabled = past || beyond
          const sel = isSelected(day)
          const tod = isToday(day)
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onChange(`${view.year}-${pad(view.month + 1)}-${pad(day)}`)}
              className={`h-8 w-full flex items-center justify-center font-sans text-sm transition-all duration-150
                ${disabled ? 'text-muted-foreground/25 cursor-not-allowed' : 'hover:bg-secondary cursor-pointer'}
                ${sel ? 'bg-foreground !text-background' : ''}
                ${tod && !sel ? 'text-accent font-semibold' : ''}
                ${!disabled && !sel ? 'text-foreground' : ''}
              `}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Inline always-visible time spinner (no trigger click needed) ──────────

function pad2(n: number) { return String(n).padStart(2, '0') }

function parseTime(val: string) {
  if (!val) return { hour: 10, minute: 0, period: 'AM' as 'AM' | 'PM' }
  const m = val.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!m) return { hour: 10, minute: 0, period: 'AM' as 'AM' | 'PM' }
  return {
    hour:   parseInt(m[1], 10),
    minute: parseInt(m[2], 10),
    period: m[3].toUpperCase() as 'AM' | 'PM',
  }
}

function formatTime(h: number, m: number, p: 'AM' | 'PM') {
  return `${pad2(h)}:${pad2(m)} ${p}`
}

function SpinCol({
  value, onUp, onDown, display, label,
}: {
  value: number; onUp: () => void; onDown: () => void
  display: string; label: string
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="font-sans text-[9px] tracking-[0.16em] uppercase text-muted-foreground/50 mb-1">{label}</span>
      <button type="button" onClick={onUp}
        className="w-10 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150"
        aria-label={`Increase ${label}`}>
        <ChevronUp size={15} />
      </button>
      <div className="w-14 h-11 flex items-center justify-center border border-border bg-secondary/40 select-none">
        <span className="font-sans text-xl font-semibold text-foreground tabular-nums">{display}</span>
      </div>
      <button type="button" onClick={onDown}
        className="w-10 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150"
        aria-label={`Decrease ${label}`}>
        <ChevronDown size={15} />
      </button>
    </div>
  )
}

function InlineTimePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const parsed = parseTime(value)
  const [hour,   setHour]   = useState(parsed.hour)
  const [minute, setMinute] = useState(parsed.minute)
  const [period, setPeriod] = useState<'AM' | 'PM'>(parsed.period)

  // Sync internal state when the prop value changes externally
  useEffect(() => {
    const newParsed = parseTime(value)
    setHour(newParsed.hour)
    setMinute(newParsed.minute)
    setPeriod(newParsed.period)
  }, [value])

  // Emit change whenever any spinner moves
  const handleChange = (h: number, m: number, p: 'AM' | 'PM') => {
    onChange(formatTime(h, m, p))
  }

  return (
    <div className="flex items-center justify-center gap-2 py-3">
      <SpinCol value={hour}   onUp={() => { const h = hour === 12 ? 1 : hour + 1; setHour(h); handleChange(h, minute, period) }}
               onDown={() => { const h = hour === 1 ? 12 : hour - 1; setHour(h); handleChange(h, minute, period) }}
               display={pad2(hour)} label="Hour" />
      <span className="font-serif text-2xl font-light text-foreground self-center mt-3 mx-1 select-none">:</span>
      <SpinCol value={minute} onUp={() => { const m = minute === 59 ? 0 : minute + 1; setMinute(m); handleChange(hour, m, period) }}
               onDown={() => { const m = minute === 0 ? 59 : minute - 1; setMinute(m); handleChange(hour, m, period) }}
               display={pad2(minute)} label="Min" />
      <div className="flex flex-col gap-1.5 ml-3 mt-3">
        {(['AM', 'PM'] as const).map((p) => (
          <button key={p} type="button" onClick={() => { setPeriod(p); handleChange(hour, minute, p) }}
            className={`px-3.5 py-2 font-sans text-xs tracking-[0.14em] border transition-all duration-150 ${
              period === p
                ? 'bg-foreground text-background border-foreground'
                : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'
            }`}>
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Main modal ────────────────────────────────────────────────────────────

export interface CheckAvailabilityModalProps {
  open: boolean
  onClose: () => void
}

type ModalStep = 'select' | 'checking' | 'available' | 'unavailable'

export function CheckAvailabilityModal({ open, onClose }: CheckAvailabilityModalProps) {
  const router = useRouter()
  const overlayRef = useRef<HTMLDivElement>(null)

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [step, setStep] = useState<ModalStep>('select')
  const [slotsAvailable, setSlotsAvailable] = useState(0)

  // Reset state every time the modal opens
  useEffect(() => {
    if (open) {
      setDate('')
      setTime('')
      setStep('select')
      setSlotsAvailable(0)
    }
  }, [open])

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [open])

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    document.addEventListener('keydown', handler, true)
    return () => document.removeEventListener('keydown', handler, true)
  }, [open, onClose])

  async function handleCheck(dateToCheck?: string) {
    const target = dateToCheck ?? date
    if (!target) return
    setStep('checking')
    try {
      const result = await checkAvailability(target)
      setSlotsAvailable(result.slotsAvailable ?? 0)
      setStep(result.available ? 'available' : 'unavailable')
    } catch {
      setStep('unavailable')
    }
  }

  // Manual check — no auto-trigger. User clicks button.

  function handleContinue() {
    // Store selected date/time in sessionStorage so the booking form can pre-fill
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('preselect_date', date)
      if (time) sessionStorage.setItem('preselect_time', time)
    }
    onClose()
    router.push('/booking')
  }

  const displayDate = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric', weekday: 'long',
      })
    : ''

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — click outside modal to close */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-foreground/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === overlayRef.current) {
                onClose()
              }
            }}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            role="dialog"
            aria-modal="true"
            aria-label="Check availability"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          >
            <div
              className="pointer-events-auto bg-background w-[calc(100%-2rem)] max-w-lg h-auto max-h-[min(90vh,calc(100dvh-2rem))] sm:max-h-[85vh] rounded-lg shadow-2xl flex flex-col overflow-hidden mb-4 sm:mb-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header — fixed, does not scroll */}
              <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-border flex-shrink-0">
                <div>
                  <p className="font-sans text-[10px] tracking-[0.28em] uppercase text-muted-foreground mb-1">
                    Step 1 of 2
                  </p>
                  <h2 className="font-serif text-2xl font-light text-foreground">
                    Check Availability
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-muted-foreground hover:text-foreground active:text-foreground transition-colors duration-150 flex-shrink-0"
                  aria-label="Close modal"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Body — scrollable content area, fixed padding to prevent resize */}
              <div className="flex-1 px-6 py-8 overflow-y-auto min-w-0 w-full">

                {/* ── STEP: select / checking ── */}
                {(step === 'select' || step === 'checking') && (
                  <div className="space-y-8">
                    {/* Date picker */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Calendar size={14} className="text-muted-foreground" />
                        <span className="font-sans text-xs tracking-[0.18em] uppercase text-muted-foreground">
                          Select Date
                        </span>
                      </div>
                      <MiniCalendar
                        value={date}
                        onChange={(v) => {
                          setDate(v)
                          setStep('select')
                        }}
                      />
                      {date && (
                        <p className="mt-3 font-sans text-xs text-accent">
                          Selected: {displayDate}
                        </p>
                      )}
                    </div>

                    {/* Time picker — always-visible inline spinner, no button click needed */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Clock size={14} className="text-muted-foreground" />
                        <span className="font-sans text-xs tracking-[0.18em] uppercase text-muted-foreground">
                          Select Time
                        </span>
                      </div>
                      <InlineTimePicker value={time} onChange={setTime} />
                    </div>

                    {/* Check Availability button */}
                    <button
                      type="button"
                      onClick={() => handleCheck()}
                      disabled={!date || step === 'checking'}
                      className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-foreground text-background font-sans text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:bg-accent hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {step === 'checking' ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Checking…
                        </>
                      ) : (
                        <>
                          <Calendar size={14} />
                          Check Availability
                        </>
                      )}
                    </button>

                    {/* Prompt: waiting for a date to be picked */}
                    {!date && step === 'select' && (
                      <p className="text-center font-sans text-xs text-muted-foreground/50 tracking-wide">
                        Select a date and time, then click "Check Availability".
                      </p>
                    )}
                  </div>
                )}

                {/* ── STEP: available ── */}
                {step === 'available' && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    {/* Success indicator */}
                    <div className="flex flex-col items-center text-center pt-2 pb-4">
                      <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-5">
                        <CheckCircle size={32} className="text-green-600" strokeWidth={1.5} />
                      </div>
                      <h3 className="font-serif text-2xl font-light text-foreground mb-2">
                        Date Available
                      </h3>
                      <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-xs">
                        {displayDate}
                        {time && <span className="block text-xs mt-1 text-muted-foreground/70">{time}</span>}
                      </p>
                      {slotsAvailable > 0 && (
                        <p className="mt-3 font-sans text-xs text-green-700 bg-green-500/8 border border-green-500/20 px-4 py-1.5">
                          {slotsAvailable} {slotsAvailable === 1 ? 'slot' : 'slots'} remaining on this date
                        </p>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border" />

                    {/* Continue to booking */}
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-foreground text-background font-sans text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:bg-accent hover:text-foreground group"
                    >
                      Continue to Booking
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep('select')}
                      className="w-full font-sans text-xs text-muted-foreground hover:text-foreground tracking-[0.12em] uppercase transition-colors duration-200 py-2"
                    >
                      Check a different date
                    </button>
                  </motion.div>
                )}

                {/* ── STEP: unavailable ── */}
                {step === 'unavailable' && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    {/* Not available indicator */}
                    <div className="flex flex-col items-center text-center pt-2 pb-4">
                      <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-5">
                        <XCircle size={32} className="text-orange-600" strokeWidth={1.5} />
                      </div>
                      <h3 className="font-serif text-2xl font-light text-foreground mb-2">
                        Not Available
                      </h3>
                      <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-xs">
                        We&apos;re fully booked on{' '}
                        <span className="text-foreground font-medium">{displayDate}</span>.
                        We apologise for the inconvenience.
                      </p>
                      <p className="mt-3 font-sans text-xs text-muted-foreground/60 leading-relaxed max-w-xs">
                        Please choose a different date, or reach out to us directly — we&apos;ll do our best to accommodate you.
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border" />

                    {/* Try another date */}
                    <button
                      type="button"
                      onClick={() => setStep('select')}
                      className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-foreground text-background font-sans text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:bg-accent hover:text-foreground"
                    >
                      <Calendar size={14} />
                      Try Another Date
                    </button>

                    {/* Alternative options */}
                    <div>
                      <p className="font-sans text-[10px] tracking-[0.22em] uppercase text-muted-foreground/50 mb-3 text-center">
                        Or explore these options
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="/contact"
                          onClick={onClose}
                          className="flex flex-col items-center gap-2 p-4 border border-border hover:border-foreground/30 hover:bg-secondary/50 transition-all duration-200 text-center group"
                        >
                          <MessageSquare size={18} strokeWidth={1.5} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                          <span className="font-sans text-[10px] tracking-[0.14em] uppercase text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                            Contact Us
                          </span>
                        </Link>
                        <Link
                          href="/portfolio"
                          onClick={onClose}
                          className="flex flex-col items-center gap-2 p-4 border border-border hover:border-foreground/30 hover:bg-secondary/50 transition-all duration-200 text-center group"
                        >
                          <Image size={18} strokeWidth={1.5} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                          <span className="font-sans text-[10px] tracking-[0.14em] uppercase text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                            View Portfolio
                          </span>
                        </Link>
                        <Link
                          href="/services"
                          onClick={onClose}
                          className="flex flex-col items-center gap-2 p-4 border border-border hover:border-foreground/30 hover:bg-secondary/50 transition-all duration-200 text-center group"
                        >
                          <Layers size={18} strokeWidth={1.5} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                          <span className="font-sans text-[10px] tracking-[0.14em] uppercase text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                            View Services
                          </span>
                        </Link>
                        <Link
                          href="/blog"
                          onClick={onClose}
                          className="flex flex-col items-center gap-2 p-4 border border-border hover:border-foreground/30 hover:bg-secondary/50 transition-all duration-200 text-center group"
                        >
                          <BookOpen size={18} strokeWidth={1.5} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                          <span className="font-sans text-[10px] tracking-[0.14em] uppercase text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                            Visit Journal
                          </span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
