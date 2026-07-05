'use client'

import { createBooking } from '@/app/actions/booking'
import { CalendarPicker } from './calendar-picker'
import { TimePicker } from './time-picker'
import { CustomSelect } from './custom-select'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle, Loader2 } from 'lucide-react'

interface BookingData {
  clientName: string
  clientEmail: string
  clientPhone: string
  service: string
  eventDate: string
  eventTime: string
  location: string
  duration: string
  budget: string
  guestCount: string
  shootTheme: string
  howHeard: string
  specialRequests: string
}

const SERVICES = [
  { label: 'Wedding Photography', value: 'wedding' },
  { label: 'Pre-Wedding Shoot', value: 'prewedding' },
  { label: 'Portrait Session', value: 'portrait' },
  { label: 'Fashion Editorial', value: 'fashion' },
  { label: 'Drone Cinematography', value: 'drone' },
  { label: 'Other', value: 'other' },
]

const BUDGETS = [
  { label: '₹50,000 – ₹1,00,000', value: '50k-1L' },
  { label: '₹1,00,000 – ₹2,50,000', value: '1L-2.5L' },
  { label: '₹2,50,000 – ₹5,00,000', value: '2.5L-5L' },
  { label: '₹5,00,000+', value: '5L+' },
]

const DURATIONS = [
  { label: '2 Hours', value: '2h' },
  { label: '4 Hours', value: '4h' },
  { label: 'Half Day (6 hrs)', value: '6h' },
  { label: 'Full Day (8–10 hrs)', value: '8-10h' },
  { label: 'Multi-Day', value: 'multi' },
]

const HOW_HEARD = [
  { label: 'Instagram', value: 'instagram' },
  { label: 'Google Search', value: 'google' },
  { label: 'Word of Mouth', value: 'word-of-mouth' },
  { label: 'Wedding Fair', value: 'wedding-fair' },
  { label: 'Other', value: 'other' },
]

