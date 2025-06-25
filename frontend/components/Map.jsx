"use client"

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import stampLocations from '@/mock/map'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom marker icon for stamps
const stampIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTUuMDkgOC4yNkw2NCA5TDU5IDE0TDYwLjE4IDIxTDUyIDE3Ljc3TDQ1LjgyIDIxTDQ3IDE0TDQyIDlMNDguOTEgOC4yNkw1MiAyWiIgZmlsbD0iI2VmNDQ0NCIvPgo8L3N2Zz4K',
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
})

export default function Map({ className = "h-96" }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className={`${className} bg-gray-100 rounded-2xl flex items-center justify-center`}>
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }

  return (
    <div className={`${className} rounded-2xl overflow-hidden border border-gray-200`}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {stampLocations.map((stamp) => (
          <Marker
            key={stamp.id}
            position={stamp.coordinates}
            icon={stampIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-sm">{stamp.name}</h3>
                <p className="text-xs text-gray-600">{stamp.location}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Claimed by {stamp.user} {stamp.time}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
} 