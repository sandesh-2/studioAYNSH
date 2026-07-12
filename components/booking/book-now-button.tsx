'use client'

import { useRouter } from 'next/navigation'

interface BookNowButtonProps {
  /** The visible text on the button */
  label?: string
  /** Tailwind className(s) for the trigger element */
  className?: string
  children?: React.ReactNode
}

/**
 * Navigates directly to the booking page at /booking.
 * Both "Book Now" and "Book Your Session" buttons now trigger the same booking flow.
 */
export function BookNowButton({
  label = 'Book Now',
  className = '',
  children,
}: BookNowButtonProps) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.push('/booking')}
      className={className}
    >
      {children ?? label}
    </button>
  )
}
