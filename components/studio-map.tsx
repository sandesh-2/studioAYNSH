'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Studio coordinates: Taramandal, Gorakhpur
const STUDIO_LAT = 26.1926
const STUDIO_LNG = 83.3686
const STUDIO_NAME = 'Studio AYNSH'

export function StudioMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    // Initialize the map
    const map = L.map(mapRef.current).setView([STUDIO_LAT, STUDIO_LNG], 15)

    // Add OpenStreetMap tiles (free, no API key needed, shows real roads and landmarks)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      minZoom: 3,
    }).addTo(map)

    // Create custom marker with brand color
    const studioIcon = L.divIcon({
      html: `
        <div style="
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
              </filter>
            </defs>
            <!-- Marker pin -->
            <path d="M 20 2 C 12 2 6 8 6 16 C 6 25 20 38 20 38 C 20 38 34 25 34 16 C 34 8 28 2 20 2 Z" 
                  fill="#d4af37" stroke="#8b7320" stroke-width="1" filter="url(#shadow)"/>
            <!-- Inner circle -->
            <circle cx="20" cy="16" r="6" fill="white" stroke="#d4af37" stroke-width="1"/>
            <circle cx="20" cy="16" r="4" fill="#d4af37"/>
          </svg>
        </div>
      `,
      className: 'studio-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    })

    // Add marker at studio location
    const marker = L.marker([STUDIO_LAT, STUDIO_LNG], { icon: studioIcon })
      .bindPopup(`<div style="text-align: center; font-family: serif; padding: 8px;">
        <strong>${STUDIO_NAME}</strong><br/>
        <small>Taramandal, Gorakhpur<br/>Uttar Pradesh, India</small>
      </div>`)
      .addTo(map)

    // Open popup on load
    marker.openPopup()

    mapInstance.current = map

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [])

  return (
    <div
      ref={mapRef}
      className="w-full rounded-sm overflow-hidden bg-muted/30"
      style={{ 
        minHeight: '400px',
        height: 'clamp(300px, 100%, 500px)',
      }}
    />
  )
}
