'use client'
import { useState, useMemo } from 'react'
import { STATIONS, OFFICIAL_PRICES, FUEL_TYPES } from '@/data/stations'
import { FuelType, VehicleProfile } from '@/data/types'
import { sortStations, getOfficialPrice } from '@/lib/fuel'
import StationCard from '@/components/StationCard'
import FilterPanel, { Filters } from '@/components/FilterPanel'
import VehiclePanel from '@/components/VehiclePanel'

const DEFAULT_PROFILE: VehicleProfile = { consumption: 9.5, tankSize: 70, fuelType: 'Diesel 50ppm' }
const DEFAULT_FILTERS: Filters = {
  maxPrice: 35, maxDist: 20, trustFilter: 'all',
  amenities: [], only24: false, onlyTruck: false, onlyLoyalty: false, sortBy: 'price',
}

export default function Home() {
  const [profile, setProfile] = useState<VehicleProfile>(DEFAULT_PROFILE)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const fuel: FuelType = profile.fuelType
  const official = getOfficialPrice(OFFICIAL_PRICES, fuel, 'coast')

  const filtered = useMemo(() => {
    return STATIONS.filter(s => {
      if (s.prices[fuel] > filters.maxPrice && filters.maxPrice < 34.9) return false
      if (s.dist > filters.maxDist && filters.maxDist < 19.9) return false
      if (filters.only24 && !s.open24) return false
      if (filters.onlyTruck && !s.isTruck) return false
      if (filters.onlyLoyalty && !s.hasLoyalty) return false
      if (filters.trustFilter === 'confirmed' && !['confirmed','owner'].includes(s.trust.level)) return false
      if (filters.trustFilter === 'owner' && s.trust.level !== 'owner') return false
      for (const a of filters.amenities) if (!s.amenities.includes(a)) return false
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.area.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [fuel, filters, search])

  const sorted = useMemo(() =>
    sortStations(filtered, filters.sortBy, fuel, official, profile.tankSize, profile.consumption),
    [filtered, filters.sortBy, fuel, official, profile.tankSize, profile.consumption]
  )

  const cheapestPrice = sorted.length > 0 ? sorted[0].prices[fuel] : 0
  const allPrices = STATIONS.map(s => s.prices[fuel])
  const spread = ((Math.max(...allPrices) - Math.min(...allPrices)) * profile.tankSize).toFixed(0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-700 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-amber-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div className="flex-1">
            <span className="font-bold text-gray-900 text-sm">FuelFinder SA</span>
            <span className="hidden sm:inline text-xs text-gray-400 ml-2">Crowd-verified fuel prices</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-gray-500 hidden sm:inline">Live · April 2026</span>
          </div>
        </div>
      </header>

      {/* Hero alert */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-2 flex-wrap">
          <div className="w-2 h-2 rounded-full bg-amber-600 flex-shrink-0" />
          <p className="text-xs text-amber-800">
            <span className="font-semibold">April 2026 price alert:</span> Diesel surged R7.51/L on 1 April — coastal 50ppm now R25.35/L. Spread in this area: <span className="font-semibold">R{spread} on a {profile.tankSize}L fill.</span>
          </p>
        </div>
      </div>

      {/* Official prices strip */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">DMRE official max — coastal</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {FUEL_TYPES.map(f => (
              <button
                key={f}
                onClick={() => setProfile(p => ({ ...p, fuelType: f as FuelType }))}
                className={`text-center p-2 rounded-xl border transition-all ${
                  fuel === f
                    ? 'bg-amber-50 border-amber-300'
                    : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                }`}
              >
                <div className={`text-xs mb-0.5 ${fuel === f ? 'text-amber-700 font-medium' : 'text-gray-500'}`}>{f}</div>
                <div className={`text-base font-bold ${fuel === f ? 'text-amber-800' : 'text-gray-700'}`}>
                  R{OFFICIAL_PRICES.coast[f as FuelType].toFixed(2)}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0 space-y-4">
            <VehiclePanel profile={profile} onChange={setProfile} />
            <div className="lg:block">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                resultCount={sorted.length}
                totalCount={STATIONS.length}
              />
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Search + stats */}
            <div className="mb-4 space-y-3">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search station or area..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                  <div className="text-lg font-bold text-green-700">R{cheapestPrice.toFixed(2)}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Cheapest nearby</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                  <div className="text-lg font-bold text-red-600">R{Math.max(...allPrices).toFixed(2)}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Most expensive</div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                  <div className="text-lg font-bold text-amber-700">R{spread}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Spread on {profile.tankSize}L</div>
                </div>
              </div>
            </div>

            {/* Station list */}
            {sorted.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <div className="text-gray-400 text-sm">No stations match your filters.</div>
                <button onClick={() => setFilters(DEFAULT_FILTERS)} className="mt-3 text-xs text-amber-700 font-medium">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {sorted.map((station, i) => (
                  <StationCard
                    key={station.id}
                    station={station}
                    fuel={fuel}
                    officialPrice={official}
                    tankSize={profile.tankSize}
                    consumption={profile.consumption}
                    isCheapest={station.prices[fuel] === cheapestPrice && i === 0}
                    rank={i + 1}
                  />
                ))}
              </div>
            )}

            {/* Footer note */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">
                Prices crowdsourced by community + station owners · DMRE official baseline via fuelsa.co.za · {new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <button
                onClick={() => {}}
                className="mt-2 text-xs text-amber-700 font-medium hover:text-amber-900"
              >
                Own a station? Claim your listing →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
