'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface TimePickerProps {
  value: string    // "HH:MM AM/PM"
  onChange: (val: string) => void
  error?: string
}

// 30-min slots from 6:00 AM to 9:00 PM
const SLOTS: string[] = []
for (let h = 6; h <= 21; h++) {
  for (const m of [0, 30]) {
    if (h === 21 && m === 30) break
    const ampm = h < 12 ? 'AM' : 'PM'
    const hour = h % 12 === 0 ? 12 : h % 12
    SLOTS.push(`${hour}:${m === 0 ? '00' : '30'} ${ampm}`)
  }
}

export function TimePicker({ value, onChange, error }: TimePickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // scroll selected into view when opening
  useEffect(() => {
    if (open && value && listRef.current) {
      const idx = SLOTS.indexOf(value)
      if (idx >= 0) {
        const item = listRef.current.children[idx] as HTMLElement
        item?.scrollIntoView({ block: 'center' })
      }
    }
  }, [open, value])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between border-b py-3 font-sans text-sm transition-colors duration-200 focus:outline-none ${
          open ? 'border-foreground' : 'border-border hover:border-foreground/50'
        } ${error ? 'border-destructive' : ''}`}
      >
        <span className={value ? 'text-foreground' : 'text-muted-foreground/50'}>
          {value || 'Select a time slot'}
        </span>
        <Clock size={15} className="text-muted-foreground shrink-0" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 right-0 z-40 bg-background border border-border shadow-xl"
          >
            <div className="px-4 pt-3 pb-1 border-b border-border">
              <p className="font-serif text-foreground text-sm font-light">Select Time Slot</p>
              <p className="font-sans text-muted-foreground text-[10px] tracking-[0.12em] mt-0.5 mb-2">
                Available 6:00 AM – 9:00 PM
              </p>
            </div>
            <ul ref={listRef} className="overflow-y-auto" style={{ maxHeight: 240 }} role="listbox">
              {SLOTS.map((slot) => (
                <li key={slot} role="option" aria-selected={value === slot}>
                  <button
                    type="button"
                    onClick={() => { onChange(slot); setOpen(false) }}
                    className={`w-full text-left px-5 py-2.5 font-sans text-sm transition-colors duration-150 ${
                      value === slot
                        ? 'bg-foreground text-background'
                        : 'text-foreground hover:bg-secondary'
                    }`}
                  >
                    {slot}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
