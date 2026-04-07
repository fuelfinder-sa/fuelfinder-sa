'use client'
import { useState } from 'react'
import { Station, FuelType } from '@/data/types'
import { getPriceDiff, calcTripCost, calcTankSavings, calcNetBenefit } from '@/lib/fuel'
import { BRAND_COLORS } from '@/data/stations'
import TrustBadge from './TrustBadge'

interface Props {
  station: Station
  fuel: FuelType
  officialPrice: number
  tankSize: number
  consumption: number
  isCheapest: boolean
  rank: number
}

export default function StationCard({ station, fuel, officialPrice, tankSize, consumption, isCheapest, rank }: Props) {
  const [reporting, setReporting] = useState(false)
  const [reportPrice, setReportPrice] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const price = station.prices[fuel]
  const diff = getPriceDiff(price, officialPrice)
  const tripCost = calcTripCost(station, fuel, station.dist, consumption)
  const savings = calcTankSavings(station, fuel, officialPrice, tankSize)
  const net = calcNetBenefit(station, fuel, officialPrice, tankSize, consumption)

  const isOverMax = price > officialPrice + 0.5
  const brand = BRAND_COLORS[station.brand] || { bg: 'bg-gray-100', text: 'text-gray-700', short: station.brand.slice(0,2).toUpperCase() }

  const borderClass = isCheapest
    ? 'border-green-400 shadow-sm'
    : isOverMax
    ? 'border-red-300'
    : 'border-gray-200'

  function handleSubmitReport() {
    if (!reportPrice || isNaN(+reportPrice)) return
    setSubmitted(true)
    setReporting(false)
    setReportPrice('')
  }

  return (
    <div className={`relative bg-white rounded-2xl border ${borderClass} overflow-hidden card-hover animate-slide-up`}>

      {/* Left accent bar */}
      {isCheapest && <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-2xl" />}
      {isOverMax && !isCheapest && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 rounded-l-2xl" />}

      {/* Cheapest badge */}
      {isCheapest && (
        <div className="absolute top-3 right-3 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
          Cheapest nearby
        </div>
      )}
      {isOverMax && !isCheapest && (
        <div className="absolute top-3 right-3 bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">
          +R{(price - officialPrice).toFixed(2)} over max
        </div>
      )}

      <div className="p-4">
        {/* Top row: Brand + Station info + Price */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${brand.bg} ${brand.text}`}>
            {brand.short}
          </div>
          <div className="flex-1 min-w-0 pr-16">
            <h3 className="font-semibold text-gray-900 text-sm truncate">{station.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{station.dist.toFixed(1)} km · {station.area}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className={`text-2xl font-bold ${isOverMax ? 'text-red-600' : 'text-gray-900'}`}>
              R{price.toFixed(2)}
            </div>
            <div className={`text-xs mt-0.5 font-medium ${
              diff.type === 'below' ? 'text-green-600' :
              diff.type === 'above' ? 'text-red-500' : 'text-gray-400'
            }`}>
              {diff.label}
            </div>
          </div>
        </div>

        {/* Trust */}
        <div className="mb-3">
          <TrustBadge level={station.trust.level} reports={station.trust.reports} age={station.trust.age} />
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {station.amenities.map(a => (
            <span key={a} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">{a}</span>
          ))}
          {station.hasLoyalty && (
            <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md font-medium">{station.loyaltyName}</span>
          )}
          {station.open24 && (
            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-md font-medium">24h</span>
          )}
          {station.isTruck && (
            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md font-medium">Truck-friendly</span>
          )}
        </div>

        {/* Trip cost banner */}
        <div className="bg-gray-50 rounded-xl px-3 py-2.5 flex items-center justify-between gap-2 mb-3">
          <div className="text-xs text-gray-500">
            Drive: <span className="font-medium text-gray-700">R{tripCost.toFixed(2)}</span> return
            &nbsp;·&nbsp;
            {tankSize}L saves: <span className="font-medium text-gray-700">R{Math.max(0, savings).toFixed(2)}</span>
          </div>
          <div className={`text-xs font-semibold whitespace-nowrap ${
            savings <= 0.05 ? 'text-gray-400' :
            net > 0 ? 'text-green-600' :
            Math.abs(net) < 2 ? 'text-gray-500' : 'text-red-500'
          }`}>
            {savings <= 0.05
              ? 'At max price'
              : net > 0
              ? `Net R${net.toFixed(2)} ahead`
              : Math.abs(net) < 2
              ? '~Break-even'
              : `R${Math.abs(net).toFixed(2)} trip > savings`}
          </div>
        </div>

        {/* Report price */}
        <div className="flex items-center gap-2">
          {!reporting && !submitted && (
            <button
              onClick={() => setReporting(true)}
              className="text-xs text-gray-400 hover:text-amber-700 transition-colors"
            >
              Report a price
            </button>
          )}
          {submitted && (
            <span className="text-xs text-green-600">Thanks — report submitted for review</span>
          )}
          {reporting && (
            <div className="flex items-center gap-2 flex-1 animate-slide-up">
              <span className="text-xs text-gray-500">{fuel}:</span>
              <input
                type="number"
                step="0.01"
                min="20"
                max="45"
                value={reportPrice}
                onChange={e => setReportPrice(e.target.value)}
                placeholder="e.g. 27.50"
                className="w-24 text-sm px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500"
                autoFocus
              />
              <button
                onClick={handleSubmitReport}
                className="text-xs px-3 py-1 bg-green-700 text-white rounded-lg hover:bg-green-800 font-medium"
              >
                Submit
              </button>
              <button
                onClick={() => setReporting(false)}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
