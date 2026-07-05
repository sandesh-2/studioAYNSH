'use client'

import {
  updateBookingStatus,
  updateBookingNotes,
  updateBookingAmount,
  sendAdminMessage,
} from '@/app/actions/admin'
import { signOut } from '@/lib/auth-client'
import type { Booking, User } from '@/lib/db/schema'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar, MapPin, Clock, IndianRupee, Users, LogOut,
  ChevronRight, CheckCircle, XCircle, AlertCircle, Search,
  Loader2, Send, MessageSquare, Edit3, Save,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

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

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'] as const

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
  const [notes, setNotes] = useState('')
  const [editingNotes, setEditingNotes] = useState(false)
  const [totalAmount, setTotalAmount] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [depositPaid, setDepositPaid] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [isPending, startTransition] = useTransition()
  const [signingOut, setSigningOut] = useState(false)

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

  const handleSendMessage = () => {
    if (!activeBooking || !messageText.trim()) return
    startTransition(async () => {
      await sendAdminMessage(activeBooking.id, messageText.trim())
      setMessageText('')
    })
  }

  const filteredBookings = bookings.filter((b) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      b.clientName.toLowerCase().includes(q) ||
      b.clientEmail.toLowerCase().includes(q) ||
      b.location.toLowerCase().includes(q) ||
      b.service.includes(q)
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    return matchSearch && matchStatus
  })

  const stats = {
    total:    bookings.length,
    pending:  bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
  }

  const inputClass = 'w-full border-b border-border bg-transparent py-2 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors duration-200'
  const labelClass = 'font-sans text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-1 block'

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
              {/* Filters */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search size={13} className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search name, email, location..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-5 border-b border-border bg-transparent py-2 font-sans text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border-b border-border bg-transparent font-sans text-xs text-muted-foreground focus:outline-none py-2 cursor-pointer"
                >
                  <option value="all">All</option>
                  {STATUSES.map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                </select>
              </div>

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
                          placeholder="Add internal notes visible to the client..."
                        />
                      ) : (
                        <p className="font-sans text-sm text-foreground leading-relaxed min-h-[40px]">
                          {activeBooking.adminNotes || <span className="text-muted-foreground/50 italic">No notes added yet.</span>}
                        </p>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="px-6 py-4 border-b border-border">
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

                    {/* Message client */}
                    <div className="px-6 py-5">
                      <p className={`${labelClass} flex items-center gap-1.5 mb-3`}>
                        <MessageSquare size={11} />
                        Message Client
                      </p>
                      <div className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) handleSendMessage()
                          }}
                          placeholder="Write a message to this client..."
                          className="flex-1 border-b border-border bg-transparent py-2 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors"
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!messageText.trim() || isPending}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors shrink-0"
                          aria-label="Send message"
                        >
                          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
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
