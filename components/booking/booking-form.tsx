'use client'

import { createBooking } from '@/app/actions/booking'
import { CalendarPicker } from './calendar-picker'
import { TimePicker } from './time-picker'
import { CustomSelect } from './custom-select'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { CheckCircle, Loader2, ChevronRight, ChevronLeft } from 'lucide-react'

interface BookingData {
  clientName: string
  clientEmail: string
  clientPhone: string
  service: string
  eventDate: string
  eventTime: string
  state: string
  city: string
  budget: string
  specialRequests: string
}

interface LoggedInUser {
  name: string
  email: string
  phone: string
}

const SERVICES = [
  { label: 'Wedding Photography', value: 'wedding' },
  { label: 'Pre-Wedding Shoot', value: 'prewedding' },
  { label: 'Portrait Session', value: 'portrait' },
  { label: 'Fashion Editorial', value: 'fashion' },
  { label: 'Drone Cinematography', value: 'drone' },
  { label: 'Other', value: 'other' },
]

// All 28 states + 8 Union Territories of India
const INDIA_STATES = [
  { label: 'Andhra Pradesh',          value: 'Andhra Pradesh' },
  { label: 'Arunachal Pradesh',       value: 'Arunachal Pradesh' },
  { label: 'Assam',                   value: 'Assam' },
  { label: 'Bihar',                   value: 'Bihar' },
  { label: 'Chhattisgarh',            value: 'Chhattisgarh' },
  { label: 'Goa',                     value: 'Goa' },
  { label: 'Gujarat',                 value: 'Gujarat' },
  { label: 'Haryana',                 value: 'Haryana' },
  { label: 'Himachal Pradesh',        value: 'Himachal Pradesh' },
  { label: 'Jharkhand',               value: 'Jharkhand' },
  { label: 'Karnataka',               value: 'Karnataka' },
  { label: 'Kerala',                  value: 'Kerala' },
  { label: 'Madhya Pradesh',          value: 'Madhya Pradesh' },
  { label: 'Maharashtra',             value: 'Maharashtra' },
  { label: 'Manipur',                 value: 'Manipur' },
  { label: 'Meghalaya',               value: 'Meghalaya' },
  { label: 'Mizoram',                 value: 'Mizoram' },
  { label: 'Nagaland',                value: 'Nagaland' },
  { label: 'Odisha',                  value: 'Odisha' },
  { label: 'Punjab',                  value: 'Punjab' },
  { label: 'Rajasthan',               value: 'Rajasthan' },
  { label: 'Sikkim',                  value: 'Sikkim' },
  { label: 'Tamil Nadu',              value: 'Tamil Nadu' },
  { label: 'Telangana',               value: 'Telangana' },
  { label: 'Tripura',                 value: 'Tripura' },
  { label: 'Uttar Pradesh',           value: 'Uttar Pradesh' },
  { label: 'Uttarakhand',             value: 'Uttarakhand' },
  { label: 'West Bengal',             value: 'West Bengal' },
  // Union Territories
  { label: 'Andaman & Nicobar Islands',       value: 'Andaman & Nicobar Islands' },
  { label: 'Chandigarh',                      value: 'Chandigarh' },
  { label: 'Dadra & Nagar Haveli and Daman & Diu', value: 'Dadra & Nagar Haveli and Daman & Diu' },
  { label: 'Delhi (NCT)',                     value: 'Delhi (NCT)' },
  { label: 'Jammu & Kashmir',                 value: 'Jammu & Kashmir' },
  { label: 'Ladakh',                          value: 'Ladakh' },
  { label: 'Lakshadweep',                     value: 'Lakshadweep' },
  { label: 'Puducherry',                      value: 'Puducherry' },
]

const BUDGETS = [
  { label: 'Let\'s discuss', value: 'discuss' },
  { label: '₹20,000 – ₹50,000', value: '20k-50k' },
  { label: '₹50,000 – ₹1,00,000', value: '50k-1L' },
  { label: '₹1,00,000 – ₹2,50,000', value: '1L-2.5L' },
  { label: '₹2,50,000 – ₹5,00,000', value: '2.5L-5L' },
  { label: '₹5,00,000+', value: '5L+' },
]

