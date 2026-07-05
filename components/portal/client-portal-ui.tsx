'use client'

import { signOut } from '@/lib/auth-client'
import { sendClientMessage } from '@/app/actions/booking'
import type { Booking } from '@/lib/db/schema'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, MapPin, Clock, IndianRupee, MessageSquare,
  LogOut, ChevronRight, CheckCircle, XCircle, AlertCircle,
  Loader2, Send, Users,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

const STATUS_CONFIG = {
  pending:   { label: 'Pending Review', color: 'text-amber-600',   bg: 'bg-amber-50   border-amber-200',       Icon: AlertCircle },
  confirmed: { label: 'Confirmed',      color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200',     Icon: CheckCircle },
  completed: { label: 'Completed',      color: 'text-foreground',  bg: 'bg-secondary  border-border',          Icon: CheckCircle },
  cancelled: { label: 'Cancelled',      color: 'text-destructive', bg: 'bg-destructive/5 border-destructive/20', Icon: XCircle },
} as const

const SERVICE_LABELS: Record<string, string> = {
  wedding:    'Wedding Photography',
  prewedding: 'Pre-Wedding Photography',
  portrait:   'Portrait Session',
  fashion:    'Fashion Editorial',
  drone:      'Drone Cinematography',
  other:      'Other',
}

interface Props {
  user: { id: string; name: string; email: string; role?: string | null }
  bookings: Booking[]
}

export function ClientPortalUI({ user, bookings }: Props) {
  const router = useRouter()
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null)
  const [messageText, setMessageText] = useState('')
  const [sending, startSending] = useTransition()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
    router.push('/')
    router.refresh()
  }

  const handleSendMessage = () => {
    if (!activeBooking || !messageText.trim()) return
    startSending(async () => {
      await sendClientMessage(activeBooking.id, messageText.trim())
      setMessageText('')
      router.refresh()
    })
  }

  const stats = {
    total:     bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    pending:   bookings.filter((b) => b.status === 'pending').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
  }

  return (
    <main className="pt-20 min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-10 flex items-start justify-between gap-6 flex-wrap">
          <div>
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Client Portal</p>
            <h1 className="font-serif text-3xl md:text-4xl text-foreground font-light">
              Welcome, {user.name.split(' ')[0]}
            </h1>
            <p className="font-sans text-sm text-muted-foreground mt-1">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center gap-2 font-sans text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200 mt-2 disabled:opacity-50"
          >
            <LogOut size={14} />
            {signingOut ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Bookings', value: stats.total },
            { label: 'Confirmed',      value: stats.confirmed },
            { label: 'Pending',        value: stats.pending },
            { label: 'Completed',      value: stats.completed },
          ].map((s) => (
            <div key={s.label} className="border border-border p-5">
              <p className="font-serif text-3xl text-foreground font-light">{s.value}</p>
              <p className="font-sans text-xs text-muted-foreground tracking-[0.12em] uppercase mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {bookings.length === 0 ? (
          <div className="border border-border p-12 text-center space-y-4">
            <p className="font-serif text-2xl text-foreground font-light">No bookings yet</p>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Once you submit a booking enquiry, it will appear here and you can track its status in real time.
            </p>
            <Link
              href="/booking"
              className="inline-block mt-4 font-sans text-xs tracking-[0.18em] uppercase border border-foreground px-6 py-3 text-foreground hover:bg-foreground hover:text-background transition-all duration-200"
            >
              Make a Booking
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

            {/* Booking list */}
            <div className="lg:col-span-2 space-y-3">
              <p className="font-sans text-xs tracking-[0.18em] uppercase text-muted-foreground mb-4">Your Sessions</p>
              {bookings.map((b) => {
                const cfg = STATUS_CONFIG[b.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending
                const isActive = activeBooking?.id === b.id
                return (
                  <motion.button
                    key={b.id}
                    onClick={() => setActiveBooking(isActive ? null : b)}
                    whileHover={{ x: 2 }}
                    className={`w-full text-left border p-4 transition-all duration-200 ${
                      isActive ? 'border-foreground bg-secondary' : 'border-border hover:border-foreground/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-sans text-sm font-medium text-foreground truncate">
                          {SERVICE_LABELS[b.service] ?? b.service}
                        </p>
                        <p className="font-sans text-xs text-muted-foreground mt-0.5">{b.eventDate}</p>
                        <p className="font-sans text-xs text-muted-foreground truncate">{b.location}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 pt-0.5">
                        <span className={`font-sans text-[10px] tracking-[0.1em] uppercase ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        <ChevronRight size={12} className="text-muted-foreground" />
                      </div>
                    </div>
                  </motion.button>
                )
              })}
              <Link
                href="/booking"
                className="block text-center font-sans text-xs tracking-[0.15em] uppercase border border-dashed border-border text-muted-foreground hover:border-foreground hover:text-foreground py-3 transition-all duration-200"
              >
                + New Booking
              </Link>
            </div>

            {/* Booking detail panel */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {activeBooking ? (
                  <motion.div
                    key={activeBooking.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.25 }}
                    className="border border-border"
                  >
                    {/* Detail header */}
                    <div className="border-b border-border px-6 py-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="font-sans text-xs text-muted-foreground tracking-[0.12em] uppercase">
                          Ref #{activeBooking.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="font-serif text-lg text-foreground font-light mt-0.5">
                          {SERVICE_LABELS[activeBooking.service] ?? activeBooking.service}
                        </p>
                      </div>
                      {(() => {
                        const cfg = STATUS_CONFIG[activeBooking.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending
                        return (
                          <span className={`font-sans text-[10px] tracking-[0.1em] uppercase border px-3 py-1.5 shrink-0 ${cfg.bg} ${cfg.color}`}>
                            {cfg.label}
                          </span>
                        )
                      })()}
                    </div>

                    {/* Details grid */}
                    <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5 border-b border-border">
                      {[
                        { Icon: Calendar,       label: 'Event Date', value: activeBooking.eventDate },
                        { Icon: Clock,          label: 'Time',       value: activeBooking.eventTime ?? '—' },
                        { Icon: MapPin,         label: 'Location',   value: activeBooking.location },
                        { Icon: Clock,          label: 'Duration',   value: activeBooking.duration ?? '—' },
                        { Icon: IndianRupee,    label: 'Budget',     value: activeBooking.budget ?? '—' },
                        { Icon: Users,          label: 'Guests',     value: activeBooking.guestCount ?? '—' },
                      ].map(({ Icon, label, value }) => (
                        <div key={label} className="flex items-start gap-3">
                          <Icon size={13} className="text-muted-foreground mt-0.5 shrink-0" />
                          <div>
                            <p className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground">{label}</p>
                            <p className="font-sans text-sm text-foreground mt-0.5">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Special requests */}
                    {activeBooking.specialRequests && (
                      <div className="px-6 py-4 border-b border-border">
                        <p className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-2">Vision / Special Requests</p>
                        <p className="font-sans text-sm text-foreground leading-relaxed">{activeBooking.specialRequests}</p>
                      </div>
                    )}

                    {/* Admin notes */}
                    {activeBooking.adminNotes && (
                      <div className="px-6 py-4 border-b border-border bg-secondary">
                        <p className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-2">Note from Studio AYNSH</p>
                        <p className="font-sans text-sm text-foreground leading-relaxed">{activeBooking.adminNotes}</p>
                      </div>
                    )}

                    {/* Pricing */}
                    {activeBooking.totalAmount && (
                      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                        <div>
                          <p className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground">Total Amount</p>
                          <p className="font-serif text-xl text-foreground mt-0.5">{activeBooking.totalAmount}</p>
                        </div>
                        {activeBooking.depositPaid && (
                          <span className="font-sans text-[10px] tracking-[0.1em] uppercase text-emerald-700 border border-emerald-200 bg-emerald-50 px-3 py-1.5">
                            Deposit Paid
                          </span>
                        )}
                      </div>
                    )}

                    {/* Message box */}
                    <div className="px-6 py-5">
                      <p className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-3 flex items-center gap-2">
                        <MessageSquare size={12} />
                        Send a Message to Studio
                      </p>
                      <div className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) handleSendMessage()
                          }}
                          placeholder="Ask a question or share an update..."
                          className="flex-1 border-b border-border bg-transparent py-2 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors duration-200"
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!messageText.trim() || sending}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors duration-200 shrink-0"
                          aria-label="Send message"
                        >
                          {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border border-dashed border-border h-64 flex items-center justify-center"
                  >
                    <p className="font-sans text-sm text-muted-foreground/60">Select a booking to view details</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Quick links */}
        <div className="border-t border-border pt-8 flex flex-wrap gap-6">
          <Link href="/booking" className="font-sans text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200">New Booking</Link>
          <Link href="/portfolio" className="font-sans text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200">View Portfolio</Link>
          <Link href="/contact" className="font-sans text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200">Contact Us</Link>
        </div>
      </div>
    </main>
  )
}
