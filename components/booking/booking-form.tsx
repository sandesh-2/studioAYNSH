'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CheckCircle } from 'lucide-react'

const bookingSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  service: z.string().min(1, 'Please select a service'),
  date: z.string().min(1, 'Please select a date'),
  location: z.string().min(2, 'Please enter a location'),
  budget: z.string().min(1, 'Please select a budget range'),
  message: z.string().optional(),
})

type BookingData = z.infer<typeof bookingSchema>

const services = [
  'Wedding Photography',
  'Pre-Wedding Photography',
  'Portrait Photography',
  'Fashion Photography',
  'Drone Photography',
  'Commercial Photography',
  'Birthday / Anniversary',
  'Other',
]

const budgets = [
  'Under ₹20,000',
  '₹20,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  '₹1,00,000 – ₹2,00,000',
  'Above ₹2,00,000',
  'Let\'s discuss',
]

export function BookingForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingData>({ resolver: zodResolver(bookingSchema) })

  const onSubmit = async (data: BookingData) => {
    setSubmitting(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200))
    console.log('[v0] Booking submitted:', data)
    setSubmitting(false)
    setSubmitted(true)
    reset()
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center py-24 gap-6"
      >
        <CheckCircle size={48} className="text-accent" />
        <h2 className="font-serif text-foreground text-3xl font-light">Enquiry Received</h2>
        <p className="font-sans text-muted-foreground text-base max-w-sm leading-relaxed">
          Thank you for reaching out. Praveen will personally review your enquiry and respond within 24 hours.
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Field helper */}
      {(
        [
          { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Your full name' },
          { label: 'Email Address', name: 'email', type: 'email', placeholder: 'you@example.com' },
          { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: '+91 00000 00000' },
          { label: 'Event / Shoot Location', name: 'location', type: 'text', placeholder: 'City, venue, or region' },
          { label: 'Preferred Date', name: 'date', type: 'date', placeholder: '' },
        ] as const
      ).map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground mb-2">
            {field.label}
          </label>
          <input
            id={field.name}
            type={field.type}
            placeholder={field.placeholder}
            {...register(field.name)}
            className="w-full border-b border-border bg-transparent py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors duration-200"
          />
          {errors[field.name] && (
            <p className="mt-1.5 font-sans text-xs text-destructive">{errors[field.name]?.message}</p>
          )}
        </div>
      ))}

      {/* Service select */}
      <div>
        <label htmlFor="service" className="block font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground mb-2">
          Service Required
        </label>
        <select
          id="service"
          {...register('service')}
          className="w-full border-b border-border bg-transparent py-3 font-sans text-sm text-foreground focus:border-foreground focus:outline-none transition-colors duration-200 appearance-none cursor-pointer"
        >
          <option value="">Select a service</option>
          {services.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {errors.service && <p className="mt-1.5 font-sans text-xs text-destructive">{errors.service.message}</p>}
      </div>

      {/* Budget select */}
      <div>
        <label htmlFor="budget" className="block font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground mb-2">
          Budget (INR)
        </label>
        <select
          id="budget"
          {...register('budget')}
          className="w-full border-b border-border bg-transparent py-3 font-sans text-sm text-foreground focus:border-foreground focus:outline-none transition-colors duration-200 appearance-none cursor-pointer"
        >
          <option value="">Select a budget range</option>
          {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        {errors.budget && <p className="mt-1.5 font-sans text-xs text-destructive">{errors.budget.message}</p>}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground mb-2">
          Tell Us Your Vision (Optional)
        </label>
        <textarea
          id="message"
          rows={4}
          placeholder="Describe your vision, special requests, or questions..."
          {...register('message')}
          className="w-full border-b border-border bg-transparent py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors duration-200 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 bg-foreground text-background font-sans text-xs font-medium tracking-[0.2em] uppercase hover:bg-accent hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mt-4"
      >
        {submitting ? 'Sending Enquiry...' : 'Submit Enquiry'}
      </button>

      <p className="font-sans text-xs text-muted-foreground/60 text-center">
        We respond to all enquiries within 24 hours.
      </p>
    </form>
  )
}
