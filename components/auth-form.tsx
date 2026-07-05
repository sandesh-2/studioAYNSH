'use client'

import { authClient } from '@/lib/auth-client'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface AuthFormProps {
  mode: 'sign-in' | 'sign-up'
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'sign-up') {
        const res = await authClient.signUp.email({
          name: name.trim().slice(0, 120),
          email: email.trim().toLowerCase(),
          password,
          callbackURL: '/portal',
          ...(phone.trim() && { phone: phone.trim().slice(0, 20) }),
        } as Parameters<typeof authClient.signUp.email>[0])
        if (res.error) throw new Error(res.error.message)
      } else {
        const res = await authClient.signIn.email({
          email,
          password,
          callbackURL: '/portal',
        })
        if (res.error) throw new Error(res.error.message)
      }
      router.push('/portal')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full border-b border-border bg-transparent py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors duration-200'
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
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 00000 00000"
                  className={inputClass}
                />
              </div>
            </>
          )}

          <div>
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'sign-up' ? 'At least 8 characters' : 'Your password'}
                required
                minLength={8}
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