export function BookingForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<BookingData>()

  const selectedDate = watch('eventDate')
  const selectedTime = watch('eventTime')

  const onSubmit = async (data: BookingData) => {
    setSubmitting(true)
    setServerError('')
    try {
      const result = await createBooking({
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        service: data.service,
        eventDate: data.eventDate,
        eventTime: data.eventTime,
        location: data.location,
        duration: data.duration,
        budget: data.budget,
        guestCount: data.guestCount,
        shootTheme: data.shootTheme,
        specialRequests: data.specialRequests,
        howHeard: data.howHeard,
      })
      if (result.success) {
        setSubmitted(true)
        reset()
      }
    } catch {
      setServerError('Something went wrong. Please try again or contact us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full border-b border-border bg-transparent py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors duration-200'
  const labelClass = 'block font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground mb-2'
  const sectionLabel = 'font-sans text-xs tracking-[0.18em] uppercase text-accent'

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center py-24 gap-6"
      >
        <CheckCircle size={48} className="text-accent" />
        <h2 className="font-serif text-foreground text-3xl font-light">Booking Received</h2>
        <p className="font-sans text-muted-foreground text-base max-w-sm leading-relaxed">
          Thank you for choosing Studio AYNSH. A confirmation email is on its way. We&apos;ll be in touch within 24 hours to confirm your session.
        </p>
        <p className="font-sans text-xs text-muted-foreground/60 mt-2">
          Track your booking anytime in the{' '}
          <a href="/portal" className="text-foreground underline underline-offset-4">Client Portal</a>.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 font-sans text-xs tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          Submit another enquiry
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

      {/* 01 Personal Details */}
      <div className="space-y-6">
        <p className={sectionLabel}>01 — Your Details</p>
        {([
          { label: 'Full Name', name: 'clientName' as const, type: 'text', placeholder: 'Your full name', rules: { required: 'Required', minLength: { value: 2, message: 'Name is too short' } } },
          { label: 'Email Address', name: 'clientEmail' as const, type: 'email', placeholder: 'you@example.com', rules: { required: 'Required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } } },
          { label: 'Phone Number', name: 'clientPhone' as const, type: 'tel', placeholder: '+91 00000 00000', rules: { required: 'Required', minLength: { value: 10, message: 'Enter a valid number' } } },
        ] as const).map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className={labelClass}>{field.label}</label>
            <input id={field.name} type={field.type} placeholder={field.placeholder} {...register(field.name, field.rules)} className={inputClass} />
            {errors[field.name] && <p className="mt-1 font-sans text-xs text-destructive">{errors[field.name]?.message}</p>}
          </div>
        ))}
      </div>

      {/* 02 Session Details */}
      <div className="space-y-6">
        <p className={sectionLabel}>02 — Session Details</p>
        <div>
          <label className={labelClass}>Photography Service</label>
          <CustomSelect options={SERVICES} value={watch('service')} onChange={(v) => setValue('service', v)} placeholder="Select a service" />
          {errors.service && <p className="mt-1 font-sans text-xs text-destructive">Please select a service</p>}
        </div>
        <div>
          <label className={labelClass}>Event / Shoot Location</label>
          <input type="text" placeholder="City, venue, or region" {...register('location', { required: 'Required', minLength: { value: 2, message: 'Too short' } })} className={inputClass} />
          {errors.location && <p className="mt-1 font-sans text-xs text-destructive">{errors.location.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Shoot Theme / Concept (optional)</label>
          <input type="text" placeholder="e.g. Royal, Candid, Moody, Pastel" {...register('shootTheme')} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Guest Count (optional)</label>
          <input type="text" placeholder="Approx. number of guests" {...register('guestCount')} className={inputClass} />
        </div>
      </div>

      {/* 03 Date & Time */}
      <div className="space-y-6">
        <p className={sectionLabel}>03 — Date & Time</p>
        <div>
          <label className={labelClass}>Preferred Date</label>
          <button type="button" onClick={() => setShowDatePicker(!showDatePicker)} className={`${inputClass} text-left`}>
            {selectedDate ? new Date(selectedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Select a date'}
          </button>
          {showDatePicker && (
            <div className="mt-4 p-4 border border-border bg-secondary">
              <CalendarPicker value={selectedDate} onChange={(d) => { setValue('eventDate', d); setShowDatePicker(false) }} />
            </div>
          )}
          {errors.eventDate && <p className="mt-1 font-sans text-xs text-destructive">Please select a date</p>}
        </div>
        <div>
          <label className={labelClass}>Preferred Time</label>
          <button type="button" onClick={() => setShowTimePicker(!showTimePicker)} className={`${inputClass} text-left`}>
            {selectedTime || 'Select a time'}
          </button>
          {showTimePicker && (
            <div className="mt-4 p-4 border border-border bg-secondary">
              <TimePicker value={selectedTime} onChange={(t) => { setValue('eventTime', t); setShowTimePicker(false) }} />
            </div>
          )}
        </div>
        <div>
          <label className={labelClass}>Session Duration</label>
          <CustomSelect options={DURATIONS} value={watch('duration')} onChange={(v) => setValue('duration', v)} placeholder="Select duration" />
        </div>
      </div>

      {/* 04 Budget & Discovery */}
      <div className="space-y-6">
        <p className={sectionLabel}>04 — Budget & Discovery</p>
        <div>
          <label className={labelClass}>Budget Range</label>
          <CustomSelect options={BUDGETS} value={watch('budget')} onChange={(v) => setValue('budget', v)} placeholder="Select a budget range" />
        </div>
        <div>
          <label className={labelClass}>How Did You Hear About Us?</label>
          <CustomSelect options={HOW_HEARD} value={watch('howHeard')} onChange={(v) => setValue('howHeard', v)} placeholder="Select an option" />
        </div>
      </div>

      {/* 05 Special Requests */}
      <div className="space-y-6">
        <p className={sectionLabel}>05 — Anything Else?</p>
        <div>
          <label htmlFor="specialRequests" className={labelClass}>Special Requests / Your Vision</label>
          <textarea
            id="specialRequests"
            placeholder="Tell us about your vision, special requests, references, or questions..."
            {...register('specialRequests')}
            rows={5}
            className="w-full border border-border bg-transparent px-4 py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors duration-200 resize-none"
          />
        </div>
      </div>

      {serverError && (
        <p className="font-sans text-xs text-destructive bg-destructive/5 border border-destructive/20 px-4 py-3">{serverError}</p>
      )}

      <motion.button
        type="submit"
        disabled={submitting}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-foreground text-background py-4 font-sans font-medium tracking-[0.18em] uppercase text-xs hover:bg-accent hover:text-foreground disabled:opacity-50 transition-all duration-200"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={14} className="animate-spin" />
            Submitting Enquiry...
          </span>
        ) : (
          'Request Booking'
        )}
      </motion.button>

      <p className="font-sans text-xs text-muted-foreground text-center">
        A confirmation email will be sent immediately. We respond to all enquiries within 24 hours.
      </p>
    </form>
  )
}
