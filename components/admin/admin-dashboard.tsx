'use client'

import {
  updateBookingStatus,
  updateBookingNotes,
  updateBookingAmount,
  updateBookingProgress,
} from '@/app/actions/admin'
import { signOut } from '@/lib/auth-client'
import { PROGRESS_STAGES, type ProgressStageKey } from '@/lib/db/schema'
import type { Booking, User } from '@/lib/db/schema'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, MapPin, Clock, IndianRupee, Users, LogOut,
  ChevronRight, CheckCircle, XCircle, AlertCircle, Search,
  Loader2, Edit3, Save, SlidersHorizontal, ArrowUpDown, ChevronDown,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition, useRef, useEffect } from 'react'

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: 'text-amber-600',   bg: 'bg-amber-50   border-amber-200',         Icon: AlertCircle },
  confirmed: { label: 'Confirmed', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200',       Icon: CheckCircle },
  completed: { label: 'Completed', color: 'text-foreground',  bg: 'bg-secondary  border-border',            Icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-destructive', bg: 'bg-destructive/5 border-destructive/20', Icon: XCircle },
} as const

const SERVICE_LABELS: Record<string, string> = {
  wedding: 'Wedding', prewedding: 'Pre-Wedding', portrait: 'Portrait',
  fashion: 'Fashion', drone: 'Drone', other: 'Other',
}

const ALL_SERVICES = ['wedding', 'prewedding', 'portrait', 'fashion', 'drone', 'other']
const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'] as const

type SortMode = 'newest' | 'oldest' | 'custom'

interface Props {
  bookings: Booking[]
  clients: User[]
  adminName: string
}

type Tab = 'bookings' | 'clients'

export function AdminDashboard({ bookings: initial, clients, adminName }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('bookings')
  const [bookings, setBookings] = useState(initial)
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [serviceFilter, setServiceFilter] = useState<string>('all')
  const [sortMode, setSortMode] = useState<SortMode>('newest')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  const [notes, setNotes] = useState('')
  const [editingNotes, setEditingNotes] = useState(false)
  const [totalAmount, setTotalAmount] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [depositPaid, setDepositPaid] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [signingOut, setSigningOut] = useState(false)

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setShowSortMenu(false)
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

  const openBooking = (b: Booking) => {
    setActiveBooking(b)
    setNotes(b.adminNotes ?? '')
    setTotalAmount(b.totalAmount ?? '')
    setDepositAmount(b.depositAmount ?? '')
    setDepositPaid(b.depositPaid ?? false)
    setEditingNotes(false)
  }

  const handleStatusChange = (status: typeof STATUSES[number]) => {
    if (!activeBooking) return
    startTransition(async () => {
      await updateBookingStatus(activeBooking.id, status)
      setBookings((prev) => prev.map((b) => b.id === activeBooking.id ? { ...b, status } : b))
      setActiveBooking((prev) => prev ? { ...prev, status } : null)
      router.refresh()
    })
  }

  const handleProgressChange = (progressStage: ProgressStageKey) => {
    if (!activeBooking) return
    startTransition(async () => {
      await updateBookingProgress(activeBooking.id, progressStage)
      setBookings((prev) => prev.map((b) => b.id === activeBooking.id ? { ...b, progressStage } : b))
      setActiveBooking((prev) => prev ? { ...prev, progressStage } : null)
    })
  }

  const handleSaveNotes = () => {
    if (!activeBooking) return
    startTransition(async () => {
      await updateBookingNotes(activeBooking.id, notes)
      setBookings((prev) => prev.map((b) => b.id === activeBooking.id ? { ...b, adminNotes: notes } : b))
      setActiveBooking((prev) => prev ? { ...prev, adminNotes: notes } : null)
      setEditingNotes(false)
    })
  }

  const handleSaveAmount = () => {
    if (!activeBooking) return
    startTransition(async () => {
      await updateBookingAmount(activeBooking.id, totalAmount, depositAmount, depositPaid)
      setBookings((prev) => prev.map((b) => b.id === activeBooking.id ? { ...b, totalAmount, depositAmount, depositPaid } : b))
      setActiveBooking((prev) => prev ? { ...prev, totalAmount, depositAmount, depositPaid } : null)
    })
  }

  const filteredBookings = bookings
    .filter((b) => {
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        b.clientName.toLowerCase().includes(q) ||
        b.clientEmail.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        b.service.includes(q)
      const matchStatus = statusFilter === 'all' || b.status === statusFilter
      const matchService = serviceFilter === 'all' || b.service === serviceFilter
      let matchDate = true
      if (sortMode === 'custom' && (dateFrom || dateTo)) {
        const created = new Date(b.createdAt).getTime()
        if (dateFrom && created < new Date(dateFrom).getTime()) matchDate = false
        if (dateTo && created > new Date(dateTo + 'T23:59:59').getTime()) matchDate = false
      }
      return matchSearch && matchStatus && matchService && matchDate
    })
    .sort((a, b) => {
      if (sortMode === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const stats = {
    total:     bookings.length,
    pending:   bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
  }

  const inputClass = 'w-full border-b border-border bg-transparent py-2 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors duration-200'
  const labelClass = 'font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-1 block'
  const sortLabels: Record<SortMode, string> = { newest: 'Newest First', oldest: 'Oldest First', custom: 'Custom Range' }

  const currentProgressIdx = PROGRESS_STAGES.findIndex((s) => s.key === (activeBooking?.progressStage ?? 'enquiry_received'))

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-background sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-serif text-base text-foreground tracking-widest">STUDIO AYNSH</Link>
            <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground border border-border px-2 py-0.5">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-sans text-xs text-muted-foreground hidden sm:block">{adminName}</span>
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center gap-1.5 font-sans text-xs tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200 disabled:opacity-50"
            >
              <LogOut size={13} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Bookings', value: stats.total },
            { label: 'Pending',        value: stats.pending },
            { label: 'Confirmed',      value: stats.confirmed },
            { label: 'Completed',      value: stats.completed },
          ].map((s) => (
            <div key={s.label} className="border border-border p-5">
              <p className="font-serif text-3xl text-foreground font-light">{s.value}</p>
              <p className="font-sans text-xs text-muted-foreground tracking-[0.12em] uppercase mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {(['bookings', 'clients'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`font-sans text-xs tracking-[0.15em] uppercase px-6 py-3 border-b-2 transition-all duration-200 capitalize ${
                tab === t ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Bookings tab */}
        {tab === 'bookings' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            {/* List */}
            <div className="lg:col-span-2 space-y-3">

              {/* Search row */}
              <div className="relative">
                <Search size={13} className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search name, email, location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-5 border-b border-border bg-transparent py-2 font-sans text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors"
                />
              </div>

              {/* Sort + Filter row */}
              <div className="flex gap-2">
                {/* Sort By */}
                <div ref={sortRef} className="relative flex-1">
                  <button
                    onClick={() => { setShowSortMenu((v) => !v); setShowFilterMenu(false) }}
                    className="w-full flex items-center justify-between gap-2 border border-border px-3 py-2 font-sans text-[11px] tracking-[0.1em] uppercase text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors duration-200"
                  >
                    <span className="flex items-center gap-1.5"><ArrowUpDown size={11} />{sortLabels[sortMode]}</span>
                    <ChevronDown size={11} className={`transition-transform duration-200 ${showSortMenu ? 'rotate-180' : ''}`} />
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
                          <button
                            key={m}
                            onClick={() => { setSortMode(m); setShowSortMenu(false) }}
                            className={`w-full text-left px-3 py-2.5 font-sans text-[11px] tracking-[0.1em] uppercase transition-colors duration-150 ${
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

                {/* Filter */}
                <div ref={filterRef} className="relative flex-1">
                  <button
                    onClick={() => { setShowFilterMenu((v) => !v); setShowSortMenu(false) }}
                    className="w-full flex items-center justify-between gap-2 border border-border px-3 py-2 font-sans text-[11px] tracking-[0.1em] uppercase text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors duration-200"
                  >
                    <span className="flex items-center gap-1.5"><SlidersHorizontal size={11} />{serviceFilter === 'all' ? 'All Services' : SERVICE_LABELS[serviceFilter]}</span>
                    <ChevronDown size={11} className={`transition-transform duration-200 ${showFilterMenu ? 'rotate-180' : ''}`} />
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
                        <button
                          onClick={() => { setServiceFilter('all'); setShowFilterMenu(false) }}
                          className={`w-full text-left px-3 py-2.5 font-sans text-[11px] tracking-[0.1em] uppercase transition-colors duration-150 ${
                            serviceFilter === 'all' ? 'text-foreground bg-secondary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                          }`}
                        >
                          All Services
                        </button>
                        {ALL_SERVICES.map((svc) => (
                          <button
                            key={svc}
                            onClick={() => { setServiceFilter(svc); setShowFilterMenu(false) }}
                            className={`w-full text-left px-3 py-2.5 font-sans text-[11px] tracking-[0.1em] uppercase transition-colors duration-150 ${
                              serviceFilter === svc ? 'text-foreground bg-secondary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                            }`}
                          >
                            {SERVICE_LABELS[svc]}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Status filter pills */}
              <div className="flex gap-1.5 flex-wrap">
                {(['all', ...STATUSES] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`font-sans text-[10px] tracking-[0.1em] uppercase border px-2.5 py-1 transition-all duration-150 ${
                      statusFilter === s
                        ? 'border-foreground text-foreground bg-secondary'
                        : 'border-border text-muted-foreground hover:border-foreground/40'
                    }`}
                  >
                    {s === 'all' ? 'All' : STATUS_CONFIG[s].label}
                  </button>
                ))}
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
                        <label className={labelClass}>From</label>
                        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                          className="w-full border-b border-border bg-transparent py-1.5 font-sans text-xs text-foreground focus:border-foreground focus:outline-none transition-colors" />
                      </div>
                      <div className="flex-1">
                        <label className={labelClass}>To</label>
                        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                          className="w-full border-b border-border bg-transparent py-1.5 font-sans text-xs text-foreground focus:border-foreground focus:outline-none transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Booking list */}
              {filteredBookings.length === 0 ? (
                <p className="font-sans text-sm text-muted-foreground py-8 text-center">No bookings found.</p>
              ) : (
                filteredBookings.map((b) => {
                  const cfg = STATUS_CONFIG[b.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending
                  const isActive = activeBooking?.id === b.id
                  return (
                    <motion.button
                      key={b.id}
                      onClick={() => openBooking(b)}
                      whileHover={{ x: 2 }}
                      className={`w-full text-left border p-4 transition-all duration-200 ${
                        isActive ? 'border-foreground bg-secondary' : 'border-border hover:border-foreground/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-sans text-sm font-medium text-foreground truncate">{b.clientName}</p>
                          <p className="font-sans text-xs text-muted-foreground truncate">{b.clientEmail}</p>
                          <p className="font-sans text-xs text-muted-foreground mt-0.5">
                            {SERVICE_LABELS[b.service] ?? b.service} &bull; {b.eventDate}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 pt-0.5">
                          <span className={`font-sans text-[10px] tracking-[0.08em] uppercase ${cfg.color}`}>{cfg.label}</span>
                          <ChevronRight size={12} className="text-muted-foreground" />
                        </div>
                      </div>
                    </motion.button>
                  )
                })
              )}
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {activeBooking ? (
                  <motion.div
                    key={activeBooking.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                    className="border border-border"
                  >
                    {/* Header */}
                    <div className="border-b border-border px-6 py-4">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <p className="font-sans text-xs text-muted-foreground tracking-[0.12em] uppercase">
                            Ref #{activeBooking.id.slice(0, 8).toUpperCase()}
                          </p>
                          <p className="font-serif text-xl text-foreground font-light mt-0.5">{activeBooking.clientName}</p>
                          <p className="font-sans text-xs text-muted-foreground">{activeBooking.clientEmail} &bull; {activeBooking.clientPhone}</p>
                        </div>
                        {/* Status selector */}
                        <div className="flex flex-wrap gap-1.5">
                          {STATUSES.map((s) => {
                            const cfg = STATUS_CONFIG[s]
                            const isSelected = activeBooking.status === s
                            return (
                              <button
                                key={s}
                                onClick={() => handleStatusChange(s)}
                                disabled={isPending}
                                className={`font-sans text-[10px] tracking-[0.1em] uppercase border px-2.5 py-1 transition-all duration-150 ${
                                  isSelected ? `${cfg.bg} ${cfg.color}` : 'border-border text-muted-foreground hover:border-foreground/40'
                                }`}
                              >
                                {cfg.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Progress Stage Manager */}
                    <div className="border-b border-border px-6 py-5">
                      <p className={`${labelClass} mb-4`}>Progress Stage</p>
                      <div className="relative">
                        {/* Connecting line */}
                        <div className="absolute left-[11px] top-3 bottom-3 w-px bg-border" aria-hidden="true" />
                        <div className="space-y-1">
                          {PROGRESS_STAGES.map((stage, idx) => {
                            const isDone = idx <= currentProgressIdx
                            const isCurrent = idx === currentProgressIdx
                            return (
                              <button
                                key={stage.key}
                                onClick={() => handleProgressChange(stage.key as ProgressStageKey)}
                                disabled={isPending}
                                className={`relative flex items-center gap-3 w-full text-left px-0 py-2 group transition-opacity duration-150 ${isPending ? 'opacity-50' : ''}`}
                              >
                                {/* Dot */}
                                <span className={`relative z-10 w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                                  isCurrent
                                    ? 'border-foreground bg-foreground'
                                    : isDone
                                    ? 'border-accent bg-accent'
                                    : 'border-border bg-background group-hover:border-foreground/40'
                                }`}>
                                  {isDone && !isCurrent && <CheckCircle size={12} className="text-background" />}
                                  {isCurrent && <span className="w-2 h-2 rounded-full bg-background" />}
                                </span>
                                <div className="min-w-0">
                                  <p className={`font-sans text-xs font-medium transition-colors duration-150 ${
                                    isCurrent ? 'text-foreground' : isDone ? 'text-accent' : 'text-muted-foreground group-hover:text-foreground/70'
                                  }`}>
                                    {stage.label}
                                  </p>
                                  {isCurrent && (
                                    <p className="font-sans text-[11px] text-muted-foreground mt-0.5 leading-snug">{stage.description}</p>
                                  )}
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Booking info grid */}
                    <div className="px-6 py-5 grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-border">
                      {[
                        { Icon: Calendar,    label: 'Date',     value: activeBooking.eventDate },
                        { Icon: Clock,       label: 'Time',     value: activeBooking.eventTime ?? '—' },
                        { Icon: MapPin,      label: 'Location', value: activeBooking.location },
                        { Icon: Clock,       label: 'Duration', value: activeBooking.duration ?? '—' },
                        { Icon: IndianRupee, label: 'Budget',   value: activeBooking.budget ?? '—' },
                        { Icon: Users,       label: 'Guests',   value: activeBooking.guestCount ?? '—' },
                      ].map(({ Icon, label, value }) => (
                        <div key={label} className="flex items-start gap-2">
                          <Icon size={12} className="text-muted-foreground mt-0.5 shrink-0" />
                          <div>
                            <p className={labelClass}>{label}</p>
                            <p className="font-sans text-sm text-foreground">{value}</p>
                          </div>
                        </div>
                      ))}
                      <div>
                        <p className={labelClass}>Service</p>
                        <p className="font-sans text-sm text-foreground">{SERVICE_LABELS[activeBooking.service] ?? activeBooking.service}</p>
                      </div>
                      <div>
                        <p className={labelClass}>How Heard</p>
                        <p className="font-sans text-sm text-foreground">{activeBooking.howHeard ?? '—'}</p>
                      </div>
                      <div>
                        <p className={labelClass}>Theme</p>
                        <p className="font-sans text-sm text-foreground">{activeBooking.shootTheme ?? '—'}</p>
                      </div>
                    </div>

                    {/* Client vision */}
                    {activeBooking.specialRequests && (
                      <div className="px-6 py-4 border-b border-border">
                        <p className={labelClass}>Client Vision / Special Requests</p>
                        <p className="font-sans text-sm text-foreground leading-relaxed">{activeBooking.specialRequests}</p>
                      </div>
                    )}

                    {/* Admin notes */}
                    <div className="px-6 py-4 border-b border-border">
                      <div className="flex items-center justify-between mb-2">
                        <p className={labelClass}>Admin Notes</p>
                        <button
                          onClick={() => editingNotes ? handleSaveNotes() : setEditingNotes(true)}
                          disabled={isPending}
                          className="flex items-center gap-1 font-sans text-[10px] tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                        >
                          {editingNotes ? <><Save size={11} /> Save</> : <><Edit3 size={11} /> Edit</>}
                        </button>
                      </div>
                      {editingNotes ? (
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          className="w-full border border-border bg-transparent px-3 py-2 font-sans text-sm text-foreground focus:border-foreground focus:outline-none transition-colors resize-none"
                          placeholder="Add internal notes..."
                        />
                      ) : (
                        <p className="font-sans text-sm text-foreground leading-relaxed min-h-[40px]">
                          {activeBooking.adminNotes || <span className="text-muted-foreground/50 italic">No notes added yet.</span>}
                        </p>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="px-6 py-5">
                      <p className={`${labelClass} mb-3`}>Pricing</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Total Amount</label>
                          <input type="text" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} placeholder="e.g. ₹1,20,000" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Deposit Amount</label>
                          <input type="text" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="e.g. ₹30,000" className={inputClass} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={depositPaid}
                            onChange={(e) => setDepositPaid(e.target.checked)}
                            className="accent-foreground"
                          />
                          <span className="font-sans text-xs text-muted-foreground">Deposit Paid</span>
                        </label>
                        <button
                          onClick={handleSaveAmount}
                          disabled={isPending}
                          className="font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 flex items-center gap-1"
                        >
                          {isPending ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
                          Save Pricing
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
                    <p className="font-sans text-sm text-muted-foreground/60">Select a booking to manage</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Clients tab */}
        {tab === 'clients' && (
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-4 text-[10px] font-sans tracking-[0.12em] uppercase text-muted-foreground border-b border-border pb-2">
              <span>Name</span><span>Email</span><span>Role</span><span>Joined</span>
            </div>
            {clients.length === 0 && (
              <p className="font-sans text-sm text-muted-foreground py-8 text-center">No clients yet.</p>
            )}
            {clients.map((c) => (
              <div key={c.id} className="grid grid-cols-4 gap-4 border border-border p-4 items-center">
                <p className="font-sans text-sm text-foreground truncate">{c.name}</p>
                <p className="font-sans text-xs text-muted-foreground truncate">{c.email}</p>
                <span className={`font-sans text-[10px] tracking-[0.1em] uppercase border px-2 py-0.5 w-fit ${
                  c.role === 'admin' ? 'border-foreground text-foreground bg-foreground/5' : 'border-border text-muted-foreground'
                }`}>
                  {c.role ?? 'client'}
                </span>
                <p className="font-sans text-xs text-muted-foreground">
                  {new Date(c.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
