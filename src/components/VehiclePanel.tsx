'use client'
import { FuelType, VehicleProfile } from '@/data/types'

interface Props {
  profile: VehicleProfile
  onChange: (p: VehicleProfile) => void
}

const FUEL_TYPES: FuelType[] = ['95 ULP', '93 ULP', 'Diesel 50ppm', 'Diesel 500ppm']

export default function VehicleProfilePanel({ profile, onChange }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-amber-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h10l2-2v-3" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-900">My vehicle</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-500 mb-1.5 block">Fuel type</label>
          <div className="flex flex-wrap gap-1.5">
            {FUEL_TYPES.map(f => (
              <button
                key={f}
                onClick={() => onChange({ ...profile, fuelType: f })}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                  profile.fuelType === f
                    ? 'bg-amber-700 border-amber-700 text-amber-50'
                    : 'border-gray-200 text-gray-600 hover:border-amber-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-gray-500">Fuel consumption</label>
            <span className="text-xs font-semibold text-gray-900">{profile.consumption.toFixed(1)} L/100km</span>
          </div>
          <input
            type="range" min="5" max="20" step="0.5"
            value={profile.consumption}
            onChange={e => onChange({ ...profile, consumption: +e.target.value })}
            className="w-full accent-amber-700"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-0.5">
            <span>5 L/100km</span><span>20 L/100km</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-gray-500">Tank size</label>
            <span className="text-xs font-semibold text-gray-900">{profile.tankSize} L</span>
          </div>
          <input
            type="range" min="30" max="120" step="5"
            value={profile.tankSize}
            onChange={e => onChange({ ...profile, tankSize: +e.target.value })}
            className="w-full accent-amber-700"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-0.5">
            <span>30 L</span><span>120 L</span>
          </div>
        </div>
      </div>
    </div>
  )
}
