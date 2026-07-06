'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Clock, Check } from 'lucide-react'
import { useState, useRef, useEffect, useCallback } from 'react'

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

// ── Drum scroll column ─────────────────────────────────────────────────────
interface DrumProps {
  items: number[]
  selected: number
  onSelect: (v: number) => void
  format?: (v: number) => string
  label: string
}

function Drum({ items, selected, onSelect, format, label }: DrumProps) {
  const ITEM_H = 40
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll the selected item into the center on mount / value change
  useEffect(() => {
    const idx = items.indexOf(selected)
    if (idx < 0 || !containerRef.current) return
    containerRef.current.scrollTo({
      top: idx * ITEM_H,
      behavior: 'smooth',
    })
  }, [selected, items])

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-sans text-[9px] tracking-[0.18em] uppercase text-muted-foreground/60 mb-0.5">
        {label}
      </span>
      {/* Drum container */}
      <div className="relative w-14" style={{ height: ITEM_H * 3 }}>
        {/* Center highlight strip */}
        <div
          className="absolute left-0 right-0 pointer-events-none border-t border-b border-border/60 bg-secondary/60"
          style={{ top: ITEM_H, height: ITEM_H }}
        />
        <div
          ref={containerRef}
          className="h-full overflow-y-scroll scrollbar-none snap-y snap-mandatory"
          aria-label={label}
        >
          {/* Spacer so first item can center */}
          <div style={{ height: ITEM_H }} />
          {items.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onSelect(v)}
              className={`w-full flex items-center justify-center snap-center transition-all duration-150
                font-sans text-sm leading-none select-none
                ${v === selected
                  ? 'text-foreground font-semibold'
                  : 'text-muted-foreground/50 hover:text-muted-foreground'
                }`}
              style={{ height: ITEM_H }}
              aria-pressed={v === selected}
              aria-label={`${label} ${format ? format(v) : v}`}
            >
              {format ? format(v) : pad(v)}
            </button>
          ))}
          {/* Spacer so last item can center */}
          <div style={{ height: ITEM_H }} />
        </div>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
const HOURS   = Array.from({ length: 12 }, (_, i) => i + 1)   // 1..12
const MINUTES = Array.from({ length: 60 }, (_, i) => i)        // 0..59

export function TimePicker({ value, onChange, error }: TimePickerProps) {
  const parsed = parseValue(value)

  const [open,   setOpen]   = useState(false)
  const [hour,   setHour]   = useState(parsed.hour)
  const [minute, setMinute] = useState(parsed.minute)
  const [period, setPeriod] = useState<'AM' | 'PM'>(parsed.period)
  // Free-text input state
  const [textInput, setTextInput] = useState(value || '')
  const [inputError, setInputError] = useState('')

  const ref = useRef<HTMLDivElement>(null)

  // Sync drums when parent value changes (e.g. form reset)
  useEffect(() => {
    const p = parseValue(value)
    setHour(p.hour)
    setMinute(p.minute)
    setPeriod(p.period)
    setTextInput(value || '')
  }, [value])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Commit current drum state
  const commit = useCallback(() => {
    const formatted = formatTime(hour, minute, period)
    onChange(formatted)
    setTextInput(formatted)
    setInputError('')
    setOpen(false)
  }, [hour, minute, period, onChange])

  // Parse free-text entry  (accepts "3:45 PM", "15:45", "3pm", "3:45pm" etc.)
  function handleTextChange(raw: string) {
    setTextInput(raw)
    setInputError('')

    const v = raw.trim()
    if (!v) { onChange(''); return }

    // Try various patterns
    const patterns = [
      /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i,
      /^(\d{1,2})\s*(AM|PM)$/i,
      /^(\d{1,2}):(\d{2})$/,
    ]

    for (const pat of patterns) {
      const m = v.match(pat)
      if (!m) continue

      let h = parseInt(m[1], 10)
      const min = m[2] ? parseInt(m[2], 10) : 0
      const rawPeriod = m[3]?.toUpperCase() as 'AM' | 'PM' | undefined

      if (h < 0 || h > 23 || min < 0 || min > 59) break

      let p: 'AM' | 'PM'
      if (rawPeriod) {
        p = rawPeriod
        if (h > 12) break
        if (h === 0) h = 12
      } else {
        // 24-hour input
        p = h < 12 ? 'AM' : 'PM'
        if (h === 0) h = 12
        else if (h > 12) h -= 12
      }

      setHour(h)
      setMinute(min)
      setPeriod(p)
      onChange(formatTime(h, min, p))
      return
    }

    setInputError('Use format like 10:30 AM')
  }

  // When user blurs text input — format or clear
  function handleTextBlur() {
    if (!textInput.trim()) {
      onChange('')
      return
    }
    if (!value) {
      setInputError('Use format like 10:30 AM')
    } else {
      setInputError('')
      setTextInput(value)
    }
  }

  const displayValue = value || ''

  return (
    <div ref={ref} className="relative">
      {/* ── Trigger button ──────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
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
            <div className="px-4 pt-3 pb-2 border-b border-border">
              <p className="font-serif text-foreground text-sm font-light">Choose Time</p>
              <p className="font-sans text-muted-foreground/60 text-[10px] tracking-[0.12em] mt-0.5">
                Scroll to select or type below
              </p>
            </div>

            {/* Drums row */}
            <div className="flex items-start justify-center gap-3 px-4 py-3">
              {/* Hour drum */}
              <Drum
                items={HOURS}
                selected={hour}
                onSelect={setHour}
                label="Hour"
              />

              {/* Separator */}
              <div className="font-serif text-foreground text-xl self-center mt-5 select-none">:</div>

              {/* Minute drum */}
              <Drum
                items={MINUTES}
                selected={minute}
                onSelect={setMinute}
                label="Min"
              />

              {/* AM / PM toggle */}
              <div className="flex flex-col gap-1 mt-5 ml-1">
                {(['AM', 'PM'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1.5 font-sans text-xs tracking-[0.12em] border transition-all duration-150 ${
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

            {/* Free-text input row */}
            <div className="px-4 pb-3 border-t border-border/50 pt-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => handleTextChange(e.target.value)}
                    onBlur={handleTextBlur}
                    placeholder="e.g. 10:30 AM"
                    className="w-full border-b border-border bg-transparent py-2 font-sans text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-foreground focus:outline-none transition-colors duration-200"
                    aria-label="Type time manually"
                  />
                </div>
                <button
                  type="button"
                  onClick={commit}
                  className="flex items-center gap-1.5 px-4 py-2 bg-foreground text-background font-sans text-xs tracking-[0.14em] uppercase hover:bg-accent hover:text-foreground transition-all duration-200 shrink-0"
                  aria-label="Confirm time"
                >
                  <Check size={12} />
                  Set
                </button>
              </div>
              {inputError && (
                <p className="mt-1 font-sans text-[10px] text-destructive">{inputError}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
