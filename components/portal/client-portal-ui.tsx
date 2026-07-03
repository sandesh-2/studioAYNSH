'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { Download, Heart, CheckCircle, Clock, Star, LogIn } from 'lucide-react'

// Simulated client portal with login gate
interface Photo {
  id: number
  src: string
  alt: string
  favorited: boolean
  approved: boolean
}

const demoPhotos: Photo[] = [
  { id: 1, src: '/images/portfolio-wedding-1.png', alt: 'Wedding ceremony shot 1', favorited: false, approved: true },
  { id: 2, src: '/images/portfolio-portrait-1.png', alt: 'Portrait shot', favorited: true, approved: false },
  { id: 3, src: '/images/portfolio-prewedding-1.png', alt: 'Pre-wedding shoot', favorited: false, approved: false },
  { id: 4, src: '/images/portfolio-fashion-1.png', alt: 'Fashion editorial', favorited: true, approved: true },
  { id: 5, src: '/images/portfolio-drone-1.png', alt: 'Aerial shot', favorited: false, approved: false },
  { id: 6, src: '/images/portfolio-wedding-1.png', alt: 'Wedding reception', favorited: false, approved: true },
]

const projectSteps = [
  { label: 'Session Complete', done: true },
  { label: 'Editing in Progress', done: true },
  { label: 'Gallery Ready for Review', done: true },
  { label: 'Selections Approved', done: false },
  { label: 'Final Delivery', done: false },
]

