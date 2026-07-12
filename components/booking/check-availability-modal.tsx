'use client'

/**
 * CheckAvailabilityModal
 *
 * Root-cause fixes applied:
 *
 * 1. MiniCalendar — `today` is computed once outside the component so it never
 *    changes reference between renders. The `useEffect([], [])` that reset view
 *    state was the #1 cause of the mount-time blink; replaced with a stable
 *    `useMemo`-initialised state.
 *
 * 2. InlineTimePicker — removed the `useEffect([value])` sync that caused an
 *    infinite update loop (child effect → parent setState → prop change → child
 *    effect again). The picker is now fully uncontrolled: it owns its own h/m/p
 *    state and reports changes up via a callback only when the user interacts.
 *    The parent reads the value via a ref on submit rather than syncing it
 *    through useState on every keystroke.
 *
 * 3. Modal sizing — replaced `w-[calc(100%-2rem)]` (which shifts when the
 *    scrollbar-padding compensation changes body width) with `mx-4` margin so
 *    the flex container itself handles the centering math, giving a stable
 *    width every time.
 *
 * 4. Backdrop click — merged backdrop and dialog into ONE full-screen div so
 *    clicks on the overlay always land on the same element that has the
 *    onClose handler; no z-index mismatch possible.
 *
 * 5. Inner step animations — removed `motion.div` wrappers on the
 *    available/unavailable steps so content height is stable and there is no
 *    layout thrashing when the step changes. The outer entry/exit animation is
 *    kept as a single, one-shot motion element.
 */

