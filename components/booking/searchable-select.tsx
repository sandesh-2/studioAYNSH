'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Check, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface Option {
  label: string
  value: string
}

interface SearchableSelectProps {
  options: Option[]
  value: string
  onChange: (val: string) => void
  placeholder: string
  error?: string
  searchPlaceholder?: string
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  error,
  searchPlaceholder = 'Search...'
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  )

  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder

  const handleSelect = (val: string) => {
    onChange(val)
    setOpen(false)
    setSearch('')
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen(!open)
          if (open) setSearch('')
        }}
        className={`w-full flex items-center justify-between border-b py-3 font-sans text-sm transition-colors duration-200 focus:outline-none ${
          open ? 'border-foreground' : 'border-border hover:border-foreground/50'
        } ${error ? 'border-destructive' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? 'text-foreground' : 'text-muted-foreground/50'}>
          {selectedLabel}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={15} className="text-muted-foreground" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full mt-2 left-0 right-0 z-40 bg-background border border-border shadow-xl overflow-hidden"
          >
            {/* Search input */}
            <div className="border-b border-border/50 p-2">
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-border/50 bg-background rounded px-3 py-2 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors duration-200"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Options list */}
            <ul
              role="listbox"
              className="overflow-y-auto"
              style={{ maxHeight: 260 }}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <li key={opt.value} role="option" aria-selected={value === opt.value}>
                    <button
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`w-full flex items-center justify-between px-5 py-3 font-sans text-sm transition-colors duration-150 ${
                        value === opt.value
                          ? 'bg-foreground text-background'
                          : 'text-foreground hover:bg-secondary'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {value === opt.value && <Check size={13} />}
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-5 py-3 text-center text-sm text-muted-foreground/50">
                  No results found
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