export function ClientPortalUI() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [photos, setPhotos] = useState(demoPhotos)
  const [activeTab, setActiveTab] = useState<'gallery' | 'progress' | 'info'>('gallery')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Demo credentials for preview
    if (email === 'demo@studioaynsh.com' && password === 'demo1234') {
      setLoggedIn(true)
      setLoginError('')
    } else {
      setLoginError('Invalid credentials. Try demo@studioaynsh.com / demo1234')
    }
  }

  const toggleFavorite = (id: number) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, favorited: !p.favorited } : p)))
  }

  const toggleApprove = (id: number) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, approved: !p.approved } : p)))
  }

  if (!loggedIn) {
    return (
      <section className="py-20 lg:py-32 px-6 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-sans text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-6">Secure Access</p>
          <h1 className="font-serif font-light text-foreground text-4xl lg:text-5xl mb-4">Client Portal</h1>
          <p className="font-sans text-sm text-muted-foreground mb-10 leading-relaxed">
            Sign in to view your gallery, download your photographs, and track your project progress.
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full border-b border-border bg-transparent py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors duration-200"
              />
            </div>
            <div>
              <label htmlFor="password" className="block font-sans text-xs font-medium tracking-[0.15em] uppercase text-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your portal password"
                required
                className="w-full border-b border-border bg-transparent py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none transition-colors duration-200"
              />
            </div>
            {loginError && (
              <p className="font-sans text-xs text-destructive">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full py-4 bg-foreground text-background font-sans text-xs font-medium tracking-[0.2em] uppercase hover:bg-accent hover:text-foreground transition-all duration-300 flex items-center justify-center gap-2"
            >
              <LogIn size={16} />
              Sign In to Portal
            </button>
          </form>

          <p className="mt-8 font-sans text-xs text-muted-foreground/60 text-center">
            Don&apos;t have access? Contact us at{' '}
            <a href="mailto:samratgupta7754@gmail.com" className="underline hover:text-foreground transition-colors">
              samratgupta7754@gmail.com
            </a>
          </p>
          <p className="mt-3 font-sans text-xs text-muted-foreground/40 text-center">
            Demo: demo@studioaynsh.com / demo1234
          </p>
        </motion.div>
      </section>
    )
  }

  return (
    <section className="py-12 px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Portal header */}
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="font-sans text-xs tracking-[0.25em] uppercase text-muted-foreground mb-1">Client Portal</p>
          <h1 className="font-serif text-foreground text-3xl font-light">Welcome Back</h1>
          <p className="font-sans text-sm text-muted-foreground mt-1">Sharma Wedding &bull; Gorakhpur, March 2024</p>
        </div>
        <button
          onClick={() => setLoggedIn(false)}
          className="font-sans text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200 border border-border px-4 py-2"
        >
          Sign Out
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Photos', value: photos.length.toString() },
          { label: 'Favorited', value: photos.filter((p) => p.favorited).length.toString() },
          { label: 'Approved', value: photos.filter((p) => p.approved).length.toString() },
          { label: 'Pending Review', value: photos.filter((p) => !p.approved).length.toString() },
        ].map((stat) => (
          <div key={stat.label} className="border border-border p-5">
            <p className="font-serif text-3xl font-light text-foreground">{stat.value}</p>
            <p className="font-sans text-xs text-muted-foreground tracking-[0.15em] uppercase mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border mb-8">
        {(['gallery', 'progress', 'info'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-sans text-xs font-medium tracking-[0.15em] uppercase px-6 py-3 border-b-2 transition-all duration-200 capitalize ${
              activeTab === tab
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Gallery tab */}
      {activeTab === 'gallery' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative aspect-square overflow-hidden bg-muted"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {/* Overlay actions */}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/50 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => toggleFavorite(photo.id)}
                  className={`p-2 border transition-all duration-200 ${
                    photo.favorited ? 'bg-accent border-accent text-foreground' : 'bg-background/20 border-background/30 text-background hover:bg-background/40'
                  }`}
                  aria-label={photo.favorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart size={16} fill={photo.favorited ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => toggleApprove(photo.id)}
                  className={`p-2 border transition-all duration-200 ${
                    photo.approved ? 'bg-green-600 border-green-600 text-white' : 'bg-background/20 border-background/30 text-background hover:bg-background/40'
                  }`}
                  aria-label={photo.approved ? 'Unapprove photo' : 'Approve photo'}
                >
                  <CheckCircle size={16} />
                </button>
                <button
                  className="p-2 bg-background/20 border border-background/30 text-background hover:bg-background/40 transition-all duration-200"
                  aria-label="Download photo"
                >
                  <Download size={16} />
                </button>
              </div>
              {/* Status badges */}
              <div className="absolute top-2 right-2 flex gap-1">
                {photo.favorited && (
                  <span className="bg-accent p-1"><Heart size={10} fill="currentColor" className="text-foreground" /></span>
                )}
                {photo.approved && (
                  <span className="bg-green-600 p-1"><CheckCircle size={10} className="text-white" /></span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Progress tab */}
      {activeTab === 'progress' && (
        <div className="max-w-lg">
          <h2 className="font-serif text-foreground text-2xl font-light mb-8">Project Progress</h2>
          <div className="space-y-0">
            {projectSteps.map((step, i) => (
              <div key={step.label} className="flex items-start gap-5 py-5 border-b border-border last:border-b-0">
                <div className={`w-8 h-8 flex items-center justify-center shrink-0 border-2 mt-0.5 ${
                  step.done ? 'bg-foreground border-foreground text-background' : 'border-border text-muted-foreground'
                }`}>
                  {step.done ? <CheckCircle size={16} /> : <Clock size={16} />}
                </div>
                <div>
                  <p className={`font-serif text-lg ${step.done ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</p>
                  <p className="font-sans text-xs text-muted-foreground tracking-wide mt-0.5">
                    {step.done ? 'Completed' : 'Pending'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info tab */}
      {activeTab === 'info' && (
        <div className="max-w-xl space-y-8">
          <div className="border-t border-border pt-6">
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground/60 mb-2">Session</p>
            <p className="font-serif text-foreground text-xl">Sharma Wedding — Full Day Coverage</p>
          </div>
          <div className="border-t border-border pt-6">
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground/60 mb-2">Date</p>
            <p className="font-serif text-foreground text-xl">15 March 2024</p>
          </div>
          <div className="border-t border-border pt-6">
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground/60 mb-2">Package</p>
            <p className="font-serif text-foreground text-xl">Signature Wedding — ₹1,20,000</p>
          </div>
          <div className="border-t border-border pt-6">
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground/60 mb-2">Delivery Timeline</p>
            <p className="font-serif text-foreground text-xl">30–45 working days post-session</p>
          </div>
          <div className="border-t border-border pt-6">
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground/60 mb-2">Photographer</p>
            <p className="font-serif text-foreground text-xl">Praveen Gupta</p>
          </div>
          <div className="border-t border-border pt-6">
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground/60 mb-2">Contact</p>
            <a href="tel:+917084019414" className="font-serif text-foreground text-xl hover:text-accent transition-colors duration-200">
              +91 7084019414
            </a>
          </div>
        </div>
      )}
    </section>
  )
}
