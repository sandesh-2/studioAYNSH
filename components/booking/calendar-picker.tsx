'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface CalendarPickerProps {
  value: string          // YYYY-MM-DD
  onChange: (val: string) => void
  error?: string
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

function pad(n: number) { return String(n).padStart(2, '0') }

export function CalendarPicker({ value, onChange, error }: CalendarPickerProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [open, setOpen] = useState(false)
  const [view, setView] = useState<{ year: number; month: number }>(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00')
      return { year: d.getFullYear(), month: d.getMonth() }
    }
    return { year: today.getFullYear(), month: today.getMonth() }
  })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Build calendar grid
  const firstDay = new Date(view.year, view.month, 1).getDay()
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // pad to full rows
  while (cells.length % 7 !== 0) cells.push(null)

  function prevMonth() {
    setView((v) => {
      const d = new Date(v.year, v.month - 1, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }
  function nextMonth() {
    setView((v) => {
      const d = new Date(v.year, v.month + 1, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  function selectDay(day: number) {
    const str = `${view.year}-${pad(view.month + 1)}-${pad(day)}`
    onChange(str)
    setOpen(false)
  }

  function isPast(day: number) {
    const d = new Date(view.year, view.month, day)
    return d < today
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

  const displayValue = value
    ? new Date(value + 'T00:00:00').toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : ''

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between border-b py-3 font-sans text-sm transition-colors duration-200 focus:outline-none ${
          open ? 'border-foreground' : 'border-border hover:border-foreground/50'
        } ${error ? 'border-destructive' : ''}`}
      >
        <span className={displayValue ? 'text-foreground' : 'text-muted-foreground/50'}>
          {displayValue || 'Select a date'}
        </span>
        <Calendar size={15} className="text-muted-foreground shrink-0" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 right-0 z-40 bg-background border border-border shadow-xl p-4 select-none"
          >
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors duration-150"
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-serif text-foreground text-base font-light">
                {MONTHS[view.month]} {view.year}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors duration-150"
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((d) => (
                <div key={d} className="text-center font-sans text-[10px] tracking-[0.1em] text-muted-foreground uppercase py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-y-0.5">
              {cells.map((day, i) => {
                if (!day) return <div key={i} />
                const past = isPast(day)
                const sel = isSelected(day)
                const tod = isToday(day)
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={past}
                    onClick={() => selectDay(day)}
                    className={`h-8 w-full flex items-center justify-center font-sans text-sm transition-all duration-150 rounded-none
                      ${past ? 'text-muted-foreground/30 cursor-not-allowed' : 'hover:bg-secondary cursor-pointer'}
                      ${sel ? 'bg-foreground !text-background hover:bg-foreground' : ''}
                      ${tod && !sel ? 'text-accent font-medium underline underline-offset-2' : ''}
                      ${!past && !sel ? 'text-foreground' : ''}
                    `}
                    aria-label={`${day} ${MONTHS[view.month]} ${view.year}`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
