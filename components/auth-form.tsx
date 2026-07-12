'use client'

import { checkDuplicateEmailOrPhone } from '@/lib/actions/check-duplicates'
import { authClient } from '@/lib/auth-client'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface AuthFormProps {
  mode: 'sign-in' | 'sign-up'
  redirectTo?: string
}

// ── Validation helpers ────────────────────────────────────────────────────

/**
 * RFC 5322-compatible email regex.
 * Checks structure: local-part @ domain . tld (2–10 chars).
 */
function isValidEmail(value: string): boolean {
  const trimmed = value.trim().toLowerCase()
  // Basic structural check
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,10}$/
  if (!re.test(trimmed)) return false
  // Must have at least one dot in domain part
  const [, domain] = trimmed.split('@')
  if (!domain || !domain.includes('.')) return false
  // TLD must be at least 2 chars
  const tld = domain.split('.').pop() ?? ''
  if (tld.length < 2) return false
  return true
}

/**
 * Indian mobile number: exactly 10 digits, starts with 6–9.
 */
function isValidIndianPhone(digits: string): boolean {
  return /^[6-9]\d{9}$/.test(digits)
}

export function AuthForm({ mode, redirectTo = '/portal' }: AuthFormProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  // phone stores only the 10 digits — the +91 prefix is fixed in the UI
  const [phoneDigits, setPhoneDigits] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordFocused, setPasswordFocused] = useState(false)

  // Inline field errors (shown after the user interacts with the field)
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')

  // ── Password strength ──────────────────────────────────────────────────
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: '' }
    let score = 0
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++
    if (/\d/.test(pwd)) score++
    if (/[^a-zA-Z\d]/.test(pwd)) score++
    const levels = [
      { score: 0, label: '', color: '' },
      { score: 1, label: 'Weak', color: 'text-destructive' },
      { score: 2, label: 'Fair', color: 'text-orange-500' },
      { score: 3, label: 'Good', color: 'text-yellow-500' },
      { score: 4, label: 'Strong', color: 'text-green-500' },
      { score: 5, label: 'Very Strong', color: 'text-green-600' },
    ]
    return levels[Math.min(score, 5)]
  }
  const strength = getPasswordStrength(password)

  // ── Phone input handler — digits only, max 10 ─────────────────────────
  function handlePhoneInput(raw: string) {
    // Strip every non-digit character
    const digits = raw.replace(/\D/g, '').slice(0, 10)
    setPhoneDigits(digits)
    if (phoneError && digits.length === 10) setPhoneError('')
  }

  function handlePhoneBlur() {
    if (!phoneDigits) return // Phone is optional on sign-up
    if (!isValidIndianPhone(phoneDigits)) {
      setPhoneError('Enter a valid 10-digit Indian mobile number (starts with 6–9).')
    } else {
      setPhoneError('')
    }
  }

  // ── Email blur validation ─────────────────────────────────────────────
  function handleEmailBlur() {
    if (!email) return
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address (e.g. name@domain.com).')
    } else {
      setEmailError('')
    }
  }

  // ── Submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Run all field validations eagerly before submitting
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address (e.g. name@domain.com).')
      return
    }

    if (mode === 'sign-up') {
      if (phoneDigits && !isValidIndianPhone(phoneDigits)) {
        setPhoneError('Enter a valid 10-digit Indian mobile number (starts with 6–9).')
        return
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters.')
        return
      }
    }

    setLoading(true)
    try {
      if (mode === 'sign-up') {
        const trimmedEmail = email.trim().toLowerCase()
        // Build the full phone string only when provided
        const fullPhone = phoneDigits ? `+91${phoneDigits}` : ''

        const duplicationCheck = await checkDuplicateEmailOrPhone(
          trimmedEmail,
          fullPhone || undefined,
        )
        if (duplicationCheck.isDuplicate) {
          throw new Error(duplicationCheck.message || 'Email or phone number is already registered.')
        }

        const res = await authClient.signUp.email({
          name: name.trim().slice(0, 120),
          email: trimmedEmail,
          password,
          callbackURL: redirectTo,
          ...(fullPhone && { phone: fullPhone }),
        } as Parameters<typeof authClient.signUp.email>[0])
        if (res.error) throw new Error(res.error.message)
      } else {
        const res = await authClient.signIn.email({
          email: email.trim().toLowerCase(),
          password,
          callbackURL: redirectTo,
        })
        if (res.error) throw new Error(res.error.message)
      }
      router.push(redirectTo)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full border-b border-border bg-transparent py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors duration-200'
  const inputErrorClass =
    'w-full border-b border-destructive bg-transparent py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-destructive focus:outline-none transition-colors duration-200'
  const labelClass =
    'block font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground mb-2'

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block font-serif text-2xl text-foreground tracking-widest mb-2">
            STUDIO AYNSH
          </Link>
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground mt-1">
            Client Portal
          </p>
          <div className="w-8 h-px bg-accent mx-auto mt-6" />
          <h1 className="font-serif text-3xl text-foreground font-light mt-6">
            {mode === 'sign-in' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="font-sans text-sm text-muted-foreground mt-2 leading-relaxed">
            {mode === 'sign-in'
              ? 'Sign in to track your bookings and gallery deliveries.'
              : 'Register to manage your sessions and communicate with our team.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'sign-up' && (
            <>
              {/* Full name */}
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  autoComplete="name"
                  className={inputClass}
                />
              </div>

              {/* Phone — fixed +91 prefix, exactly 10 digits */}
              <div>
                <label className={labelClass}>
                  Phone Number{' '}
                  <span className="font-sans normal-case tracking-normal text-muted-foreground/50 text-[10px]">
                    (optional)
                  </span>
                </label>
                <div className={`flex items-stretch border-b ${phoneError ? 'border-destructive' : 'border-border focus-within:border-foreground'} transition-colors duration-200`}>
                  {/* Fixed country code badge */}
                  <span className="flex items-center pr-3 font-sans text-sm text-muted-foreground select-none whitespace-nowrap pt-3 pb-3">
                    +91
                  </span>
                  <span className="flex items-center text-muted-foreground/40 pt-3 pb-3 pr-2 select-none">|</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={phoneDigits}
                    onChange={(e) => handlePhoneInput(e.target.value)}
                    onBlur={handlePhoneBlur}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    autoComplete="tel-national"
                    className="flex-1 bg-transparent py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                  />
                </div>
                {phoneError && (
                  <p className="mt-1 font-sans text-xs text-destructive">{phoneError}</p>
                )}
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError('') }}
              onBlur={handleEmailBlur}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className={emailError ? inputErrorClass : inputClass}
            />
            {emailError && (
              <p className="mt-1 font-sans text-xs text-destructive">{emailError}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelClass}>Password</label>
              {mode === 'sign-up' && password && (
                <span className={`font-sans text-xs font-medium ${strength.color}`}>
                  {strength.label}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder={mode === 'sign-up' ? 'At least 8 characters' : 'Your password'}
                required
                minLength={8}
                autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-0 top-3 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {mode === 'sign-up' && (password || passwordFocused) && (
              <div className="mt-2 space-y-1 text-xs text-muted-foreground/70">
                <p className={password.length >= 8 ? 'text-green-600' : ''}>
                  {password.length >= 8 ? '✓' : '○'} At least 8 characters
                </p>
                <p className={/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'text-green-600' : ''}>
                  {/[a-z]/.test(password) && /[A-Z]/.test(password) ? '✓' : '○'} Mix of uppercase and lowercase
                </p>
                <p className={/\d/.test(password) ? 'text-green-600' : ''}>
                  {/\d/.test(password) ? '✓' : '○'} At least one number
                </p>
                <p className={/[^a-zA-Z\d]/.test(password) ? 'text-green-600' : ''}>
                  {/[^a-zA-Z\d]/.test(password) ? '✓' : '○'} Special character (!@#$%^&*)
                </p>
              </div>
            )}
          </div>

          {error && (
            <p className="font-sans text-xs text-destructive bg-destructive/5 border border-destructive/20 px-4 py-3">
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-foreground text-background font-sans text-xs font-medium tracking-[0.2em] uppercase disabled:opacity-50 transition-all duration-200 mt-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                {mode === 'sign-in' ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : mode === 'sign-in' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </motion.button>
        </form>

        {/* Toggle */}
        <p className="text-center font-sans text-sm text-muted-foreground mt-8">
          {mode === 'sign-in' ? (
            <>
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" className="text-foreground underline underline-offset-4 hover:text-accent transition-colors">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link href="/sign-in" className="text-foreground underline underline-offset-4 hover:text-accent transition-colors">
                Sign in
              </Link>
            </>
          )}
        </p>

        <p className="text-center font-sans text-xs text-muted-foreground/50 mt-6">
          <Link href="/" className="hover:text-muted-foreground transition-colors">
            &larr; Back to Studio AYNSH
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
