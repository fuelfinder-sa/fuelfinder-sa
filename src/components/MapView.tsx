'use client'
import { useEffect, useRef } from 'react'
import { Station, FuelType } from '@/data/types'

function pinColor(price: number, official: number): string {
  const d = price - official
  if (d < -0.5) return '#16a34a'
  if (d < 0)    return '#65a30d'
  if (d < 0.1)  return '#ca8a04'
  if (d < 2.0)  return '#ea580c'
  return '#dc2626'
}

export default function MapView({ stations, fuel, officialPrice, selectedId, onSelect, userLocation }: {
  stations: Station[]; fuel: FuelType; officialPrice: number
  selectedId: string|null; onSelect: (id: string) => void; userLocation: [number,number]|null
}) {
  const ref = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const markers = useRef<any[]>([])

  useEffect(() => {
    if (!ref.current || map.current) return
    import('leaflet').then(L => {
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })
      const m = L.map(ref.current!, { center: [-29.5, 25.5], zoom: 5 })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap', maxZoom: 18,
      }).addTo(m)
      map.current = m
      drawMarkers(L, m)
    })
    return () => { if (map.current) { map.current.remove(); map.current = null } }
  }, [])

  function drawMarkers(L: any, m: any) {
    markers.current.forEach(mk => mk.remove())
    markers.current = []
    if (userLocation) {
      const icon = L.divIcon({ html: `<div style="width:12px;height:12px;background:#854F0B;border:2.5px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.4)"></div>`, className:'', iconSize:[12,12], iconAnchor:[6,6] })
      const mk = L.marker(userLocation, { icon }).addTo(m).bindPopup('<b>Your location</b>')
      markers.current.push(mk)
    }
    stations.forEach(s => {
      const price = s.prices[fuel]
      const color = pinColor(price, officialPrice)
      const sel = s.id === selectedId
      const icon = L.divIcon({
        html: `<div style="background:${color};color:white;padding:3px 6px;border-radius:7px;font-size:11px;font-weight:700;box-shadow:0 2px 8px rgba(0,0,0,.3);border:${sel?'2.5px solid #854F0B':'2px solid white'};transform:${sel?'scale(1.15)':'scale(1)'}">R${price.toFixed(2)}</div><div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid ${color};margin:0 auto"></div>`,
        className:'', iconSize:[70,30], iconAnchor:[35,30],
      })
      const mk = L.marker([s.lat, s.lng], { icon }).addTo(m)
        .bindPopup(`<div style="font-family:system-ui;min-width:160px"><div style="font-weight:600;font-size:13px;margin-bottom:4px">${s.name}</div><div style="font-size:20px;font-weight:700;color:${color}">R${price.toFixed(2)}/L</div><div style="font-size:11px;color:#666;margin-top:2px">${fuel} · ${s.area}${s.highway?' · '+s.highway:''}</div></div>`, { maxWidth:200 })
        .on('click', () => onSelect(s.id))
      markers.current.push(mk)
    })
  }

  useEffect(() => {
    if (!map.current) return
    import('leaflet').then(L => drawMarkers(L, map.current))
  }, [stations, fuel, officialPrice, selectedId])

  useEffect(() => {
    if (!selectedId || !map.current) return
    const s = stations.find(x => x.id === selectedId)
    if (s) map.current.flyTo([s.lat, s.lng], 13, { duration: 0.8 })
  }, [selectedId])

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"/>
      <div ref={ref} style={{ height:'100%', width:'100%', borderRadius:'16px', overflow:'hidden' }}/>
    </>
  )
}
