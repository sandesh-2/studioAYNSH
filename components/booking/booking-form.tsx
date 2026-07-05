'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle } from 'lucide-react'
import { CalendarPicker } from './calendar-picker'
import { TimePicker } from './time-picker'
import { CustomSelect } from './custom-select'

interface BookingData {
  name: string
  email: string
  phone: string
  service: string
  date: string
  time: string
  location: string
  budget: string
  message?: string
}

export function BookingForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<BookingData>()

  const selectedDate = watch('date')
  const selectedTime = watch('time')

  const onSubmit = async (data: BookingData) => {
    setSubmitting(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200))
    setSubmitting(false)
    setSubmitted(true)
    reset()
    setTimeout(() => setSubmitted(false), 4000)
  }

  const services = [
    { label: 'Wedding Photography', value: 'wedding' },
    { label: 'Pre-Wedding Shoot', value: 'prewedding' },
    { label: 'Portrait Session', value: 'portrait' },
    { label: 'Fashion Editorial', value: 'fashion' },
    { label: 'Drone Cinematography', value: 'drone' },
    { label: 'Other', value: 'other' },
  ]

  const budgets = [
    { label: '₹50,000 - ₹1,00,000', value: 'budget-50-100' },
    { label: '₹1,00,000 - ₹2,50,000', value: 'budget-100-250' },
    { label: '₹2,50,000 - ₹5,00,000', value: 'budget-250-500' },
    { label: '₹5,00,000+', value: 'budget-500-plus' },
  ]

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
          Thank you for choosing Studio AYNSH. We&apos;ll review your inquiry and contact you within 24 hours to confirm details.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Text Input Fields */}
      {([
        { label: 'Full Name', name: 'name' as const, type: 'text', placeholder: 'Your full name', rules: { required: 'Please enter your full name', minLength: { value: 2, message: 'Name is too short' } } },
        { label: 'Email Address', name: 'email' as const, type: 'email', placeholder: 'you@example.com', rules: { required: 'Please enter a valid email', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Please enter a valid email' } } },
        { label: 'Phone Number', name: 'phone' as const, type: 'tel', placeholder: '+91 00000 00000', rules: { required: 'Please enter a valid phone number', minLength: { value: 10, message: 'Please enter a valid phone number' } } },
        { label: 'Event / Shoot Location', name: 'location' as const, type: 'text', placeholder: 'City, venue, or region', rules: { required: 'Please enter a location', minLength: { value: 2, message: 'Location is too short' } } },
      ] as const).map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground mb-2">
            {field.label}
          </label>
          <input
            id={field.name}
            type={field.type}
            placeholder={field.placeholder}
            {...register(field.name, field.rules)}
            className="w-full border-b border-border bg-transparent py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors duration-200"
          />
          {errors[field.name] && (
            <p className="mt-1.5 font-sans text-xs text-destructive">{errors[field.name]?.message}</p>
          )}
        </div>
      ))}

      {/* Service Dropdown */}
      <div>
        <label className="block font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground mb-2">
          Photography Service
        </label>
        <CustomSelect
          options={services}
          value={watch('service')}
          onChange={(value) => setValue('service', value)}
          placeholder="Select a service"
        />
        {errors.service && (
          <p className="mt-1.5 font-sans text-xs text-destructive">Please select a service</p>
        )}
      </div>

      {/* Calendar Picker */}
      <div>
        <label className="block font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground mb-2">
          Preferred Date
        </label>
        <button
          type="button"
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="w-full border-b border-border bg-transparent py-3 font-sans text-sm text-foreground text-left hover:border-foreground focus:outline-none transition-colors duration-200"
        >
          {selectedDate ? new Date(selectedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Select a date'}
        </button>
        {showDatePicker && (
          <div className="mt-4 p-4 border border-border bg-secondary">
            <CalendarPicker
              value={selectedDate}
              onChange={(date) => {
                setValue('date', date)
                setShowDatePicker(false)
              }}
            />
          </div>
        )}
        {errors.date && (
          <p className="mt-1.5 font-sans text-xs text-destructive">Please select a date</p>
        )}
      </div>

      {/* Time Picker */}
      <div>
        <label className="block font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground mb-2">
          Preferred Time
        </label>
        <button
          type="button"
          onClick={() => setShowTimePicker(!showTimePicker)}
          className="w-full border-b border-border bg-transparent py-3 font-sans text-sm text-foreground text-left hover:border-foreground focus:outline-none transition-colors duration-200"
        >
          {selectedTime || 'Select a time'}
        </button>
        {showTimePicker && (
          <div className="mt-4 p-4 border border-border bg-secondary">
            <TimePicker
              value={selectedTime}
              onChange={(time) => {
                setValue('time', time)
                setShowTimePicker(false)
              }}
            />
          </div>
        )}
      </div>

      {/* Budget Dropdown */}
      <div>
        <label className="block font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground mb-2">
          Budget Range
        </label>
        <CustomSelect
          options={budgets}
          value={watch('budget')}
          onChange={(value) => setValue('budget', value)}
          placeholder="Select a budget range"
        />
        {errors.budget && (
          <p className="mt-1.5 font-sans text-xs text-destructive">Please select a budget range</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground mb-2">
          Additional Details (Optional)
        </label>
        <textarea
          id="message"
          placeholder="Tell us about your vision, theme, or any special requests..."
          {...register('message')}
          rows={4}
          className="w-full border border-border bg-transparent px-4 py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors duration-200"
        />
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={submitting}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-foreground text-background py-4 font-sans font-medium tracking-wide uppercase text-sm hover:bg-accent hover:text-foreground disabled:opacity-50 transition-all duration-200"
      >
        {submitting ? 'Submitting...' : 'Request Booking'}
      </motion.button>

      <p className="font-sans text-xs text-muted-foreground text-center">
        We&apos;ll get back to you within 24 hours. Looking forward to creating beautiful moments with you.
      </p>
    </form>
  )
}
