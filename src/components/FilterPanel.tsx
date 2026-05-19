'use client'

export interface Filters {
  maxPrice: number
  maxDist: number
  trustFilter: 'all' | 'confirmed' | 'owner'
  amenities: string[]
  only24: boolean
  onlyTruck: boolean
  onlyLoyalty: boolean
  sortBy: 'price' | 'dist' | 'net' | 'trust'
}

export const DEFAULT_FILTERS: Filters = {
  maxPrice: 35, maxDist: 20000, trustFilter: 'all',
  amenities: [], only24: false, onlyTruck: false, onlyLoyalty: false, sortBy: 'price',
}

const AMENITY_LIST = ['Car wash', 'Shop', 'ATM', 'Restaurant', 'Truck bay']

const TRUST_OPTIONS = [
  { value: 'all', label: 'All prices', hint: 'DMRE baseline + community reports' },
  { value: 'confirmed', label: 'Community confirmed', hint: '3+ matching reports in 24h' },
  { value: 'owner', label: 'Station verified only', hint: 'Owner-confirmed prices' },
] as const

const SORT_OPTIONS = [
  { value: 'price', label: 'Cheapest' },
  { value: 'dist', label: 'Nearest' },
  { value: 'net', label: 'Best value' },
  { value: 'trust', label: 'Most trusted' },
] as const

interface Props {
  filters: Filters
  onChange: (f: Filters) => void
  resultCount: number
  totalCount: number
  minPrice: number
  maxPriceInResults: number
}

export default function FilterPanel({ filters, onChange, resultCount, totalCount, minPrice, maxPriceInResults }: Props) {
  const set = (p: Partial<Filters>) => onChange({ ...filters, ...p })
  const toggleAmenity = (a: string) => set({
    amenities: filters.amenities.includes(a)
      ? filters.amenities.filter(x => x !== a)
      : [...filters.amenities, a]
  })

  const hasActive = filters.maxPrice < 34.9 || filters.maxDist < 19999
    || filters.trustFilter !== 'all' || filters.amenities.length > 0
    || filters.only24 || filters.onlyTruck || filters.onlyLoyalty

  // Clamp slider to range of results, not full DB
  const sliderMin = Math.max(20, Math.floor(minPrice - 0.5))
  const sliderMax = Math.min(35, Math.ceil(maxPriceInResults + 0.5))

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
          <p className="text-xs text-gray-400 mt-0.5">{resultCount} of {totalCount} stations</p>
        </div>
        {hasActive && (
          <button onClick={() => onChange(DEFAULT_FILTERS)} className="text-xs text-amber-700 font-medium hover:text-amber-900">
            Clear all
          </button>
        )}
      </div>

      {/* Sort — multi button */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Sort by</p>
        <div className="grid grid-cols-2 gap-1.5">
          {SORT_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => set({ sortBy: opt.value })}
              className={`text-xs py-1.5 rounded-lg border font-medium transition-all ${
                filters.sortBy === opt.value
                  ? 'bg-amber-700 border-amber-700 text-white'
                  : 'border-gray-200 text-gray-600 hover:border-amber-300'
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Max price — scoped to result range */}
      <div>
        <div className="flex justify-between mb-1">
          <p className="text-xs text-gray-500">Max price/L</p>
          <span className="text-xs font-semibold text-gray-900">
            {filters.maxPrice >= 34.9 ? 'Any' : `≤ R${filters.maxPrice.toFixed(2)}`}
          </span>
        </div>
        <input type="range" min={sliderMin} max={sliderMax} step="0.25"
          value={Math.min(filters.maxPrice, sliderMax)}
          onChange={e => set({ maxPrice: +e.target.value })}
          className="w-full accent-amber-700"/>
        <div className="flex justify-between text-xs text-gray-400 mt-0.5">
          <span>R{sliderMin.toFixed(2)}</span>
          <span>R{sliderMax.toFixed(2)}</span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">Range based on stations in view</p>
      </div>

      {/* Distance */}
      <div>
        <div className="flex justify-between mb-1">
          <p className="text-xs text-gray-500">Max distance</p>
          <span className="text-xs font-semibold text-gray-900">
            {filters.maxDist >= 19999 ? 'Any' : `${filters.maxDist} km`}
          </span>
        </div>
        <input type="range" min="1" max="50" step="1"
          value={Math.min(filters.maxDist, 50)}
          onChange={e => set({ maxDist: +e.target.value })}
          className="w-full accent-amber-700"/>
      </div>

      {/* Trust — multi-select pills */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Verified status</p>
        <div className="space-y-1.5">
          {TRUST_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => set({ trustFilter: opt.value })}
              className={`w-full text-left px-3 py-2 rounded-lg border transition-all ${
                filters.trustFilter === opt.value
                  ? 'bg-green-50 border-green-400 text-green-800'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}>
              <div className="text-xs font-medium">{opt.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{opt.hint}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Amenities</p>
        <div className="flex flex-wrap gap-1.5">
          {AMENITY_LIST.map(a => (
            <button key={a} onClick={() => toggleAmenity(a)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                filters.amenities.includes(a)
                  ? 'bg-blue-50 border-blue-400 text-blue-800 font-medium'
                  : 'border-gray-200 text-gray-600'
              }`}>
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-2.5">
        {[
          { k: 'only24', l: 'Open 24 hours' },
          { k: 'onlyTruck', l: 'Truck-friendly' },
          { k: 'onlyLoyalty', l: 'Has loyalty program' },
        ].map(({ k, l }) => (
          <button key={k} onClick={() => set({ [k]: !filters[k as keyof Filters] } as any)}
            className="w-full flex items-center justify-between text-xs text-gray-700">
            <span>{l}</span>
            <div className={`w-9 h-5 rounded-full relative transition-colors flex-shrink-0 ${filters[k as keyof Filters] ? 'bg-amber-700' : 'bg-gray-200'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${filters[k as keyof Filters] ? 'translate-x-4' : 'translate-x-0.5'}`}/>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
