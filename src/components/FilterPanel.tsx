'use client'
import { TrustLevel } from '@/data/types'

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

const AMENITY_LIST = ['Car wash', 'Shop', 'ATM', 'Restaurant', 'Truck bay']

interface Props {
  filters: Filters
  onChange: (f: Filters) => void
  resultCount: number
  totalCount: number
}

export default function FilterPanel({ filters, onChange, resultCount, totalCount }: Props) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch })

  const toggleAmenity = (a: string) => {
    const next = filters.amenities.includes(a)
      ? filters.amenities.filter(x => x !== a)
      : [...filters.amenities, a]
    set({ amenities: next })
  }

  const clearAll = () => onChange({
    maxPrice: 35, maxDist: 20, trustFilter: 'all',
    amenities: [], only24: false, onlyTruck: false, onlyLoyalty: false, sortBy: 'price',
  })

  const hasActive = filters.maxPrice < 35 || filters.maxDist < 20 || filters.trustFilter !== 'all'
    || filters.amenities.length > 0 || filters.only24 || filters.onlyTruck || filters.onlyLoyalty

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
          <p className="text-xs text-gray-400 mt-0.5">{resultCount} of {totalCount} stations</p>
        </div>
        {hasActive && (
          <button onClick={clearAll} className="text-xs text-amber-700 font-medium hover:text-amber-900">
            Clear all
          </button>
        )}
      </div>

      {/* Sort */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Sort by</p>
        <div className="grid grid-cols-2 gap-1.5">
          {(['price', 'dist', 'net', 'trust'] as const).map(s => (
            <button
              key={s}
              onClick={() => set({ sortBy: s })}
              className={`text-xs py-1.5 rounded-lg border font-medium transition-all ${
                filters.sortBy === s
                  ? 'bg-amber-700 border-amber-700 text-white'
                  : 'border-gray-200 text-gray-600 hover:border-amber-300'
              }`}
            >
              {s === 'price' ? 'Cheapest' : s === 'dist' ? 'Nearest' : s === 'net' ? 'Best value' : 'Most trusted'}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <div className="flex justify-between mb-1.5">
          <p className="text-xs text-gray-500">Max price</p>
          <span className="text-xs font-semibold text-gray-900">
            {filters.maxPrice >= 34.9 ? 'Any' : `≤ R${filters.maxPrice.toFixed(2)}/L`}
          </span>
        </div>
        <input
          type="range" min="22" max="35" step="0.5"
          value={filters.maxPrice}
          onChange={e => set({ maxPrice: +e.target.value })}
          className="w-full accent-amber-700"
        />
      </div>

      {/* Distance */}
      <div>
        <div className="flex justify-between mb-1.5">
          <p className="text-xs text-gray-500">Max distance</p>
          <span className="text-xs font-semibold text-gray-900">
            {filters.maxDist >= 19.9 ? 'Any' : `${filters.maxDist} km`}
          </span>
        </div>
        <input
          type="range" min="1" max="20" step="1"
          value={filters.maxDist}
          onChange={e => set({ maxDist: +e.target.value })}
          className="w-full accent-amber-700"
        />
      </div>

      {/* Trust */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Verified status</p>
        <div className="flex flex-col gap-1.5">
          {(['all', 'confirmed', 'owner'] as const).map(t => (
            <button
              key={t}
              onClick={() => set({ trustFilter: t })}
              className={`text-xs text-left px-3 py-2 rounded-lg border transition-all ${
                filters.trustFilter === t
                  ? 'bg-green-50 border-green-400 text-green-800 font-medium'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {t === 'all' ? 'All prices' : t === 'confirmed' ? 'Community confirmed' : 'Station-verified only'}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Amenities</p>
        <div className="flex flex-wrap gap-1.5">
          {AMENITY_LIST.map(a => (
            <button
              key={a}
              onClick={() => toggleAmenity(a)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                filters.amenities.includes(a)
                  ? 'bg-blue-50 border-blue-400 text-blue-800 font-medium'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-2">
        {[
          { key: 'only24', label: 'Open 24 hours' },
          { key: 'onlyTruck', label: 'Truck-friendly' },
          { key: 'onlyLoyalty', label: 'Has loyalty program' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => set({ [key]: !filters[key as keyof Filters] } as Partial<Filters>)}
            className="w-full flex items-center justify-between text-sm text-gray-700 hover:text-gray-900"
          >
            <span className="text-xs">{label}</span>
            <div className={`w-9 h-5 rounded-full transition-colors relative ${filters[key as keyof Filters] ? 'bg-amber-700' : 'bg-gray-200'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${filters[key as keyof Filters] ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
