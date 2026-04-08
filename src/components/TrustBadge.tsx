'use client'
import { TrustLevel } from '@/data/types'

const CFG: Record<TrustLevel, { label: string; bg: string; text: string; dot: string }> = {
  owner:     { label: 'Station verified', bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-600' },
  confirmed: { label: 'Community confirmed', bg: 'bg-teal-100', text: 'text-teal-800', dot: 'bg-teal-600' },
  single:    { label: '1 report', bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  disputed:  { label: 'Disputed', bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
  stale:     { label: 'Stale', bg: 'bg-gray-100', text: 'text-gray-400', dot: 'bg-gray-300' },
}

export default function TrustBadge({ level, reports, age, compact }: {
  level: TrustLevel; reports?: number; age?: string; compact?: boolean
}) {
  const c = CFG[level]
  const label = level === 'confirmed' && reports ? `Confirmed (${reports})` : c.label
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`}/>
      {label}
      {!compact && age && <span className="text-xs opacity-60 ml-1">{age}</span>}
    </span>
  )
}
