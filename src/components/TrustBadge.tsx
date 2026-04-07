'use client'
import { TrustLevel } from '@/data/types'

const TRUST_CONFIG: Record<TrustLevel, { label: string; bg: string; text: string; bar: string }> = {
  owner:     { label: 'Station verified', bg: 'bg-green-100', text: 'text-green-800', bar: 'trust-bar-owner' },
  confirmed: { label: 'Community confirmed', bg: 'bg-teal-100', text: 'text-teal-800', bar: 'trust-bar-confirmed' },
  single:    { label: '1 report', bg: 'bg-gray-100', text: 'text-gray-600', bar: 'trust-bar-single' },
  disputed:  { label: 'Disputed', bg: 'bg-amber-100', text: 'text-amber-800', bar: 'trust-bar-disputed' },
  stale:     { label: 'Stale', bg: 'bg-gray-100', text: 'text-gray-500', bar: 'trust-bar-stale' },
}

interface Props {
  level: TrustLevel
  reports?: number
  age?: string
  compact?: boolean
}

export default function TrustBadge({ level, reports, age, compact }: Props) {
  const cfg = TRUST_CONFIG[level]
  const label = level === 'confirmed' && reports ? `Confirmed (${reports})` : cfg.label

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${cfg.bg} ${cfg.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.bar}`} />
        {label}
      </span>
    )
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${cfg.bg} ${cfg.text}`}>
        <span className={`w-2 h-2 rounded-full ${cfg.bar}`} />
        {label}
      </span>
      {age && <span className="text-xs text-gray-400">{age}</span>}
    </div>
  )
}
