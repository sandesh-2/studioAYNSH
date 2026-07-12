'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface BookingEvent {
  date: string
  service: string
  clientName?: string
  bookingId: string
}

interface BookingsCalendarProps {
  bookings: BookingEvent[]
  isAdmin?: boolean
  onDateClick?: (date: string) => void
}

const SERVICE_LABELS: Record<string, string> = {
  wedding: 'Wedding',
  prewedding: 'Pre-Wedding',
  portrait: 'Portrait',
  fashion: 'Fashion',
  drone: 'Drone',
  other: 'Other',
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// Responsive day headers: 3-char on md+, 1-char on mobile
const DAY_NAMES_LONG  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_NAMES_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function BookingsCalendar({ bookings, isAdmin = false, onDateClick }: BookingsCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const year  = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Index bookings by YYYY-MM-DD key
  const bookingsMap = new Map<string, BookingEvent[]>()
  bookings.forEach((b) => {
    // Normalise the date key in case it carries a time component
    const key = b.date.slice(0, 10)
    const bDate = new Date(key + 'T00:00:00')
    if (bDate.getFullYear() === year && bDate.getMonth() === month) {
      if (!bookingsMap.has(key)) bookingsMap.set(key, [])
      bookingsMap.get(key)!.push(b)
    }
  })

  // Build grid — leading nulls, then days, then trailing nulls to fill 6 rows
  const days: (number | null)[] = [
    ...Array<null>(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (days.length < 42) days.push(null)

  return (
    <div className="w-full bg-background border border-border">
      {/* Month navigation header */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-border">
        <button
          onClick={() => setCurrentDate(new Date(year, month - 1))}
          className="p-1.5 sm:p-2 hover:bg-secondary transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={16} />
        </button>
        <h2 className="font-serif text-base sm:text-lg text-foreground">
          {MONTH_NAMES[month]} {year}
        </h2>
        <button
          onClick={() => setCurrentDate(new Date(year, month + 1))}
          className="p-1.5 sm:p-2 hover:bg-secondary transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day-of-week header row */}
      <div className="grid grid-cols-7 border-b border-border">
        {DAY_NAMES_LONG.map((name, i) => (
          <div
            key={name}
            className="py-2 text-center font-sans font-medium tracking-[0.08em] uppercase text-muted-foreground border-r border-border last:border-r-0"
          >
            {/* Short on mobile, full on md+ */}
            <span className="md:hidden text-[10px]">{DAY_NAMES_SHORT[i]}</span>
            <span className="hidden md:inline text-xs">{name}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid — rows auto-expand with content */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          // Empty leading/trailing cells
          if (day === null) {
            return (
              <div
                key={`empty-${index}`}
                className="border-r border-b border-border bg-muted/20 p-1 sm:p-2 min-h-[48px] sm:min-h-[72px]"
              />
            )
          }

          const dateKey    = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayBookings = bookingsMap.get(dateKey) ?? []
          const cellDate   = new Date(year, month, day)
          cellDate.setHours(0, 0, 0, 0)
          const isToday  = cellDate.getTime() === today.getTime()
          const isPast   = cellDate < today
          const hasBooks = dayBookings.length > 0

          return (
            <div
              key={dateKey}
              onClick={() => hasBooks && onDateClick?.(dateKey)}
              className={[
                // Height: min on mobile, taller on md+; no fixed height so content drives it
                'border-r border-b border-border',
                'p-1 sm:p-2',
                'min-h-[48px] sm:min-h-[72px]',
                // Stack children vertically; date number shrinks to label, bookings stack below
                'flex flex-col gap-1',
                isPast  ? 'bg-muted/10'  : 'bg-background',
                hasBooks && !isPast ? 'cursor-pointer hover:bg-secondary/30 transition-colors' : '',
              ].join(' ')}
            >
              {/* Date number */}
              <span
                className={[
                  'font-sans font-medium leading-none shrink-0',
                  'text-xs sm:text-sm',
                  isToday   ? 'text-accent font-bold'         : '',
                  isPast && !isToday ? 'text-muted-foreground/35' : '',
                  !isPast && !isToday ? 'text-foreground'     : '',
                ].join(' ')}
              >
                {day}
              </span>

              {/* Booking chips — no truncation; text wraps inside chip */}
              {dayBookings.map((b) => (
                <div
                  key={b.bookingId}
                  className="bg-accent/15 border border-accent/30 px-1 py-0.5 sm:px-1.5 sm:py-1"
                >
                  {isAdmin ? (
                    <>
                      {b.clientName && (
                        <p className="font-sans font-medium text-accent text-[9px] sm:text-[10px] leading-snug break-words">
                          {b.clientName}
                        </p>
                      )}
                      <p className="font-sans text-accent/70 text-[8px] sm:text-[9px] leading-snug break-words">
                        {SERVICE_LABELS[b.service] ?? b.service}
                      </p>
                    </>
                  ) : (
                    <p className="font-sans font-medium text-accent text-[9px] sm:text-[10px] leading-snug break-words">
                      {SERVICE_LABELS[b.service] ?? b.service}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {bookings.length === 0 && (
        <div className="py-12 text-center">
          <p className="font-sans text-sm text-muted-foreground">
            No bookings {isAdmin ? 'found' : 'yet'}.
            {!isAdmin && ' Start by creating your first booking!'}
          </p>
        </div>
      )}
    </div>
  )
}
