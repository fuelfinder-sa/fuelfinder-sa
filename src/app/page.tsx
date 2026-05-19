'use client'
import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { STATIONS, OFFICIAL_PRICES, FUEL_TYPES, PROVINCES, HIGHWAYS } from '@/data/stations'
import { FuelType, VehicleProfile } from '@/data/types'
import { sortStations, getOfficialPrice, getPriceDiff, calcTripCost, calcTankSavings, calcNetBenefit, haversine } from '@/lib/fuel'
import BrandLogo from '@/components/BrandLogo'
import TrustBadge from '@/components/TrustBadge'
import StationRating, { RatingCompact } from '@/components/StationRating'
import { VehiclePanel } from '@/components/VehiclePanel'
import FilterPanel, { Filters, DEFAULT_FILTERS } from '@/components/FilterPanel'
import { CarbonTracker, EmployerBenefit, FillupTracker, PriceHistory, WhatsAppShare, ReporterLeaderboard } from '@/components/Features'
const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

type Tab = 'search' | 'history' | 'tracker' | 'carbon' | 'employer' | 'leaderboard'
type ViewMode = 'list' | 'grid' | 'map'
const DEFAULT_PROFILE: VehicleProfile = { consumption: 9.5, tankSize: 70, fuelType: 'Diesel 50ppm' }

