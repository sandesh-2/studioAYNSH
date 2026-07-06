'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Clock, Check, X, ChevronUp, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface TimePickerProps {
  value: string     // "HH:MM AM" | "HH:MM PM" | ""
  onChange: (val: string) => void
  error?: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function pad(n: number) { return String(n).padStart(2, '0') }

function parseValue(val: string) {
  if (!val) return { hour: 12, minute: 0, period: 'AM' as 'AM' | 'PM' }
  const m = val.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!m) return { hour: 12, minute: 0, period: 'AM' as 'AM' | 'PM' }
  return {
    hour:   parseInt(m[1], 10),
    minute: parseInt(m[2], 10),
    period: m[3].toUpperCase() as 'AM' | 'PM',
  }
}

function formatTime(h: number, m: number, p: 'AM' | 'PM') {
  return `${pad(h)}:${pad(m)} ${p}`
}

// ── Spinner column (arrow-based, no scrolling) ────────────────────────────
interface SpinnerProps {
  value: number
  onUp: () => void
  onDown: () => void
  format?: (v: number) => string
  label: string
}

function Spinner({ value, onUp, onDown, format, label }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-0.5" aria-label={label}>
      <span className="font-sans text-[9px] tracking-[0.18em] uppercase text-muted-foreground/50 mb-1">
        {label}
      </span>

      {/* Up arrow */}
      <button
        type="button"
        onClick={onUp}
        className="w-10 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150 rounded-sm"
        aria-label={`Increase ${label}`}
      >
        <ChevronUp size={16} />
      </button>

      {/* Value display */}
      <div className="w-14 h-11 flex items-center justify-center border border-border bg-secondary/50 select-none">
        <span className="font-sans text-xl font-semibold text-foreground tabular-nums">
          {format ? format(value) : pad(value)}
        </span>
      </div>

      {/* Down arrow */}
      <button
        type="button"
        onClick={onDown}
        className="w-10 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150 rounded-sm"
        aria-label={`Decrease ${label}`}
      >
        <ChevronDown size={16} />
      </button>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export function TimePicker({ value, onChange, error }: TimePickerProps) {
  const parsed = parseValue(value)

  const [open,   setOpen]   = useState(false)
  // Internal draft state — only committed on OK
  const [hour,   setHour]   = useState(parsed.hour)
  const [minute, setMinute] = useState(parsed.minute)
  const [period, setPeriod] = useState<'AM' | 'PM'>(parsed.period)

  const ref = useRef<HTMLDivElement>(null)

  // Sync internal state when parent value changes (e.g. form reset)
  useEffect(() => {
    const p = parseValue(value)
    setHour(p.hour)
    setMinute(p.minute)
    setPeriod(p.period)
  }, [value])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handleCancel()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleOpen() {
    // Pre-load draft from current committed value
    const p = parseValue(value)
    setHour(p.hour)
    setMinute(p.minute)
    setPeriod(p.period)
    setOpen(true)
  }

  function handleCancel() {
    // Revert draft to last committed value
    const p = parseValue(value)
    setHour(p.hour)
    setMinute(p.minute)
    setPeriod(p.period)
    setOpen(false)
  }

  function handleOk() {
    onChange(formatTime(hour, minute, period))
    setOpen(false)
  }

  // Hour: cycles 1→12
  function hourUp()   { setHour((h) => h === 12 ? 1  : h + 1) }
  function hourDown() { setHour((h) => h === 1  ? 12 : h - 1) }

  // Minute: cycles 0→59
  function minuteUp()   { setMinute((m) => m === 59 ? 0  : m + 1) }
  function minuteDown() { setMinute((m) => m === 0  ? 59 : m - 1) }

  const displayValue = value || ''

  return (
    <div ref={ref} className="relative">
      {/* ── Trigger button ──────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleOpen}
        className={`w-full flex items-center justify-between border-b py-3 font-sans text-sm transition-colors duration-200 focus:outline-none ${
          open ? 'border-foreground' : 'border-border hover:border-foreground/50'
        } ${error ? 'border-destructive' : ''}`}
      >
        <span className={displayValue ? 'text-foreground' : 'text-muted-foreground/50'}>
          {displayValue || 'Select a time'}
        </span>
        <Clock size={15} className="text-muted-foreground shrink-0" />
      </button>

      {/* ── Dropdown panel ──────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full mt-2 left-0 right-0 z-50 bg-background border border-border shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 pt-4 pb-3 border-b border-border">
              <p className="font-serif text-foreground text-base font-light tracking-wide">Choose Time</p>
            </div>

            {/* Spinners row */}
            <div className="flex items-center justify-center gap-2 px-5 py-5">
              {/* Hour */}
              <Spinner
                value={hour}
                onUp={hourUp}
                onDown={hourDown}
                label="Hour"
              />

              {/* Colon */}
              <span className="font-serif text-foreground text-2xl font-light self-center mt-3 mx-1 select-none">
                :
              </span>

              {/* Minute */}
              <Spinner
                value={minute}
                onUp={minuteUp}
                onDown={minuteDown}
                label="Min"
              />

              {/* AM / PM toggle */}
              <div className="flex flex-col gap-1.5 ml-3 mt-3">
                {(['AM', 'PM'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className={`px-3.5 py-2 font-sans text-xs tracking-[0.14em] border transition-all duration-150 ${
                      period === p
                        ? 'bg-foreground text-background border-foreground'
                        : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons — OK and Cancel */}
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-secondary/30">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center gap-1.5 px-4 py-2 font-sans text-xs tracking-[0.14em] uppercase text-muted-foreground border border-border hover:border-foreground/40 hover:text-foreground transition-all duration-200"
                aria-label="Cancel time selection"
              >
                <X size={12} />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleOk}
                className="inline-flex items-center gap-1.5 px-5 py-2 font-sans text-xs tracking-[0.14em] uppercase bg-foreground text-background hover:bg-accent hover:text-foreground transition-all duration-200"
                aria-label="Confirm time selection"
              >
                <Check size={12} />
                OK
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
