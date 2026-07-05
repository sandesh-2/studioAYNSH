'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function PagePreloader() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Hide preloader after page is fully loaded
    const handleLoad = () => {
      setTimeout(() => setIsVisible(false), 600)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 bg-background z-[9999] flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-8">
        {/* Animated Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center"
        >
          <p className="font-serif text-2xl text-foreground font-light tracking-wide">
            Studio AYNSH
          </p>
          <p className="font-sans text-xs text-muted-foreground tracking-[0.2em] uppercase mt-2">
            We Capture The Untold Story
          </p>
        </motion.div>

        {/* Loading Lines */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-8 bg-foreground"
              animate={{
                scaleY: [0.5, 1, 0.5],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
