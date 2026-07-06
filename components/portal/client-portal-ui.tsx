'use client'

import { signOut } from '@/lib/auth-client'
import { PROGRESS_STAGES, SERVICE_LABELS, type FullBooking } from '@/lib/db/schema'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, MapPin, Clock, IndianRupee,
  LogOut, ChevronRight, CheckCircle, XCircle, AlertCircle,
  Users, SlidersHorizontal, ArrowUpDown, ChevronDown,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

const STATUS_CONFIG = {
  pending:   { label: 'Pending Review', color: 'text-amber-600',   bg: 'bg-amber-50   border-amber-200',         Icon: AlertCircle },
  confirmed: { label: 'Confirmed',      color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200',       Icon: CheckCircle },
  completed: { label: 'Completed',      color: 'text-foreground',  bg: 'bg-secondary  border-border',            Icon: CheckCircle },
  cancelled: { label: 'Cancelled',      color: 'text-destructive', bg: 'bg-destructive/5 border-destructive/20', Icon: XCircle },
} as const

const ALL_SERVICES = Object.keys(SERVICE_LABELS)
type SortMode = 'newest' | 'oldest' | 'custom'
const sortLabels: Record<SortMode, string> = { newest: 'Newest First', oldest: 'Oldest First', custom: 'Custom Range' }

interface Props {
  user: { id: string; name: string; email: string; role?: string | null }
  bookings: FullBooking[]
}

export function ClientPortalUI({ user, bookings: initial }: Props) {
  const router = useRouter()
  const [bookings]                = useState(initial)
  const [activeBooking, setActiveBooking] = useState<FullBooking | null>(null)
  const [signingOut, setSigningOut] = useState(false)

  // Sort & filter state
  const [sortMode, setSortMode]         = useState<SortMode>('newest')
  const [serviceFilter, setServiceFilter] = useState<string>('all')
  const [dateFrom, setDateFrom]         = useState('')
  const [dateTo, setDateTo]             = useState('')
  const [showSortMenu, setShowSortMenu]   = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const sortRef   = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current   && !sortRef.current.contains(e.target as Node))   setShowSortMenu(false)
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setShowFilterMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
    router.push('/')
    router.refresh()
  }

  const filteredBookings = bookings
    .filter((b) => {
      const matchService = serviceFilter === 'all' || b.service === serviceFilter
      let matchDate = true
      if (sortMode === 'custom' && (dateFrom || dateTo)) {
        const created = new Date(b.createdAt).getTime()
        if (dateFrom && created < new Date(dateFrom).getTime()) matchDate = false
        if (dateTo   && created > new Date(dateTo + 'T23:59:59').getTime()) matchDate = false
      }
      return matchService && matchDate
    })
    .sort((a, b) => {
      if (sortMode === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const stats = {
    total:     bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    pending:   bookings.filter((b) => b.status === 'pending').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
  }

  const labelClass = 'font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground'

  // Progress helpers
  const activeProgressIdx = PROGRESS_STAGES.findIndex(
    (s) => s.key === (activeBooking?.progressStage ?? 'enquiry_received'),
  )

  // Latest studio note to show in the portal detail
  const latestNote = activeBooking?.notes?.[0] ?? null

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
              <p className="font-sans text-xs tracking-[0.18em] uppercase text-muted-foreground">Your Sessions</p>

              {/* Sort + Filter row */}
              <div className="flex gap-2">
                <div ref={sortRef} className="relative flex-1">
                  <button
                    onClick={() => { setShowSortMenu((v) => !v); setShowFilterMenu(false) }}
                    className="w-full flex items-center justify-between gap-1.5 border border-border px-3 py-2 font-sans text-[11px] tracking-[0.08em] uppercase text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors duration-200"
                  >
                    <span className="flex items-center gap-1.5"><ArrowUpDown size={11} />{sortLabels[sortMode]}</span>
                    <ChevronDown size={11} className={`transition-transform duration-200 shrink-0 ${showSortMenu ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showSortMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 z-30 mt-1 border border-border bg-background shadow-sm"
                      >
                        {(['newest', 'oldest', 'custom'] as SortMode[]).map((m) => (
                          <button key={m} onClick={() => { setSortMode(m); setShowSortMenu(false) }}
                            className={`w-full text-left px-3 py-2.5 font-sans text-[11px] tracking-[0.08em] uppercase transition-colors duration-150 ${
                              sortMode === m ? 'text-foreground bg-secondary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                            }`}
                          >
                            {sortLabels[m]}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div ref={filterRef} className="relative flex-1">
                  <button
                    onClick={() => { setShowFilterMenu((v) => !v); setShowSortMenu(false) }}
                    className="w-full flex items-center justify-between gap-1.5 border border-border px-3 py-2 font-sans text-[11px] tracking-[0.08em] uppercase text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors duration-200"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <SlidersHorizontal size={11} className="shrink-0" />
                      <span className="truncate">{serviceFilter === 'all' ? 'All Services' : SERVICE_LABELS[serviceFilter]?.split(' ')[0]}</span>
                    </span>
                    <ChevronDown size={11} className={`transition-transform duration-200 shrink-0 ${showFilterMenu ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showFilterMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 z-30 mt-1 border border-border bg-background shadow-sm"
                      >
                        <button onClick={() => { setServiceFilter('all'); setShowFilterMenu(false) }}
                          className={`w-full text-left px-3 py-2.5 font-sans text-[11px] tracking-[0.08em] uppercase transition-colors duration-150 ${serviceFilter === 'all' ? 'text-foreground bg-secondary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
                        >
                          All Services
                        </button>
                        {ALL_SERVICES.map((svc) => (
                          <button key={svc} onClick={() => { setServiceFilter(svc); setShowFilterMenu(false) }}
                            className={`w-full text-left px-3 py-2.5 font-sans text-[11px] tracking-[0.08em] uppercase transition-colors duration-150 ${serviceFilter === svc ? 'text-foreground bg-secondary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
                          >
                            {SERVICE_LABELS[svc]}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Custom date range */}
              <AnimatePresence>
                {sortMode === 'custom' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-3 pt-1">
                      <div className="flex-1">
                        <label className={`${labelClass} mb-1 block`}>From</label>
                        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                          className="w-full border-b border-border bg-transparent py-1.5 font-sans text-xs text-foreground focus:border-foreground focus:outline-none transition-colors" />
                      </div>
                      <div className="flex-1">
                        <label className={`${labelClass} mb-1 block`}>To</label>
                        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                          className="w-full border-b border-border bg-transparent py-1.5 font-sans text-xs text-foreground focus:border-foreground focus:outline-none transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Booking cards */}
              {filteredBookings.length === 0 ? (
                <p className="font-sans text-sm text-muted-foreground text-center py-6">No bookings match your filter.</p>
              ) : (
                filteredBookings.map((b) => {
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
                          <p className="font-sans text-xs text-muted-foreground mt-0.5">{b.event?.eventDate ?? '—'}</p>
                          <p className="font-sans text-xs text-muted-foreground truncate">{b.event?.location ?? '—'}</p>
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
                })
              )}

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
                        <p className={`${labelClass}`}>
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

                    {/* Progress Tracker */}
                    <div className="border-b border-border px-6 py-5 bg-secondary/30">
                      <p className={`${labelClass} mb-4`}>Your Progress</p>
                      <div className="relative">
                        <div className="absolute left-[10px] top-3 bottom-3 w-px bg-border" aria-hidden="true" />
                        <ol className="space-y-0.5">
                          {PROGRESS_STAGES.map((stage, idx) => {
                            const isDone    = idx <= activeProgressIdx
                            const isCurrent = idx === activeProgressIdx
                            return (
                              <li key={stage.key} className="relative flex items-start gap-4 py-2">
                                <span
                                  className={`relative z-10 mt-0.5 w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                                    isCurrent
                                      ? 'border-foreground bg-foreground'
                                      : isDone
                                      ? 'border-accent bg-accent'
                                      : 'border-border bg-background'
                                  }`}
                                >
                                  {isDone && !isCurrent && <CheckCircle size={11} className="text-background" />}
                                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-background" />}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className={`font-sans text-xs font-medium leading-none ${
                                    isCurrent ? 'text-foreground' : isDone ? 'text-accent' : 'text-muted-foreground/50'
                                  }`}>
                                    {stage.label}
                                  </p>
                                  {isCurrent && (
                                    <motion.p
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      className="font-sans text-[11px] text-muted-foreground mt-1 leading-relaxed"
                                    >
                                      {stage.description}
                                    </motion.p>
                                  )}
                                </div>
                                {isCurrent && (
                                  <span className="shrink-0 font-sans text-[10px] tracking-[0.08em] uppercase text-accent border border-accent/30 px-2 py-0.5">
                                    Current
                                  </span>
                                )}
                              </li>
                            )
                          })}
                        </ol>
                      </div>
                    </div>

                    {/* Details grid — from booking_event */}
                    <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5 border-b border-border">
                      {[
                        { Icon: Calendar,    label: 'Event Date', value: activeBooking.event?.eventDate ?? '—' },
                        { Icon: Clock,       label: 'Time',       value: activeBooking.event?.eventTime ?? '—' },
                        { Icon: MapPin,      label: 'Location',   value: activeBooking.event?.location  ?? '—' },
                        { Icon: Clock,       label: 'Duration',   value: activeBooking.event?.duration  ?? '—' },
                        { Icon: IndianRupee, label: 'Budget Hint', value: activeBooking.financials?.paymentNotes ?? '—' },
                        { Icon: Users,       label: 'Guests',     value: activeBooking.event?.guestCount?.toString() ?? '—' },
                      ].map(({ Icon, label, value }) => (
                        <div key={label} className="flex items-start gap-3">
                          <Icon size={13} className="text-muted-foreground mt-0.5 shrink-0" />
                          <div>
                            <p className={`${labelClass} mb-0.5`}>{label}</p>
                            <p className="font-sans text-sm text-foreground mt-0.5">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Special requests */}
                    {activeBooking.event?.specialRequests && (
                      <div className="px-6 py-4 border-b border-border">
                        <p className={`${labelClass} mb-2`}>Vision / Special Requests</p>
                        <p className="font-sans text-sm text-foreground leading-relaxed">{activeBooking.event.specialRequests}</p>
                      </div>
                    )}

                    {/* Latest note from studio */}
                    {latestNote && (
                      <div className="px-6 py-4 border-b border-border bg-secondary">
                        <p className={`${labelClass} mb-2`}>Note from Studio AYNSH</p>
                        <p className="font-sans text-sm text-foreground leading-relaxed">{latestNote.content}</p>
                        <p className="font-sans text-[10px] text-muted-foreground mt-1">
                          {new Date(latestNote.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                        </p>
                      </div>
                    )}

                    {/* Pricing — from booking_financials */}
                    {activeBooking.financials?.totalAmount && (
                      <div className="px-6 py-4 flex items-center justify-between">
                        <div>
                          <p className={`${labelClass} mb-1`}>Total Amount</p>
                          <p className="font-serif text-xl text-foreground">
                            ₹{parseFloat(activeBooking.financials.totalAmount).toLocaleString('en-IN')}
                          </p>
                          {activeBooking.financials.depositAmount && (
                            <p className="font-sans text-xs text-muted-foreground mt-0.5">
                              Deposit: ₹{parseFloat(activeBooking.financials.depositAmount).toLocaleString('en-IN')}
                            </p>
                          )}
                        </div>
                        {activeBooking.financials.depositPaid && (
                          <span className="font-sans text-[10px] tracking-[0.1em] uppercase text-emerald-700 border border-emerald-200 bg-emerald-50 px-3 py-1.5">
                            Deposit Paid
                          </span>
                        )}
                      </div>
                    )}
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
          <Link href="/booking"   className="font-sans text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200">New Booking</Link>
          <Link href="/portfolio" className="font-sans text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200">View Portfolio</Link>
          <Link href="/contact"   className="font-sans text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200">Contact Us</Link>
        </div>
      </div>
    </main>
  )
}
