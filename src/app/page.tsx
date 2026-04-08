'use client'
import { useState, useMemo, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { STATIONS, OFFICIAL_PRICES, FUEL_TYPES, PROVINCES, BRAND_COLORS } from '@/data/stations'
import { FuelType, VehicleProfile } from '@/data/types'
import { sortStations, getOfficialPrice, getPriceDiff, calcTripCost, calcTankSavings, calcNetBenefit } from '@/lib/fuel'
import TrustBadge from '@/components/TrustBadge'
import FilterPanel, { Filters } from '@/components/FilterPanel'
import VehiclePanel from '@/components/VehiclePanel'

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

const DEFAULT_PROFILE: VehicleProfile = { consumption: 9.5, tankSize: 70, fuelType: 'Diesel 50ppm' }
const DEFAULT_FILTERS: Filters = {
  maxPrice: 35, maxDist: 20000, trustFilter: 'all',
  amenities: [], only24: false, onlyTruck: false, onlyLoyalty: false, sortBy: 'price',
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

export default function Home() {
  const [profile, setProfile] = useState<VehicleProfile>(DEFAULT_PROFILE)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [province, setProvince] = useState<string>('All provinces')
  const [highway, setHighway] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [locating, setLocating] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fuel: FuelType = profile.fuelType
  const official = getOfficialPrice(OFFICIAL_PRICES, fuel, 'coast')

  // Distance-aware stations
  const stationsWithDist = useMemo(() => {
    return STATIONS.map(s => ({
      ...s,
      dist: userLocation ? haversine(userLocation[0], userLocation[1], s.lat, s.lng) : 0,
    }))
  }, [userLocation])

  const filtered = useMemo(() => {
    return stationsWithDist.filter(s => {
      if (s.prices[fuel] > filters.maxPrice && filters.maxPrice < 34.9) return false
      if (userLocation && s.dist > filters.maxDist && filters.maxDist < 19999) return false
      if (filters.only24 && !s.open24) return false
      if (filters.onlyTruck && !s.isTruck) return false
      if (filters.onlyLoyalty && !s.hasLoyalty) return false
      if (filters.trustFilter === 'confirmed' && !['confirmed','owner'].includes(s.trust.level)) return false
      if (filters.trustFilter === 'owner' && s.trust.level !== 'owner') return false
      for (const a of filters.amenities) if (!s.amenities.includes(a)) return false
      if (province !== 'All provinces') {
        if (province === 'Highway') { if (!s.highway) return false }
        else if (s.province !== province) return false
      }
      if (highway !== 'All' && s.highway !== highway) return false
      if (search) {
        const q = search.toLowerCase()
        if (!s.name.toLowerCase().includes(q) && !s.area.toLowerCase().includes(q) &&
            !s.brand.toLowerCase().includes(q) && !(s.highway||'').toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [stationsWithDist, fuel, filters, province, highway, search, userLocation])

  const sorted = useMemo(() =>
    sortStations(filtered, filters.sortBy, fuel, official, profile.tankSize, profile.consumption),
    [filtered, filters.sortBy, fuel, official, profile.tankSize, profile.consumption]
  )

  const allPrices = STATIONS.map(s => s.prices[fuel])
  const minPrice = Math.min(...filtered.map(s => s.prices[fuel]))
  const maxPrice2 = Math.max(...filtered.map(s => s.prices[fuel]))
  const spread = filtered.length > 1 ? ((maxPrice2 - minPrice) * profile.tankSize).toFixed(0) : '0'

  function locate() {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude])
        setLocating(false)
        if (viewMode === 'map') {
          // map will auto-pan via useEffect in MapView
        }
      },
      () => setLocating(false),
      { timeout: 8000 }
    )
  }

  const selectedStation = sorted.find(s => s.id === selectedId) || sorted[0]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-3 py-2.5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-700 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-amber-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-bold text-gray-900 text-sm">FuelFinder SA</span>
            <span className="hidden sm:inline text-xs text-gray-400 ml-1.5">· {STATIONS.length} stations · WC · GP · KZN · Highways</span>
          </div>

          {/* Search */}
          <div className="relative hidden sm:block">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search station, area, brand..."
              className="w-48 md:w-64 pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-amber-400 focus:bg-white"
            />
            <svg className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>

          {/* GPS */}
          <button
            onClick={locate}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              userLocation ? 'bg-green-50 border-green-300 text-green-700' : 'border-gray-200 text-gray-600 hover:border-amber-300'
            } ${locating ? 'animate-pulse' : ''}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
            </svg>
            {locating ? 'Locating...' : userLocation ? 'Located' : 'Near me'}
          </button>

          {/* Map / List toggle */}
          <div className="flex bg-gray-100 rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'map' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              Map
            </button>
          </div>
        </div>

        {/* Price strip */}
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="max-w-screen-xl mx-auto px-3 py-2 flex items-center gap-2 overflow-x-auto">
            <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">DMRE max (coast):</span>
            {FUEL_TYPES.map(f => (
              <button
                key={f}
                onClick={() => setProfile(p => ({ ...p, fuelType: f as FuelType }))}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition-all whitespace-nowrap flex-shrink-0 ${
                  fuel === f ? 'bg-amber-50 border-amber-300 text-amber-800 font-semibold' : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                <span>{f}</span>
                <span className="font-bold">R{OFFICIAL_PRICES.coast[f as FuelType].toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Alert bar ────────────────────────────────────────────── */}
      <div className="bg-amber-50 border-b border-amber-200 px-3 py-2">
        <p className="text-xs text-amber-800 max-w-screen-xl mx-auto">
          <span className="font-semibold">April 2026:</span> Diesel surged R7.51/L — coastal 50ppm R25.35/L.
          {filtered.length > 1 && <span className="font-semibold"> Price spread in view: R{spread} on a {profile.tankSize}L tank.</span>}
        </p>
      </div>

      {/* ── Province + Highway filters ───────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-3 py-2 overflow-x-auto">
        <div className="flex items-center gap-2 max-w-screen-xl mx-auto">
          <span className="text-xs text-gray-400 flex-shrink-0">Province:</span>
          <div className="flex gap-1.5">
            {PROVINCES.map(p => (
              <button
                key={p}
                onClick={() => { setProvince(p); setHighway('All') }}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
                  province === p ? 'bg-amber-700 border-amber-700 text-white' : 'border-gray-200 text-gray-600 hover:border-amber-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          {province === 'Highway' && (
            <>
              <span className="text-xs text-gray-400 flex-shrink-0 ml-2">Route:</span>
              {['All','N1','N2','N3'].map(h => (
                <button
                  key={h}
                  onClick={() => setHighway(h)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    highway === h ? 'bg-blue-700 border-blue-700 text-white' : 'border-gray-200 text-gray-600'
                  }`}
                >{h}</button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden max-w-screen-xl w-full mx-auto">

        {/* Sidebar */}
        <div className={`${viewMode === 'map' ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-72 xl:w-80 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto`}>
          <div className="p-3 space-y-3">
            <VehiclePanel profile={profile} onChange={setProfile} />
            <FilterPanel filters={filters} onChange={setFilters} resultCount={sorted.length} totalCount={STATIONS.length} />
          </div>
        </div>

        {/* Results area */}
        <div className="flex-1 overflow-y-auto">
          {/* Stats row */}
          <div className="sticky top-0 bg-white border-b border-gray-100 z-10 px-3 py-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-gray-500">{sorted.length} stations</span>
              {filtered.length > 0 && (
                <>
                  <span className="text-xs font-semibold text-green-700">Best: R{minPrice.toFixed(2)}/L</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs font-semibold text-red-600">Worst: R{maxPrice2.toFixed(2)}/L</span>
                  {filtered.length > 1 && <span className="text-xs text-gray-500">· R{spread} spread on {profile.tankSize}L</span>}
                </>
              )}
              <div className="ml-auto flex gap-1.5">
                {(['price','dist','net','trust'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setFilters(f => ({ ...f, sortBy: s }))}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      filters.sortBy === s ? 'bg-amber-700 border-amber-700 text-white' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {s === 'price' ? 'Cheapest' : s === 'dist' ? 'Nearest' : s === 'net' ? 'Best value' : 'Trusted'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {viewMode === 'list' ? (
            <div className="p-3 space-y-2.5">
              {/* Mobile search */}
              <div className="sm:hidden">
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {sorted.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-sm">No stations match your filters.</p>
                  <button onClick={() => { setFilters(DEFAULT_FILTERS); setProvince('All provinces'); setHighway('All') }}
                    className="mt-2 text-xs text-amber-700 font-medium">Clear all filters</button>
                </div>
              ) : (
                sorted.map((station, i) => {
                  const price = station.prices[fuel]
                  const isCheapest = price === minPrice && i === 0
                  const isOver = price > official + 0.5
                  const diff = getPriceDiff(price, official)
                  const trip = calcTripCost(station, fuel, userLocation ? station.dist : 5, profile.consumption)
                  const savings = calcTankSavings(station, fuel, official, profile.tankSize)
                  const net = savings - trip
                  const brand = BRAND_COLORS[station.brand] || { bg: 'bg-gray-100', text: 'text-gray-700', short: 'XX', color: '#888' }

                  return (
                    <div
                      key={station.id}
                      onClick={() => setSelectedId(station.id === selectedId ? null : station.id)}
                      className={`relative bg-white rounded-2xl border cursor-pointer transition-all ${
                        isCheapest ? 'border-green-400' : isOver ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
                      } ${selectedId === station.id ? 'ring-2 ring-amber-400' : ''}`}
                    >
                      {isCheapest && <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-2xl"/>}
                      {isOver && !isCheapest && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 rounded-l-2xl"/>}
                      {isCheapest && <div className="absolute top-2.5 right-2.5 bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">Cheapest</div>}
                      {isOver && !isCheapest && <div className="absolute top-2.5 right-2.5 bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">+R{(price-official).toFixed(2)} over</div>}

                      <div className="p-3.5">
                        <div className="flex items-start gap-2.5 mb-2.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${brand.bg} ${brand.text}`}>
                            {brand.short}
                          </div>
                          <div className="flex-1 min-w-0 pr-20">
                            <div className="font-semibold text-gray-900 text-sm truncate">{station.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                              <span>{station.area}</span>
                              {userLocation && <span>· {station.dist.toFixed(1)} km</span>}
                              {station.highway && (
                                <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded font-semibold">{station.highway}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className={`text-xl font-bold ${isOver ? 'text-red-600' : 'text-gray-900'}`}>R{price.toFixed(2)}</div>
                            <div className={`text-xs mt-0.5 font-medium ${diff.type==='below'?'text-green-600':diff.type==='above'?'text-red-500':'text-gray-400'}`}>
                              {diff.label}
                            </div>
                          </div>
                        </div>

                        <div className="mb-2.5">
                          <TrustBadge level={station.trust.level} reports={station.trust.reports} age={station.trust.age} compact />
                        </div>

                        <div className="flex flex-wrap gap-1 mb-2.5">
                          {station.amenities.slice(0,4).map(a => (
                            <span key={a} className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">{a}</span>
                          ))}
                          {station.hasLoyalty && <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-medium">{station.loyaltyName}</span>}
                          {station.open24 && <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-medium">24h</span>}
                          {station.isTruck && <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">Truck</span>}
                        </div>

                        <div className="bg-gray-50 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
                          <span className="text-xs text-gray-500">
                            {userLocation ? `Drive: R${trip.toFixed(2)}` : `~5km fill: R${trip.toFixed(2)}`} ·
                            &nbsp;Saves: <span className="font-medium text-gray-700">R{Math.max(0,savings).toFixed(2)}</span>
                          </span>
                          <span className={`text-xs font-semibold whitespace-nowrap ${
                            savings <= 0.05 ? 'text-gray-400' : net > 0 ? 'text-green-600' : Math.abs(net)<2 ? 'text-gray-500' : 'text-red-500'
                          }`}>
                            {savings <= 0.05 ? 'At max' : net > 0 ? `+R${net.toFixed(2)}` : Math.abs(net)<2 ? '~Even' : `-R${Math.abs(net).toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}

              <div className="text-center pt-2 pb-6">
                <p className="text-xs text-gray-400">
                  {STATIONS.length} stations · WC, Gauteng, KZN & major highways · April 2026
                </p>
                <button className="mt-1 text-xs text-amber-700 font-medium hover:text-amber-900">
                  Own a station? Claim your listing →
                </button>
              </div>
            </div>
          ) : (
            /* Map view — full height split */
            <div className="flex h-full" style={{ height: 'calc(100vh - 160px)' }}>
              {/* Map */}
              <div className="flex-1 relative">
                <MapView
                  stations={filtered}
                  fuel={fuel}
                  officialPrice={official}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  userLocation={userLocation}
                />

                {/* Map legend */}
                <div className="absolute bottom-4 left-4 bg-white rounded-xl border border-gray-200 p-2.5 text-xs z-10">
                  <div className="font-semibold text-gray-700 mb-1.5">Pin price vs DMRE max</div>
                  {[
                    { label: 'Below max', color: '#16a34a' },
                    { label: 'At max', color: '#ca8a04' },
                    { label: 'Slightly over', color: '#ea580c' },
                    { label: 'Significantly over', color: '#dc2626' },
                  ].map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-1.5 mb-0.5">
                      <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
                      <span className="text-gray-600">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Side panel — selected station */}
              {sorted.length > 0 && (
                <div className="w-72 xl:w-80 border-l border-gray-200 overflow-y-auto bg-white">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-xs text-gray-500">{sorted.length} stations · click pin to select</p>
                  </div>
                  <div className="p-3 space-y-2">
                    {sorted.slice(0, 12).map(station => {
                      const price = station.prices[fuel]
                      const isOver = price > official + 0.5
                      const brand = BRAND_COLORS[station.brand] || { bg:'bg-gray-100', text:'text-gray-700', short:'XX', color:'#888' }
                      return (
                        <div
                          key={station.id}
                          onClick={() => setSelectedId(station.id)}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                            selectedId === station.id ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${brand.bg} ${brand.text}`}>
                            {brand.short}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-gray-900 truncate">{station.name}</div>
                            <div className="text-xs text-gray-500">{station.area}{station.highway && ` · ${station.highway}`}</div>
                          </div>
                          <div className={`text-sm font-bold flex-shrink-0 ${isOver ? 'text-red-600' : 'text-gray-900'}`}>
                            R{price.toFixed(2)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
