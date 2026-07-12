'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface BookingEvent {
  date: string
  service: string
  clientName?: string // For admin view
  bookingId: string
}

interface BookingsCalendarProps {
  bookings: BookingEvent[]
  isAdmin?: boolean
  onDateClick?: (date: string) => void
}

export function BookingsCalendar({ bookings, isAdmin = false, onDateClick }: BookingsCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  // Get bookings for current month
  const bookingsMap = new Map<string, BookingEvent[]>()
  bookings.forEach((booking) => {
    const bookingDate = new Date(booking.date)
    if (bookingDate.getFullYear() === year && bookingDate.getMonth() === month) {
      const dateStr = booking.date
      if (!bookingsMap.has(dateStr)) {
        bookingsMap.set(dateStr, [])
      }
      bookingsMap.get(dateStr)!.push(booking)
    }
  })

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  function goToPrevMonth() {
    setCurrentDate(new Date(year, month - 1))
  }

  function goToNextMonth() {
    setCurrentDate(new Date(year, month + 1))
  }

  // Build calendar grid
  const days: (number | null)[] = []

  // Previous month's days (greyed out)
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push(null)
  }

  // Current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  // Next month's days (greyed out)
  const remainingDays = 42 - days.length // 6 weeks × 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push(null)
  }

  // Get SERVICE_LABELS for display
  const SERVICE_LABELS: Record<string, string> = {
    wedding: 'Wedding',
    prewedding: 'Pre-Wedding',
    portrait: 'Portrait',
    fashion: 'Fashion',
    drone: 'Drone',
    other: 'Other',
  }

  return (
    <div className="w-full bg-background border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button
          onClick={goToPrevMonth}
          className="p-2 hover:bg-secondary rounded-none transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>
        <h2 className="font-serif text-lg text-foreground">
          {monthNames[month]} {year}
        </h2>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-secondary rounded-none transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 border-b border-border">
        {dayNames.map((day) => (
          <div key={day} className="px-4 py-3 text-center font-sans text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground border-r border-border last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          if (day === null) {
            return (
              <div
                key={`empty-${index}`}
                className="min-h-[80px] md:min-h-[100px] border-r border-b border-border bg-muted/30 p-2 md:p-3"
              />
            )
          }

          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayBookings = bookingsMap.get(dateStr) || []
          const cellDate = new Date(year, month, day)
          cellDate.setHours(0, 0, 0, 0)
          const isToday = cellDate.getTime() === today.getTime()
          const isPast = cellDate < today

          return (
            <motion.div
              key={dateStr}
              onClick={() => onDateClick?.(dateStr)}
              whileHover={dayBookings.length > 0 && !isPast ? { scale: 1.01 } : {}}
              className={`min-h-[80px] md:min-h-[100px] border-r border-b border-border p-2 md:p-3 flex flex-col ${
                isPast ? 'bg-muted/20' : 'bg-background hover:bg-secondary/30 transition-colors'
              } ${dayBookings.length > 0 ? 'h-auto' : ''} ${dayBookings.length > 0 && !isPast ? 'cursor-pointer' : ''}`}
            >
              {/* Date number */}
              <span className={`font-sans text-sm font-medium mb-1.5 shrink-0 ${
                isToday ? 'text-accent font-bold' : isPast ? 'text-muted-foreground/40' : 'text-foreground'
              }`}>
                {day}
              </span>

              {/* All bookings for this date — no truncation */}
              {dayBookings.length > 0 && (
                <div className="flex flex-col gap-1">
                  {dayBookings.map((booking) => (
                    <div
                      key={booking.bookingId}
                      className="bg-accent/20 border border-accent/40 px-1.5 py-1 font-sans font-medium text-accent"
                    >
                      {isAdmin ? (
                        <div className="space-y-0.5">
                          {booking.clientName && (
                            <p className="text-[10px] md:text-[11px] leading-tight truncate">
                              {booking.clientName}
                            </p>
                          )}
                          <p className="text-[9px] md:text-[10px] leading-tight opacity-70">
                            {SERVICE_LABELS[booking.service] || booking.service}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[10px] md:text-[11px] leading-tight truncate">
                          {SERVICE_LABELS[booking.service] || booking.service}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Empty state */}
      {bookings.length === 0 && (
        <div className="col-span-7 py-12 text-center">
          <p className="font-sans text-sm text-muted-foreground">
            No bookings {isAdmin ? 'found' : 'yet'}. {!isAdmin && 'Start by creating your first booking!'}
          </p>
        </div>
      )}
    </div>
  )
}