export default function Home() {
  const [profile, setProfile] = useState<VehicleProfile>(DEFAULT_PROFILE)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [province, setProvince] = useState('All')
  const [highway, setHighway] = useState('All')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [locating, setLocating] = useState(false)
  const [tab, setTab] = useState<Tab>('search')
  const [zone, setZone] = useState<'coast' | 'inland'>('coast')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [headerCollapsed, setHeaderCollapsed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fuel: FuelType = profile.fuelType
  const official = getOfficialPrice(OFFICIAL_PRICES, fuel, zone)

  const stationsWithDist = useMemo(() =>
    STATIONS.map(s => ({
      ...s,
      dist: userLocation ? haversine(userLocation[0], userLocation[1], s.lat, s.lng) : 0,
    })), [userLocation])

  const filtered = useMemo(() => stationsWithDist.filter(s => {
    if (s.prices[fuel] > filters.maxPrice && filters.maxPrice < 34.9) return false
    if (userLocation && s.dist > filters.maxDist && filters.maxDist < 19999) return false
    if (filters.only24 && !s.open24) return false
    if (filters.onlyTruck && !s.isTruck) return false
    if (filters.onlyLoyalty && !s.hasLoyalty) return false
    if (filters.trustFilter === 'confirmed' && !['confirmed', 'owner'].includes(s.trust.level)) return false
    if (filters.trustFilter === 'owner' && s.trust.level !== 'owner') return false
    for (const a of filters.amenities) if (!s.amenities.includes(a)) return false
    if (province !== 'All') {
      if (province === 'Highway') { if (!s.highway) return false }
      else if (s.province !== province) return false
    }
    if (highway !== 'All' && s.highway !== highway) return false
    if (search) {
      const q = search.toLowerCase()
      if (!s.name.toLowerCase().includes(q) && !s.area.toLowerCase().includes(q) &&
          !s.brand.toLowerCase().includes(q) && !(s.highway || '').toLowerCase().includes(q) &&
          !s.province.toLowerCase().includes(q)) return false
    }
    return true
  }), [stationsWithDist, fuel, filters, province, highway, search, userLocation])

  const sorted = useMemo(() =>
    sortStations(filtered, filters.sortBy, fuel, official, profile.tankSize, profile.consumption),
    [filtered, filters.sortBy, fuel, official, profile.tankSize, profile.consumption])

  // Price range scoped to filtered results (not whole DB)
  const resultPrices = filtered.map(s => s.prices[fuel])
  const minPrice = resultPrices.length ? Math.min(...resultPrices) : 0
  const maxPrice = resultPrices.length ? Math.max(...resultPrices) : 35
  const spread = filtered.length > 1 ? ((maxPrice - minPrice) * profile.tankSize).toFixed(0) : '0'

  function locate() {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      pos => { setUserLocation([pos.coords.latitude, pos.coords.longitude]); setLocating(false) },
      () => setLocating(false), { timeout: 8000 }
    )
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'search', label: 'Find fuel' },
    { id: 'history', label: 'Trends' },
    { id: 'tracker', label: 'Fill-ups' },
    { id: 'carbon', label: 'Carbon' },
    { id: 'employer', label: 'Employer' },
    { id: 'leaderboard', label: 'Reporters' },
  ]

  const PROV_ABBR: Record<string, string> = {
    'All': 'All SA', 'Western Cape': 'WC', 'Gauteng': 'Gauteng',
    'KwaZulu-Natal': 'KZN', 'Eastern Cape': 'EC', 'Free State': 'FS',
    'Limpopo': 'LP', 'Mpumalanga': 'MP', 'North West': 'NW',
    'Northern Cape': 'NC', 'Highway': 'Highways',
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Header ───────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        {/* Main header row */}
        <div className="max-w-screen-xl mx-auto px-3 py-2 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-700 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-amber-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <span className="font-bold text-gray-900 text-sm">FuelFinder SA</span>
          <span className="hidden lg:inline text-xs text-gray-400">· {STATIONS.length} stations · All 9 provinces</span>

          {/* Search — expands on mobile */}
          <div className="flex-1 relative hidden sm:block">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search station, area, brand..."
              className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-amber-400 focus:bg-white"/>
            <svg className="absolute left-2.5 top-2 w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>

          <div className="flex gap-0.5 ml-auto">
            {/* Coast/Inland */}
            <div className="flex gap-0 bg-gray-100 rounded-lg p-0.5">
              {(['coast', 'inland'] as const).map(z => (
                <button key={z} onClick={() => setZone(z)}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-all capitalize ${zone === z ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
                  {z}
                </button>
              ))}
            </div>

            {/* GPS */}
            <button onClick={locate}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                userLocation ? 'bg-green-50 border-green-300 text-green-700' : 'border-gray-200 text-gray-600'
              } ${locating ? 'animate-pulse' : ''}`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
              </svg>
              <span className="hidden sm:inline">{locating ? '...' : userLocation ? 'Located' : 'Near me'}</span>
            </button>

            {/* View toggle: list / grid / map */}
            <div className="flex gap-0 bg-gray-100 rounded-xl p-0.5">
              {([
                { m: 'list', icon: '≡' },
                { m: 'grid', icon: '⊞' },
                { m: 'map', icon: '⊙' },
              ] as { m: ViewMode; icon: string }[]).map(({ m, icon }) => (
                <button key={m} onClick={() => setViewMode(m)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
                  {icon}
                </button>
              ))}
            </div>

            {/* Collapse toggle */}
            <button onClick={() => setHeaderCollapsed(!headerCollapsed)}
              className="px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-500 hover:bg-gray-50"
              title={headerCollapsed ? 'Show details' : 'Collapse header'}>
              {headerCollapsed ? '▼' : '▲'}
            </button>
          </div>
        </div>

        {/* Collapsible section */}
        {!headerCollapsed && (
          <>
            {/* Nav tabs */}
            <div className="border-t border-gray-100 overflow-x-auto">
              <div className="max-w-screen-xl mx-auto px-3 flex gap-0 min-w-max">
                {TABS.map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className={`px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-all ${
                      tab === t.id ? 'border-amber-700 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* DMRE prices */}
            {tab === 'search' && (
              <div className="border-t border-gray-50 bg-gray-50 overflow-x-auto">
                <div className="max-w-screen-xl mx-auto px-3 py-1.5 flex items-center gap-2 min-w-max">
                  <span className="text-xs text-gray-400 flex-shrink-0">DMRE max ({zone}):</span>
                  {FUEL_TYPES.map(f => (
                    <button key={f} onClick={() => setProfile(p => ({ ...p, fuelType: f as FuelType }))}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs whitespace-nowrap flex-shrink-0 transition-all ${
                        fuel === f ? 'bg-amber-50 border-amber-300 text-amber-800 font-semibold' : 'bg-white border-gray-200 text-gray-600'
                      }`}>
                      <span>{f}</span>
                      <span className="font-bold">R{OFFICIAL_PRICES[zone][f as FuelType].toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </header>

      {/* Alert bar — collapsible */}
      {!headerCollapsed && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-screen-xl mx-auto px-3 py-1.5">
            <p className="text-xs text-amber-800">
              <span className="font-semibold">May 2026:</span> Diesel hit R30.62/L (up R12.78 in 60 days). Strait of Hormuz crisis. Brent at $109/barrel.
              {filtered.length > 1 && tab === 'search' && <span className="font-semibold"> Spread in view: R{spread} on {profile.tankSize}L.</span>}
            </p>
          </div>
        </div>
      )}

      {/* ── SEARCH TAB ─────────────────────────── */}
      {tab === 'search' && (
        <>
          {/* Province + highway filter */}
          <div className="bg-white border-b border-gray-100 overflow-x-auto">
            <div className="max-w-screen-xl mx-auto px-3 py-2 flex items-center gap-1.5 min-w-max">
              {PROVINCES.map(p => (
                <button key={p} onClick={() => { setProvince(p); setHighway('All') }}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap transition-all ${
                    province === p ? 'bg-amber-700 border-amber-700 text-white' : 'border-gray-200 text-gray-600 hover:border-amber-300'
                  }`}>
                  {PROV_ABBR[p] || p}
                </button>
              ))}
              {province === 'Highway' && (
                <><span className="text-gray-300">|</span>
                  {HIGHWAYS.map(h => (
                    <button key={h} onClick={() => setHighway(h)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                        highway === h ? 'bg-blue-700 border-blue-700 text-white' : 'border-gray-200 text-gray-600'
                      }`}>{h}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden max-w-screen-xl w-full mx-auto"
            style={{ minHeight: 'calc(100vh - 160px)' }}>

            {/* ── Sidebar — hidden on mobile unless toggled ── */}
            <>
              {/* Mobile filter toggle button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed bottom-4 right-4 z-40 flex items-center gap-2 bg-amber-700 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/>
                </svg>
                {sidebarOpen ? 'Done' : 'Filters'}
                {(filters.amenities.length > 0 || filters.only24 || filters.onlyTruck || filters.onlyLoyalty || filters.maxPrice < 34.9) && (
                  <span className="w-2 h-2 rounded-full bg-white"/>
                )}
              </button>

              {/* Mobile overlay */}
              {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-30 flex">
                  <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setSidebarOpen(false)}/>
                  <div className="relative ml-auto w-80 bg-white h-full overflow-y-auto p-3 space-y-3 animate-slide-up">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900">Filters</span>
                      <button onClick={() => setSidebarOpen(false)} className="text-gray-400 text-lg leading-none">✕</button>
                    </div>
                    <VehiclePanel profile={profile} onChange={setProfile}/>
                    <FilterPanel filters={filters} onChange={setFilters}
                      resultCount={sorted.length} totalCount={STATIONS.length}
                      minPrice={minPrice} maxPriceInResults={maxPrice}/>
                  </div>
                </div>
              )}

              {/* Desktop sidebar — scrolls independently */}
              <div className="hidden lg:flex flex-col w-72 xl:w-80 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
                <div className="p-3 space-y-3">
                  <VehiclePanel profile={profile} onChange={setProfile}/>
                  <FilterPanel filters={filters} onChange={setFilters}
                    resultCount={sorted.length} totalCount={STATIONS.length}
                    minPrice={minPrice} maxPriceInResults={maxPrice}/>
                </div>
              </div>
            </>

            {/* ── Results pane — scrolls independently ── */}
            <div className="flex-1 overflow-y-auto min-w-0">

              {/* Stats + sort bar */}
              <div className="sticky top-0 bg-white border-b border-gray-100 z-10 px-3 py-2">
                {/* Mobile search */}
                <div className="sm:hidden mb-2">
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400"/>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500">{sorted.length} stations</span>
                  {filtered.length > 0 && <>
                    <span className="text-xs font-semibold text-green-700">Best R{minPrice.toFixed(2)}</span>
                    <span className="text-xs text-gray-300">·</span>
                    <span className="text-xs font-semibold text-red-600">Worst R{maxPrice.toFixed(2)}</span>
                    {filtered.length > 1 && <span className="text-xs text-gray-400">· R{spread} spread</span>}
                  </>}
                  <div className="ml-auto flex gap-1">
                    {(['price', 'dist', 'net', 'trust'] as const).map(s => (
                      <button key={s} onClick={() => setFilters(f => ({ ...f, sortBy: s }))}
                        className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                          filters.sortBy === s ? 'bg-amber-700 border-amber-700 text-white' : 'border-gray-200 text-gray-600'
                        }`}>
                        {s === 'price' ? 'Cheapest' : s === 'dist' ? 'Nearest' : s === 'net' ? 'Best value' : 'Trusted'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {viewMode === 'map' ? (
                <div className="flex" style={{ height: 'calc(100vh - 200px)' }}>
                  <div className="flex-1 relative p-2">
                    <MapView stations={filtered} fuel={fuel} officialPrice={official}
                      selectedId={selectedId} onSelect={setSelectedId} userLocation={userLocation}/>
                    <div className="absolute bottom-6 left-6 bg-white rounded-xl border border-gray-200 p-2 text-xs z-10 shadow-sm">
                      <div className="font-semibold text-gray-700 mb-1">Price vs DMRE max</div>
                      {[
                        { l: 'Well below', c: '#16a34a' }, { l: 'Below', c: '#65a30d' },
                        { l: 'At max', c: '#ca8a04' }, { l: 'Over', c: '#ea580c' },
                        { l: 'Significantly over', c: '#dc2626' },
                      ].map(({ l, c }) => (
                        <div key={l} className="flex items-center gap-1.5 mb-0.5">
                          <div className="w-3 h-3 rounded-sm" style={{ background: c }}/>
                          <span className="text-gray-600">{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-64 border-l border-gray-200 bg-white overflow-y-auto flex-shrink-0">
                    <div className="p-2 border-b border-gray-100 text-xs text-gray-500">{sorted.length} stations</div>
                    <div className="p-2 space-y-1.5">
                      {sorted.slice(0, 25).map(station => {
                        const price = station.prices[fuel]
                        const isOver = price > official + 0.5
                        return (
                          <div key={station.id} onClick={() => setSelectedId(station.id)}
                            className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all ${
                              selectedId === station.id ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
                            }`}>
                            <BrandLogo brand={station.brand} size="sm"/>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium truncate">{station.name}</div>
                              <div className="text-xs text-gray-400 truncate">{station.area}</div>
                            </div>
                            <div className={`text-sm font-bold flex-shrink-0 ${isOver ? 'text-red-600' : 'text-gray-900'}`}>
                              R{price.toFixed(2)}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* List + Grid views */
                <div className="p-3">
                  {sorted.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-400 text-sm">No stations match your filters.</p>
                      <button onClick={() => { setFilters(DEFAULT_FILTERS); setProvince('All'); setHighway('All') }}
                        className="mt-2 text-xs text-amber-700 font-medium">Clear all filters</button>
                    </div>
                  ) : (
                    <div className={viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3'
                      : 'space-y-2.5'
                    }>
                      {sorted.map((station, i) => {
                        const price = station.prices[fuel]
                        const isCheapest = price === minPrice && i === 0
                        const isOver = price > official + 0.5
                        const diff = getPriceDiff(price, official)
                        const dist = userLocation ? station.dist : 5
                        const trip = calcTripCost(station, fuel, dist, profile.consumption)
                        const savings = calcTankSavings(station, fuel, official, profile.tankSize)
                        const net = savings - trip
                        const isExpanded = expandedId === station.id

                        // Savings display logic — show negative cost clearly
                        const savingsDisplay = () => {
                          if (savings <= 0.05) return { text: 'At max price', cls: 'text-gray-400' }
                          if (net > 2) return { text: `+R${net.toFixed(2)} ahead`, cls: 'text-green-600' }
                          if (Math.abs(net) <= 2) return { text: '~Break-even', cls: 'text-gray-500' }
                          return { text: `R${Math.abs(net).toFixed(2)} trip cost > savings`, cls: 'text-red-500' }
                        }
                        const sd = savingsDisplay()

                        return (
                          <div key={station.id}
                            onClick={() => setExpandedId(isExpanded ? null : station.id)}
                            className={`relative bg-white rounded-2xl border cursor-pointer transition-all ${
                              isCheapest ? 'border-green-400' : isOver ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
                            }`}>

                            {/* Left accent */}
                            {isCheapest && <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-2xl"/>}
                            {isOver && !isCheapest && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 rounded-l-2xl"/>}

                            <div className="p-3.5">
                              {/* Top row — NO badges overlapping price */}
                              <div className="flex items-start gap-2.5 mb-2">
                                <BrandLogo brand={station.brand} size="md"/>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start gap-2 flex-wrap">
                                    <div className="font-semibold text-gray-900 text-sm">{station.name}</div>
                                    {/* Badges below name, not overlapping price */}
                                    {isCheapest && (
                                      <span className="text-xs bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded-full">Cheapest</span>
                                    )}
                                    {isOver && !isCheapest && (
                                      <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">
                                        +R{(price - official).toFixed(2)} over max
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                                    <span>{station.area}</span>
                                    {station.province !== 'Highway' && <><span className="text-gray-300">·</span><span>{station.province}</span></>}
                                    {userLocation && <><span className="text-gray-300">·</span><span>{station.dist.toFixed(1)} km</span></>}
                                    {station.highway && (
                                      <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded font-semibold">{station.highway}</span>
                                    )}
                                  </div>
                                </div>
                                {/* Price — clean, no overlapping badge */}
                                <div className="text-right flex-shrink-0 ml-2">
                                  <div className={`text-2xl font-bold ${isOver ? 'text-red-600' : 'text-gray-900'}`}>
                                    R{price.toFixed(2)}
                                  </div>
                                  <div className={`text-xs font-medium mt-0.5 ${
                                    diff.type === 'below' ? 'text-green-600' :
                                    diff.type === 'above' ? 'text-red-500' : 'text-gray-400'
                                  }`}>{diff.label}</div>
                                </div>
                              </div>

                              {/* Trust + rating row */}
                              <div className="flex items-center gap-2 flex-wrap mb-2">
                                <TrustBadge level={station.trust.level} reports={station.trust.reports} age={station.trust.age} compact/>
                                <div className="flex items-center gap-1">
                                  <div className="w-10 h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${
                                      station.trust.confidence > 80 ? 'bg-green-500' :
                                      station.trust.confidence > 50 ? 'bg-amber-400' : 'bg-red-400'
                                    }`} style={{ width: `${station.trust.confidence}%` }}/>
                                  </div>
                                  <span className="text-xs text-gray-400">{station.trust.confidence}%</span>
                                </div>
                                <span className="text-gray-200">·</span>
                                <RatingCompact station={station}/>
                              </div>

                              {/* Amenities */}
                              <div className="flex flex-wrap gap-1 mb-2">
                                {station.amenities.slice(0, viewMode === 'grid' ? 3 : 5).map(a => (
                                  <span key={a} className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">{a}</span>
                                ))}
                                {station.hasLoyalty && (
                                  <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-medium">{station.loyaltyName}</span>
                                )}
                                {station.open24 && (
                                  <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-medium">24h</span>
                                )}
                                {station.isTruck && (
                                  <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">Truck</span>
                                )}
                              </div>

                              {/* Trip calc — clearly shows round-trip + negative savings */}
                              <div className="bg-gray-50 rounded-xl px-3 py-2 flex items-center justify-between gap-2 mb-2">
                                <div className="text-xs text-gray-500 flex-1">
                                  {userLocation
                                    ? `${station.dist.toFixed(1)}km round trip: R${trip.toFixed(2)}`
                                    : `~5km round trip: R${trip.toFixed(2)}`}
                                  {savings > 0.05 && (
                                    <span className="ml-1">· Tank saves: <span className="font-medium text-gray-700">R{savings.toFixed(2)}</span></span>
                                  )}
                                </div>
                                <span className={`text-xs font-semibold whitespace-nowrap ${sd.cls}`}>{sd.text}</span>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <WhatsAppShare stationName={station.name} price={price} fuel={fuel} savings={savings} area={station.area}/>
                                <button onClick={e => e.stopPropagation()} className="text-xs text-gray-400 hover:text-amber-700">Report price</button>
                                <a href={`https://waze.com/ul?ll=${station.lat},${station.lng}&navigate=yes`}
                                  target="_blank" rel="noopener noreferrer"
                                  className="ml-auto text-xs text-blue-600 font-medium hover:underline"
                                  onClick={e => e.stopPropagation()}>
                                  Navigate →
                                </a>
                              </div>

                              {/* Expanded rating */}
                              {isExpanded && (
                                <div className="mt-3 pt-3 border-t border-gray-100 animate-slide-up">
                                  <StationRating station={station}/>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <div className="text-center pt-4 pb-20 lg:pb-6">
                    <p className="text-xs text-gray-400">{STATIONS.length} stations · All 9 provinces · May 2026</p>
                    <button className="mt-1 text-xs text-amber-700 font-medium hover:underline">
                      Own a station? Claim your listing →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── OTHER TABS ────────────────────────── */}
      {tab !== 'search' && (
        <div className="max-w-2xl mx-auto w-full px-4 py-6 space-y-4 pb-20">
          {tab === 'history' && (
            <>
              <PriceHistory fuel={fuel} zone={zone}/>
              <PriceHistory fuel={fuel === 'Diesel 50ppm' ? '95 ULP' : 'Diesel 50ppm'} zone={zone}/>
            </>
          )}
          {tab === 'tracker' && <FillupTracker/>}
          {tab === 'carbon' && <CarbonTracker fuelType={fuel}/>}
          {tab === 'employer' && <EmployerBenefit/>}
          {tab === 'leaderboard' && (
            <>
              <ReporterLeaderboard/>
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">How to earn points</h3>
                <div className="space-y-0">
                  {[
                    ['Report a price (GPS verified)', '+5 pts'],
                    ['Price confirmed by 2+ others', '+10 pts'],
                    ['Photo proof submitted', '+15 pts'],
                    ['Add missing station', '+25 pts'],
                    ['Leave GPS-gated review', '+8 pts'],
                    ['30-day streak bonus', '+50 pts'],
                  ].map(([a, p]) => (
                    <div key={a} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-xs text-gray-700">{a}</span>
                      <span className="text-xs font-bold text-amber-700">{p}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 bg-purple-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-purple-800 font-medium">Diamond tier (500+ pts) = Free Premium + monthly R200 fuel voucher</p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
