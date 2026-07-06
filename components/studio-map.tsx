'use client'

import { MapPin } from 'lucide-react'

// Studio coordinates: Studio AYNSH, Gorakhpur
const STUDIO_LAT = 26.722472
const STUDIO_LNG = 83.390111
const STUDIO_NAME = 'Studio AYNSH'
const STUDIO_ADDRESS = 'Gorakhpur, Uttar Pradesh, India'

export function StudioMap() {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${STUDIO_LAT},${STUDIO_LNG}`
  const openStreetMapUrl = `https://openstreetmap.org/?mlat=${STUDIO_LAT}&mlon=${STUDIO_LNG}&zoom=16`

  return (
    <a
      href={googleMapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full rounded-sm overflow-hidden bg-gradient-to-br from-muted to-muted/50 hover:from-muted/80 hover:to-muted/40 transition-all duration-300 group"
      style={{ minHeight: '400px' }}
    >
      <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-8">
        <div className="relative">
          <MapPin className="w-16 h-16 text-gold/80 group-hover:text-gold transition-colors duration-300" strokeWidth={1.5} />
          <div className="absolute inset-0 bg-gold/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
        </div>
        <div className="text-center">
          <h3 className="font-serif text-2xl font-light text-foreground mb-2">{STUDIO_NAME}</h3>
          <p className="font-sans text-sm text-muted-foreground/70 tracking-wide mb-1">
            Coordinates: {STUDIO_LAT}, {STUDIO_LNG}
          </p>
          <p className="font-sans text-xs text-muted-foreground/60 uppercase tracking-[0.1em] mt-3">
            Click to open in Google Maps
          </p>
        </div>
      </div>
    </a>
  )
}
