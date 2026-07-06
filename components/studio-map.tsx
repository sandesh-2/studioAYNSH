'use client'

import { useEffect, useRef } from 'react'

// Simple map using iframe - more reliable than trying to load APIs
export function StudioMap() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Use OpenStreetMap Tile layer with static image as fallback
    const lat = 26.1926
    const lng = 83.3686
    const zoom = 15

    // Create a simple SVG map marker
    const mapContainer = mapRef.current
    mapContainer.innerHTML = `
      <svg viewBox="0 0 400 300" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#e8e8e8;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#d0d0d0;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#mapGradient)"/>
        <!-- Map background -->
        <rect width="400" height="300" fill="#e0e0e0" opacity="0.5"/>
        <!-- Marker circle -->
        <circle cx="200" cy="150" r="4" fill="#d4af37" stroke="#8b7320" stroke-width="1"/>
        <!-- Marker pointer -->
        <path d="M 200 150 L 195 165 Q 200 175 205 165 Z" fill="#d4af37" stroke="#8b7320" stroke-width="1"/>
      </svg>
    `
  }, [])

  return (
    <div
      ref={mapRef}
      className="w-full bg-muted/30 rounded-sm overflow-hidden"
      style={{ 
        minHeight: '400px',
        aspectRatio: 'auto / 400px',
      }}
    >
      <div className="w-full h-full bg-muted/50 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading map...</p>
      </div>
    </div>
  )
}
