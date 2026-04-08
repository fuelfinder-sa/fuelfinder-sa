'use client'
import { useState } from 'react'
import { Station } from '@/data/types'

function Stars({ v, sm }: { v: number; sm?: boolean }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`${sm ? 'w-3 h-3' : 'w-3.5 h-3.5'} ${i <= Math.round(v) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </span>
  )
}

const TIER_BADGE: Record<string, string> = {
  diamond: 'bg-purple-100 text-purple-800',
  verified: 'bg-green-100 text-green-800',
  reporter: 'bg-blue-100 text-blue-800',
  new: 'bg-gray-100 text-gray-600',
}

export function RatingCompact({ station }: { station: Station }) {
  const r = station.rating
  return (
    <div className="flex items-center gap-1.5">
      <Stars v={r.overall} sm/>
      <span className="text-xs font-semibold text-gray-700">{r.overall.toFixed(1)}</span>
      <span className="text-xs text-gray-400">({r.reviewCount})</span>
    </div>
  )
}

export default function StationRating({ station }: { station: Station }) {
  const [open, setOpen] = useState(false)
  const r = station.rating
  return (
    <div>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 text-left group">
        <Stars v={r.overall}/>
        <span className="text-sm font-bold text-gray-900">{r.overall.toFixed(1)}</span>
        <span className="text-xs text-gray-400">{r.reviewCount} reviews</span>
        <span className="ml-auto text-xs text-amber-700 group-hover:underline">{open ? '▲ Less' : '▼ Details'}</span>
      </button>
      {open && (
        <div className="mt-3 space-y-2 animate-slide-up">
          {[
            { label: 'Price accuracy', v: r.priceAccuracy },
            { label: 'Service', v: r.service },
            { label: 'Cleanliness', v: r.cleanliness },
          ].map(({ label, v }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-28">{label}</span>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(v/5)*100}%` }}/>
              </div>
              <span className="text-xs font-medium text-gray-700 w-6">{v.toFixed(1)}</span>
            </div>
          ))}
          {station.reviews.length > 0 && (
            <div className="pt-2 border-t border-gray-100 space-y-2.5">
              {station.reviews.slice(0,2).map(rv => (
                <div key={rv.id}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-800">
                      {rv.userHandle[0]}
                    </div>
                    <span className="text-xs font-medium text-gray-800">{rv.userHandle}</span>
                    <span className={`text-xs px-1.5 rounded ${TIER_BADGE[rv.userTier]}`}>{rv.userTier}</span>
                    <Stars v={rv.overallRating} sm/>
                    <span className="text-xs text-gray-400 ml-auto">{rv.date}</span>
                  </div>
                  {rv.comment && <p className="text-xs text-gray-600 leading-relaxed ml-7">{rv.comment}</p>}
                </div>
              ))}
              <button className="text-xs text-amber-700 font-medium hover:underline">
                Write a review (GPS verified only) →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
