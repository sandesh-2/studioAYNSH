'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Studio coordinates: Studio AYNSH, Gorakhpur
const STUDIO_LAT = 26.722472
const STUDIO_LNG = 83.390111
const STUDIO_NAME = 'Studio AYNSH'
const STUDIO_ADDRESS = 'Gorakhpur, Uttar Pradesh, India'

export function StudioMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const osm = useRef<L.TileLayer | null>(null)
  const satellite = useRef<L.TileLayer | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    // Initialize the map
    const map = L.map(mapRef.current).setView([STUDIO_LAT, STUDIO_LNG], 16)

    // OpenStreetMap layer (default)
    osm.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      minZoom: 3,
    }).addTo(map)

    // USGS Satellite/Aerial view layer
    satellite.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19,
      minZoom: 3,
    })

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
      .bindPopup(`<div style="text-align: center; font-family: serif; padding: 10px; min-width: 180px;">
        <strong style="font-size: 1.1em;">${STUDIO_NAME}</strong><br/>
        <small style="color: #666;">${STUDIO_ADDRESS}</small><br/>
        <small style="color: #999; margin-top: 6px; display: block;">
          <a href="https://google.com/maps/search/?api=1&query=${STUDIO_LAT},${STUDIO_LNG}" target="_blank" style="color: #d4af37; text-decoration: none;">View on Google Maps</a>
        </small>
      </div>`)
      .addTo(map)

    // Open popup on load
    marker.openPopup()

    // Add layer control for switching between map and satellite
    if (osm.current && satellite.current) {
      const baseLayers = {
        'Map': osm.current,
        'Satellite': satellite.current,
      }
      L.control.layers(baseLayers, {}, { position: 'topright' }).addTo(map)
    }

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