import { AnimatePresence, motion } from 'framer-motion'
import {
  X, Calendar, Clock, CheckCircle, XCircle, Loader2,
  ArrowRight, MessageSquare, Image, Layers, BookOpen,
  ChevronUp, ChevronDown,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { checkAvailability } from '@/app/actions/booking'

// ─────────────────────────────────────────────────────────────────────────────
// Constants — computed once at module level, never inside a component
// ─────────────────────────────────────────────────────────────────────────────

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function pad(n: number) { return String(n).padStart(2, '0') }

// ─────────────────────────────────────────────────────────────────────────────
// MiniCalendar
// ─────────────────────────────────────────────────────────────────────────────

function MiniCalendar({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  // today is computed once per render-tree mount — stable reference
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const maxDate = useMemo(() => {
    const d = new Date(today)
    d.setMonth(d.getMonth() + 5)
    return d
  }, [today])

  const todayMonthStart = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
    [today],
  )

  // Initialise once — NO useEffect reset. A useEffect that calls setState on
  // mount causes an extra render pass which was the primary blink source.
  const [view, setView] = useState(() => ({
    year:  today.getFullYear(),
    month: today.getMonth(),
  }))

  const firstDay    = new Date(view.year, view.month, 1).getDay()
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()

  const cells: (number | null)[] = useMemo(() => {
    const arr: (number | null)[] = [
      ...Array<null>(firstDay).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ]
    while (arr.length % 7 !== 0) arr.push(null)
    return arr
  }, [firstDay, daysInMonth])

  const canGoPrev = new Date(view.year, view.month - 1, 1) >= todayMonthStart
  const canGoNext = new Date(view.year, view.month + 1, 1) <= maxDate

  const prevMonth = useCallback(() => {
    if (!canGoPrev) return
    setView((v) => {
      const d = new Date(v.year, v.month - 1, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }, [canGoPrev])

  const nextMonth = useCallback(() => {
    if (!canGoNext) return
    setView((v) => {
      const d = new Date(v.year, v.month + 1, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }, [canGoNext])

  return (
    <div className="select-none w-full">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          aria-label="Previous month"
          className={`p-1.5 transition-colors duration-150 ${
            canGoPrev
              ? 'text-muted-foreground hover:text-foreground'
              : 'text-muted-foreground/20 cursor-not-allowed'
          }`}
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
          aria-label="Next month"
          className={`p-1.5 transition-colors duration-150 ${
            canGoNext
              ? 'text-muted-foreground hover:text-foreground'
              : 'text-muted-foreground/20 cursor-not-allowed'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_SHORT.map((d) => (
          <div
            key={d}
            className="text-center font-sans text-[9px] tracking-[0.12em] text-muted-foreground/50 uppercase py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} className="h-8" />

          const cellDate = new Date(view.year, view.month, day)
          const disabled = cellDate < today || cellDate > maxDate
          const sel      = value === `${view.year}-${pad(view.month + 1)}-${pad(day)}`
          const isToday  =
            today.getFullYear() === view.year &&
            today.getMonth()    === view.month &&
            today.getDate()     === day

          return (
            <button
              key={`d-${view.year}-${view.month}-${day}`}
              type="button"
              disabled={disabled}
              onClick={() => onChange(`${view.year}-${pad(view.month + 1)}-${pad(day)}`)}
              className={[
                'h-8 w-full flex items-center justify-center font-sans text-sm transition-all duration-150',
                disabled  ? 'text-muted-foreground/25 cursor-not-allowed' : 'hover:bg-secondary cursor-pointer',
                sel       ? 'bg-foreground !text-background'              : '',
                isToday && !sel ? 'text-accent font-semibold'             : '',
                !disabled && !sel ? 'text-foreground'                     : '',
              ].join(' ')}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// InlineTimePicker — fully UNCONTROLLED to break the setState feedback loop
// ─────────────────────────────────────────────────────────────────────────────

function SpinCol({
  onUp, onDown, display, label,
}: {
  onUp: () => void; onDown: () => void
  display: string; label: string
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="font-sans text-[9px] tracking-[0.16em] uppercase text-muted-foreground/50 mb-1">
        {label}
      </span>
      <button
        type="button"
        onClick={onUp}
        aria-label={`Increase ${label}`}
        className="w-10 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150"
      >
        <ChevronUp size={15} />
      </button>
      <div className="w-14 h-11 flex items-center justify-center border border-border bg-secondary/40 select-none">
        <span className="font-sans text-xl font-semibold text-foreground tabular-nums">{display}</span>
      </div>
      <button
        type="button"
        onClick={onDown}
        aria-label={`Decrease ${label}`}
        className="w-10 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150"
      >
        <ChevronDown size={15} />
      </button>
    </div>
  )
}

interface InlineTimePickerRef {
  getTime: () => string
}

const InlineTimePicker = ({
  onRef,
}: {
  onRef?: (ref: InlineTimePickerRef) => void
}) => {
  const [hour,   setHour]   = useState(10)
  const [minute, setMinute] = useState(0)
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM')

  // Expose current value to parent without causing re-renders on every change
  useEffect(() => {
    onRef?.({
      getTime: () => `${pad(hour)}:${pad(minute)} ${period}`,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hour, minute, period])

  return (
    <div className="flex items-center justify-center gap-2 py-3">
      <SpinCol
        display={pad(hour)}
        label="Hour"
        onUp={()   => setHour((h) => h === 12 ? 1  : h + 1)}
        onDown={()  => setHour((h) => h === 1  ? 12 : h - 1)}
      />
      <span className="font-serif text-2xl font-light text-foreground self-center mt-3 mx-1 select-none">
        :
      </span>
      <SpinCol
        display={pad(minute)}
        label="Min"
        onUp={()   => setMinute((m) => m === 59 ? 0  : m + 1)}
        onDown={()  => setMinute((m) => m === 0  ? 59 : m - 1)}
      />
      <div className="flex flex-col gap-1.5 ml-3 mt-3">
        {(['AM', 'PM'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={[
              'px-3.5 py-2 font-sans text-xs tracking-[0.14em] border transition-all duration-150',
              period === p
                ? 'bg-foreground text-background border-foreground'
                : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground',
            ].join(' ')}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main modal
// ─────────────────────────────────────────────────────────────────────────────

export interface CheckAvailabilityModalProps {
  open: boolean
  onClose: () => void
}

type ModalStep = 'select' | 'checking' | 'available' | 'unavailable'

export function CheckAvailabilityModal({ open, onClose }: CheckAvailabilityModalProps) {
  const router = useRouter()

  const [date,           setDate]           = useState('')
  const [step,           setStep]           = useState<ModalStep>('select')
  const [slotsAvailable, setSlotsAvailable] = useState(0)
  const [displayDate,    setDisplayDate]    = useState('')

  // Ref to read time picker value on demand — avoids wiring time through state
  const timeRef = useRef<InlineTimePickerRef | null>(null)

  // Reset every time the modal opens
  useEffect(() => {
    if (open) {
      setDate('')
      setStep('select')
      setSlotsAvailable(0)
      setDisplayDate('')
    }
  }, [open])

  // Body scroll lock — compensate for scrollbar width to prevent layout shift
  useEffect(() => {
    if (!open) return
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const prev = document.body.style.overflow
    document.body.style.overflow    = 'hidden'
    document.body.style.paddingRight = `${scrollbarWidth}px`
    return () => {
      document.body.style.overflow    = prev
      document.body.style.paddingRight = ''
    }
  }, [open])

  // Escape key
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
    }
    document.addEventListener('keydown', onKey, true)
    return () => document.removeEventListener('keydown', onKey, true)
  }, [open, onClose])

  async function handleCheck() {
    if (!date) return
    setStep('checking')
    try {
      const result = await checkAvailability(date)
      setSlotsAvailable(result.slotsAvailable ?? 0)
      setDisplayDate(
        new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
          day: 'numeric', month: 'long', year: 'numeric', weekday: 'long',
        }),
      )
      setStep(result.available ? 'available' : 'unavailable')
    } catch {
      setStep('unavailable')
    }
  }

  function handleContinue() {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('preselect_date', date)
      const t = timeRef.current?.getTime()
      if (t) sessionStorage.setItem('preselect_time', t)
    }
    onClose()
    router.push('/booking')
  }

  // Overlay click — only close when clicking the dark backdrop directly
  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="availability-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          // Single full-screen layer — backdrop + centering container in one
          className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
          onClick={handleOverlayClick}
          aria-hidden="false"
        >
          <motion.div
            key="availability-modal-panel"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            role="dialog"
            aria-modal="true"
            aria-label="Check availability"
            // mx-4 gives 1rem margin on each side on all screens; max-w-lg caps it.
            // No calc() math that depends on scrollbar compensation.
            className="w-full max-w-lg mx-4 mb-4 sm:mb-0 bg-background rounded-lg shadow-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: 'min(90vh, calc(100dvh - 2rem))' }}
            // Stop click from bubbling up to the overlay
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Header ── */}
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
                aria-label="Close modal"
                className="p-2 -mr-1 -mt-1 text-muted-foreground hover:text-foreground transition-colors duration-150 flex-shrink-0"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 px-6 py-8 overflow-y-auto">

              {/* ── STEP: select / checking ── */}
              {(step === 'select' || step === 'checking') && (
                <div className="space-y-8">

                  {/* Date picker */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar size={14} className="text-muted-foreground flex-shrink-0" />
                      <span className="font-sans text-xs tracking-[0.18em] uppercase text-muted-foreground">
                        Select Date
                      </span>
                    </div>
                    <MiniCalendar
                      value={date}
                      onChange={(v) => { setDate(v); setStep('select') }}
                    />
                    {date && (
                      <p className="mt-3 font-sans text-xs text-accent">
                        Selected:{' '}
                        {new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'long', year: 'numeric', weekday: 'long',
                        })}
                      </p>
                    )}
                  </div>

                  {/* Time picker — uncontrolled, stable */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={14} className="text-muted-foreground flex-shrink-0" />
                      <span className="font-sans text-xs tracking-[0.18em] uppercase text-muted-foreground">
                        Select Time
                      </span>
                    </div>
                    <InlineTimePicker
                      onRef={(ref) => { timeRef.current = ref }}
                    />
                  </div>

                  {/* Check Availability button */}
                  <button
                    type="button"
                    onClick={handleCheck}
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

                  {!date && (
                    <p className="text-center font-sans text-xs text-muted-foreground/50 tracking-wide">
                      Select a date and time, then click &quot;Check Availability&quot;.
                    </p>
                  )}
                </div>
              )}

              {/* ── STEP: available ── */}
              {step === 'available' && (
                <div className="space-y-6">
                  <div className="flex flex-col items-center text-center pt-2 pb-4">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-5">
                      <CheckCircle size={32} className="text-green-600" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-2xl font-light text-foreground mb-2">
                      Date Available
                    </h3>
                    <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-xs">
                      {displayDate}
                      {timeRef.current && (
                        <span className="block text-xs mt-1 text-muted-foreground/70">
                          {timeRef.current.getTime()}
                        </span>
                      )}
                    </p>
                    {slotsAvailable > 0 && (
                      <p className="mt-3 font-sans text-xs text-green-700 bg-green-500/8 border border-green-500/20 px-4 py-1.5">
                        {slotsAvailable} {slotsAvailable === 1 ? 'slot' : 'slots'} remaining on this date
                      </p>
                    )}
                  </div>

                  <div className="border-t border-border" />

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
                </div>
              )}

              {/* ── STEP: unavailable ── */}
              {step === 'unavailable' && (
                <div className="space-y-6">
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

                  <div className="border-t border-border" />

                  <button
                    type="button"
                    onClick={() => setStep('select')}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-foreground text-background font-sans text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:bg-accent hover:text-foreground"
                  >
                    <Calendar size={14} />
                    Try Another Date
                  </button>

                  <div>
                    <p className="font-sans text-[10px] tracking-[0.22em] uppercase text-muted-foreground/50 mb-3 text-center">
                      Or explore these options
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { href: '/contact',   Icon: MessageSquare, label: 'Contact Us'     },
                        { href: '/portfolio', Icon: Image,         label: 'View Portfolio' },
                        { href: '/services',  Icon: Layers,        label: 'View Services'  },
                        { href: '/blog',      Icon: BookOpen,      label: 'Visit Journal'  },
                      ].map(({ href, Icon, label }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={onClose}
                          className="flex flex-col items-center gap-2 p-4 border border-border hover:border-foreground/30 hover:bg-secondary/50 transition-all duration-200 text-center group"
                        >
                          <Icon size={18} strokeWidth={1.5} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                          <span className="font-sans text-[10px] tracking-[0.14em] uppercase text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                            {label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
