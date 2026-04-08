'use client'
import { useEffect, useRef } from 'react'
import { Station, FuelType } from '@/data/types'
import { BRAND_COLORS } from '@/data/stations'

interface Props {
  stations: Station[]
  fuel: FuelType
  officialPrice: number
  selectedId: string | null
  onSelect: (id: string) => void
  userLocation: [number, number] | null
}

function getPinColor(price: number, official: number): string {
  const diff = price - official
  if (diff < -0.50) return '#16a34a'  // dark green — well below max
  if (diff < 0)     return '#65a30d'  // green — below max
  if (diff < 0.10)  return '#ca8a04'  // amber — at max
  if (diff < 2.00)  return '#ea580c'  // orange — slightly over
  return '#dc2626'                    // red — significantly over
}

export default function MapView({ stations, fuel, officialPrice, selectedId, onSelect, userLocation }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Dynamically import Leaflet (client-side only)
    import('leaflet').then(L => {
      // Fix default icon path issue with Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      // Centre on South Africa — fits WC + GP + KZN
      const map = L.map(mapRef.current!, {
        center: [-29.5, 25.5],
        zoom: 5,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map)

      mapInstanceRef.current = map
      renderMarkers(L, map)
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  function renderMarkers(L: any, map: any) {
    // Clear old markers
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    // User location marker
    if (userLocation) {
      const userIcon = L.divIcon({
        html: `<div style="width:14px;height:14px;border-radius:50%;background:#854F0B;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
        className: '',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })
      L.marker(userLocation, { icon: userIcon })
        .addTo(map)
        .bindPopup('<div style="font-size:12px;font-weight:600">Your location</div>')
      markersRef.current.push(L.marker(userLocation, { icon: userIcon }))
    }

    stations.forEach(station => {
      const price = station.prices[fuel]
      const pinColor = getPinColor(price, officialPrice)
      const brand = BRAND_COLORS[station.brand] || { short: station.brand.slice(0, 2).toUpperCase() }
      const isSelected = station.id === selectedId

      const icon = L.divIcon({
        html: `
          <div style="
            background:${pinColor};
            color:white;
            padding:4px 7px;
            border-radius:8px;
            font-size:11px;
            font-weight:700;
            white-space:nowrap;
            box-shadow:0 2px 8px rgba(0,0,0,0.35);
            border:${isSelected ? '2.5px solid #854F0B' : '2px solid white'};
            transform:${isSelected ? 'scale(1.15)' : 'scale(1)'};
            transition:all .15s;
          ">R${price.toFixed(2)}</div>
          <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid ${pinColor};margin:0 auto;display:block;width:10px"></div>
        `,
        className: '',
        iconSize: [70, 32],
        iconAnchor: [35, 32],
      })

      const marker = L.marker([station.lat, station.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width:180px;font-family:system-ui,sans-serif">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
              <div style="background:${pinColor};color:white;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700">${brand.short}</div>
              <div style="font-weight:600;font-size:13px">${station.name}</div>
            </div>
            <div style="font-size:20px;font-weight:700;color:${pinColor};margin-bottom:4px">R${price.toFixed(2)}/L</div>
            <div style="font-size:11px;color:#6b7280;margin-bottom:6px">${fuel} · ${station.area}</div>
            ${station.highway ? `<div style="font-size:11px;font-weight:600;color:#854F0B;background:#FAEEDA;padding:2px 6px;border-radius:4px;display:inline-block;margin-bottom:6px">${station.highway}</div>` : ''}
            <div style="font-size:11px;color:#6b7280">${station.amenities.slice(0, 3).join(' · ')}</div>
          </div>
        `, { maxWidth: 220 })
        .on('click', () => onSelect(station.id))

      markersRef.current.push(marker)
    })
  }

  // Re-render markers when fuel/selection changes
  useEffect(() => {
    if (!mapInstanceRef.current) return
    import('leaflet').then(L => {
      renderMarkers(L, mapInstanceRef.current)
    })
  }, [stations, fuel, officialPrice, selectedId])

  // Pan to selected station
  useEffect(() => {
    if (!selectedId || !mapInstanceRef.current) return
    const station = stations.find(s => s.id === selectedId)
    if (station) {
      mapInstanceRef.current.flyTo([station.lat, station.lng], 13, { duration: 0.8 })
    }
  }, [selectedId])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />
      <div
        ref={mapRef}
        style={{ height: '100%', width: '100%', borderRadius: '16px', overflow: 'hidden' }}
      />
    </>
  )
}
