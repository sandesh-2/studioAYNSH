'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface DateRangePickerProps {
  onDateRangeChange: (from: string, to: string) => void
  initialFrom?: string
  initialTo?: string
}

export function DateRangePicker({ onDateRangeChange, initialFrom = '', initialTo = '' }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedFrom, setSelectedFrom] = useState<Date | null>(initialFrom ? new Date(initialFrom) : null)
  const [selectedTo, setSelectedTo] = useState<Date | null>(initialTo ? new Date(initialTo) : null)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen])

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const handleDateSelect = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)

    if (!selectedFrom || (selectedFrom && selectedTo)) {
      // Start new range
      setSelectedFrom(selected)
      setSelectedTo(null)
    } else if (selectedFrom && selected < selectedFrom) {
      // Selected date is before the start, swap them
      setSelectedTo(selectedFrom)
      setSelectedFrom(selected)
    } else {
      // Set end date
      setSelectedTo(selected)
      const from = selectedFrom.toISOString().split('T')[0]
      const to = selected.toISOString().split('T')[0]
      onDateRangeChange(from, to)
      setIsOpen(false)
    }
  }

  const isDateInRange = (day: number) => {
    if (!selectedFrom || !selectedTo) return false
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return date >= selectedFrom && date <= selectedTo
  }

  const isDateSelected = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const fromMatch = selectedFrom && date.toDateString() === selectedFrom.toDateString()
    const toMatch = selectedTo && date.toDateString() === selectedTo.toDateString()
    return fromMatch || toMatch
  }

  const isDateHovered = (day: number) => {
    if (!selectedFrom || !hoverDate) return false
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const start = selectedFrom.getTime()
    const end = hoverDate.getTime()
    const dateTime = date.getTime()
    return dateTime >= Math.min(start, end) && dateTime <= Math.max(start, end)
  }

  const monthName = currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  const days = Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => i + 1)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not selected'
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 px-4 py-2.5 border border-border bg-background hover:border-foreground/40 transition-colors duration-200 text-sm text-foreground"
      >
        <span>
          {selectedFrom && selectedTo
            ? `${formatDate(selectedFrom)} → ${formatDate(selectedTo)}`
            : selectedFrom
            ? `From: ${formatDate(selectedFrom)}`
            : 'Select date range'}
        </span>
        <ChevronRight size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 z-50 bg-background border border-border shadow-md p-5 w-80"
          >
            {/* Header with month navigation */}
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-1 hover:bg-secondary transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft size={16} className="text-muted-foreground" />
              </button>

              <h3 className="font-sans text-sm font-medium text-foreground">{monthName}</h3>

              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-1 hover:bg-secondary transition-colors"
                aria-label="Next month"
              >
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-sans text-xs text-muted-foreground font-medium h-8 flex items-center justify-center">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {emptyDays.map((i) => (
                <div key={`empty-${i}`} className="h-8" />
              ))}

              {days.map((day) => {
                const isSelected = isDateSelected(day)
                const inRange = isDateInRange(day)
                const isHovered = isDateHovered(day)

                return (
                  <motion.button
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    onMouseEnter={() => setHoverDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                    onMouseLeave={() => setHoverDate(null)}
                    whileHover={{ scale: 1.05 }}
                    className={`h-8 flex items-center justify-center font-sans text-xs font-medium rounded-sm transition-all duration-150 ${
                      isSelected
                        ? 'bg-accent text-background font-semibold'
                        : inRange || isHovered
                        ? 'bg-accent/20 text-foreground'
                        : 'text-foreground hover:bg-secondary'
                    }`}
                  >
                    {day}
                  </motion.button>
                )
              })}
            </div>

            {/* Selected range display */}
            {selectedFrom && selectedTo && (
              <div className="mt-5 pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-sans text-xs text-muted-foreground uppercase tracking-wider">Selected Range</p>
                  <button
                    onClick={() => {
                      setSelectedFrom(null)
                      setSelectedTo(null)
                      onDateRangeChange('', '')
                    }}
                    className="font-sans text-xs text-muted-foreground hover:text-foreground transition-colors underline"
                  >
                    Clear
                  </button>
                </div>
                <p className="font-sans text-sm text-foreground">
                  {formatDate(selectedFrom)} → {formatDate(selectedTo)}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