const STEPS = [
  { number: '01', label: 'Your Details' },
  { number: '02', label: 'Session Info' },
  { number: '03', label: 'Final Notes' },
]

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
  }),
}

export function BookingForm({ loggedInUser }: { loggedInUser?: LoggedInUser | null }) {
  // When a user is already signed in, skip step 1 (their details are autofilled)
  const startStep = loggedInUser ? 2 : 1
  const [step, setStep] = useState(startStep)
  const [direction, setDirection] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
    reset,
  } = useForm<BookingData>({ mode: 'onTouched' })

  // Autofill step-1 fields from the logged-in user's profile
  useEffect(() => {
    if (loggedInUser) {
      setValue('clientName', loggedInUser.name)
      setValue('clientEmail', loggedInUser.email)
      setValue('clientPhone', loggedInUser.phone ?? '')
    }
  }, [loggedInUser, setValue])

  const selectedDate    = watch('eventDate')
  const selectedTime    = watch('eventTime')
  const selectedService = watch('service')
  const selectedState   = watch('state')
  const selectedBudget  = watch('budget')

  async function goNext() {
    let valid = false
    if (step === 1) {
      valid = await trigger(['clientName', 'clientEmail', 'clientPhone'])
    } else if (step === 2) {
      valid = await trigger(['service', 'eventDate', 'state', 'city'])
      if (!selectedService) { valid = false }
      if (!selectedDate)    { valid = false }
      if (!selectedState)   { valid = false }
    }
    if (valid) {
      setDirection(1)
      setStep((s) => s + 1)
    }
  }

  function goPrev() {
    setDirection(-1)
    // If logged in, never go back below step 2 (step 1 is autofilled)
    setStep((s) => (loggedInUser && s <= 2 ? 2 : s - 1))
  }

  const onSubmit = async (data: BookingData) => {
    setSubmitting(true)
    setServerError('')
    try {
      // Combine state + city into a single location string for the DB
      const location = [data.city?.trim(), data.state?.trim()].filter(Boolean).join(', ')
      const result = await createBooking({
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        service: data.service,
        eventDate: data.eventDate,
        eventTime: data.eventTime || '',
        location,
        budget: data.budget || '',
        specialRequests: data.specialRequests || '',
      })
      if (result.success) {
        setSubmitted(true)
        reset()
        setStep(1)
      } else {
        setServerError(result.error || 'Booking could not be created. Please try again.')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again or contact us.'
      setServerError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full border-b border-border bg-transparent py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors duration-200'
  const labelClass =
    'block font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground mb-2'

  // ── Success state ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center py-24 gap-6"
      >
        <CheckCircle size={48} className="text-accent" strokeWidth={1.5} />
        <h2 className="font-serif text-foreground text-3xl font-light">Booking Received</h2>
        <p className="font-sans text-muted-foreground text-base max-w-sm leading-relaxed">
          Thank you for choosing Studio AYNSH. A confirmation email is on its way. We&apos;ll be in touch within 24 hours to confirm your session.
        </p>
        <p className="font-sans text-xs text-muted-foreground/60 mt-2">
          Track your booking anytime in the{' '}
          <a href="/portal" className="text-foreground underline underline-offset-4">
            Client Portal
          </a>
          .
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
    <div className="space-y-10">

      {/* ── Step indicator ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => {
          const num = i + 1
          const isActive = step === num
          // Step 1 is "done" if user is logged in (autofilled) or if we've passed it
          const isDone = step > num || (num === 1 && !!loggedInUser)
          const isAutofilled = num === 1 && !!loggedInUser
          return (
            <div key={s.number} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 flex items-center justify-center border transition-all duration-300 ${
                    isActive
                      ? 'border-foreground bg-foreground text-background'
                      : isDone
                      ? 'border-accent bg-accent/20 text-accent'
                      : 'border-border text-muted-foreground/40'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle size={14} strokeWidth={2} />
                  ) : (
                    <span className="font-sans text-[10px] font-medium tracking-wider">{s.number}</span>
                  )}
                </div>
                <span
                  className={`font-sans text-[10px] tracking-[0.14em] uppercase whitespace-nowrap transition-colors duration-300 ${
                    isActive ? 'text-foreground' : isDone ? 'text-accent' : 'text-muted-foreground/40'
                  }`}
                >
                  {isAutofilled ? 'Autofilled' : s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-3 mb-5 transition-colors duration-500 ${
                    isDone && step > num ? 'bg-accent/50' : isDone ? 'bg-accent/30' : 'bg-border'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* ── Step panels ─────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* overflow must be visible so CustomSelect dropdowns are not clipped */}
        <div className="relative min-h-[360px]">
          <AnimatePresence mode="wait" custom={direction}>

            {/* Step 1: Personal Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="space-y-7"
              >
                <div>
                  <p className="font-sans text-xs tracking-[0.18em] uppercase text-accent mb-6">
                    01 — Your Details
                  </p>
                  <div className="space-y-7">
                    <div>
                      <label htmlFor="clientName" className={labelClass}>Full Name</label>
                      <input
                        id="clientName"
                        type="text"
                        placeholder="Your full name"
                        {...register('clientName', {
                          required: 'Please enter your name',
                          minLength: { value: 2, message: 'Name is too short' },
                        })}
                        className={inputClass}
                        autoComplete="name"
                      />
                      {errors.clientName && (
                        <p className="mt-1.5 font-sans text-xs text-destructive">{errors.clientName.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="clientEmail" className={labelClass}>Email Address</label>
                      <input
                        id="clientEmail"
                        type="email"
                        placeholder="you@example.com"
                        {...register('clientEmail', {
                          required: 'Please enter your email',
                          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
                        })}
                        className={inputClass}
                        autoComplete="email"
                      />
                      {errors.clientEmail && (
                        <p className="mt-1.5 font-sans text-xs text-destructive">{errors.clientEmail.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="clientPhone" className={labelClass}>Phone Number</label>
                      <input
                        id="clientPhone"
                        type="tel"
                        placeholder="+91 00000 00000"
                        {...register('clientPhone', {
                          required: 'Please enter your phone number',
                          minLength: { value: 10, message: 'Enter a valid number' },
                        })}
                        className={inputClass}
                        autoComplete="tel"
                      />
                      {errors.clientPhone && (
                        <p className="mt-1.5 font-sans text-xs text-destructive">{errors.clientPhone.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Session Info */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="space-y-7"
              >
                <p className="font-sans text-xs tracking-[0.18em] uppercase text-accent mb-6">
                  02 — Session Info
                </p>

                {/* Service type */}
                <div>
                  <label className={labelClass}>Service Type</label>
                  <CustomSelect
                    options={SERVICES}
                    value={selectedService}
                    onChange={(v) => setValue('service', v, { shouldValidate: true })}
                    placeholder="Select a service"
                  />
                  {errors.service && (
                    <p className="mt-1.5 font-sans text-xs text-destructive">Please select a service</p>
                  )}
                </div>

                {/* Preferred date — CalendarPicker has its own trigger */}
                <div>
                  <label className={labelClass}>Preferred Date</label>
                  <CalendarPicker
                    value={selectedDate}
                    onChange={(d) => setValue('eventDate', d, { shouldValidate: true })}
                    error={errors.eventDate?.message}
                  />
                  {errors.eventDate && (
                    <p className="mt-1.5 font-sans text-xs text-destructive">Please select a date</p>
                  )}
                </div>

                {/* Preferred time — TimePicker has its own trigger */}
                <div>
                  <label className={labelClass}>
                    Preferred Time{' '}
                    <span className="text-muted-foreground/50 normal-case tracking-normal">(optional)</span>
                  </label>
                  <TimePicker
                    value={selectedTime}
                    onChange={(t) => setValue('eventTime', t)}
                    error={errors.eventTime?.message}
                  />
                </div>

                {/* State + City / Venue */}
                <div className="grid grid-cols-2 gap-5">
                  {/* State dropdown */}
                  <div>
                    <label className={labelClass}>State</label>
                    <CustomSelect
                      options={INDIA_STATES}
                      value={selectedState}
                      onChange={(v) => setValue('state', v, { shouldValidate: true })}
                      placeholder="Select state"
                      error={errors.state?.message}
                    />
                    {errors.state && (
                      <p className="mt-1.5 font-sans text-xs text-destructive">Please select a state</p>
                    )}
                    {/* Hidden input so react-hook-form tracks the value */}
                    <input
                      type="hidden"
                      {...register('state', { required: true })}
                    />
                  </div>

                  {/* City / venue free text */}
                  <div>
                    <label htmlFor="city" className={labelClass}>City / Venue</label>
                    <input
                      id="city"
                      type="text"
                      placeholder="Mumbai, The Leela..."
                      {...register('city', {
                        required: 'Please enter a city or venue',
                        minLength: { value: 2, message: 'Too short' },
                      })}
                      className={inputClass}
                    />
                    {errors.city && (
                      <p className="mt-1.5 font-sans text-xs text-destructive">{errors.city.message}</p>
                    )}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className={labelClass}>Budget Range</label>
                  <CustomSelect
                    options={BUDGETS}
                    value={selectedBudget}
                    onChange={(v) => setValue('budget', v)}
                    placeholder="Select a budget range"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Final Notes */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="space-y-7"
              >
                <p className="font-sans text-xs tracking-[0.18em] uppercase text-accent mb-6">
                  03 — Anything Else?
                </p>
                <div>
                  <label htmlFor="specialRequests" className={labelClass}>
                    Special Requests / Your Vision{' '}
                    <span className="text-muted-foreground/50 normal-case tracking-normal">(optional)</span>
                  </label>
                  <textarea
                    id="specialRequests"
                    placeholder="Tell us about your vision, references, or any special requests..."
                    {...register('specialRequests')}
                    rows={7}
                    className="w-full border border-border bg-transparent px-4 py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors duration-200 resize-none mt-1"
                  />
                </div>

                <p className="font-sans text-xs text-muted-foreground/70 leading-relaxed pt-1">
                  Share anything that helps us understand your vision — mood boards, venue details, outfit ideas, or questions.
                </p>

                {serverError && (
                  <p className="font-sans text-xs text-destructive bg-destructive/5 border border-destructive/20 px-4 py-3">
                    {serverError}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Navigation buttons ───────────────────────────────────────── */}
        {/* When logged in, step 2 is the first visible step so no Previous needed */}
        <div className={`flex items-center mt-10 ${(step > 1 && !(loggedInUser && step === 2)) ? 'justify-between' : 'justify-end'}`}>
          {step > 1 && !(loggedInUser && step === 2) && (
            <button
              type="button"
              onClick={goPrev}
              className="inline-flex items-center gap-2 font-sans text-xs font-medium tracking-[0.16em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200 group"
            >
              <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
              Previous
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center gap-2 font-sans text-xs font-medium tracking-[0.16em] uppercase bg-foreground text-background px-8 py-3.5 hover:bg-accent hover:text-foreground transition-all duration-200 group"
            >
              Next
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
          ) : (
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 font-sans text-xs font-medium tracking-[0.18em] uppercase bg-foreground text-background px-10 py-3.5 hover:bg-accent hover:text-foreground disabled:opacity-50 transition-all duration-200"
            >
              {submitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Booking'
              )}
            </motion.button>
          )}
        </div>

        {/* Progress hint */}
        <p className="font-sans text-xs text-muted-foreground/50 text-center mt-6">
          Step {step} of {STEPS.length} &mdash; {STEPS[step - 1].label}
        </p>
      </form>
    </div>
  )
}
