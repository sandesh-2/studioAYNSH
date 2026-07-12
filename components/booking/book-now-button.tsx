'use client'

import { useState } from 'react'
import { CheckAvailabilityModal } from './check-availability-modal'

interface BookNowButtonProps {
  /** The visible text on the button */
  label?: string
  /** Tailwind className(s) for the trigger element */
  className?: string
  /** Render as a block-level element wrapping children, instead of a <button> */
  asChild?: boolean
  children?: React.ReactNode
}

/**
 * Drop-in replacement for <Link href="/booking"> on public-facing CTAs.
 * Opens the Check Availability modal first; "Continue to Booking" navigates
 * to /booking with the pre-selected date stored in sessionStorage.
 */
export function BookNowButton({
  label = 'Book Now',
  className = '',
  children,
}: BookNowButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
      >
        {children ?? label}
      </button>

      <CheckAvailabilityModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
