'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface CustomSelectProps {
  options: string[]
  value: string
  onChange: (val: string) => void
  placeholder: string
  error?: string
}

export function CustomSelect({ options, value, onChange, placeholder, error }: CustomSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between border-b py-3 font-sans text-sm transition-colors duration-200 focus:outline-none ${
          open ? 'border-foreground' : 'border-border hover:border-foreground/50'
        } ${error ? 'border-destructive' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? 'text-foreground' : 'text-muted-foreground/50'}>
          {value || placeholder}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={15} className="text-muted-foreground" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full mt-2 left-0 right-0 z-40 bg-background border border-border shadow-xl overflow-hidden"
            style={{ maxHeight: 260, overflowY: 'auto' }}
          >
            {options.map((opt) => (
              <li key={opt} role="option" aria-selected={value === opt}>
                <button
                  type="button"
                  onClick={() => { onChange(opt); setOpen(false) }}
                  className={`w-full flex items-center justify-between px-5 py-3 font-sans text-sm transition-colors duration-150 ${
                    value === opt
                      ? 'bg-foreground text-background'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  <span>{opt}</span>
                  {value === opt && <Check size={13} />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
