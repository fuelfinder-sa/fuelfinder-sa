export const BRAND_LOGOS: Record<string, string> = {
  BP:            '/brands/bp.png',
  Shell:         '/brands/shell.png',
  Engen:         '/brands/engen.png',
  Sasol:         '/brands/sasol.png',
  TotalEnergies: '/brands/total.png',
  Astron:        '/brands/astron.png',
  Puma:          '/brands/puma.png',
}

export const BRAND_META: Record<string, {
  bg: string; text: string; short: string; color: string; darkBg?: boolean
}> = {
  BP:            { bg: 'bg-green-50',   text: 'text-green-900',  short: 'BP', color: '#009900' },
  Shell:         { bg: 'bg-black',      text: 'text-yellow-400', short: 'SH', color: '#DD0000', darkBg: true },
  Engen:         { bg: 'bg-white',      text: 'text-red-700',    short: 'EN', color: '#E30613' },
  Sasol:         { bg: 'bg-blue-50',    text: 'text-blue-900',   short: 'SA', color: '#003087' },
  TotalEnergies: { bg: 'bg-white',      text: 'text-red-600',    short: 'TE', color: '#C8102E' },
  Astron:        { bg: 'bg-purple-50',  text: 'text-purple-800', short: 'AS', color: '#6B21A8' },
  Caltex:        { bg: 'bg-blue-100',   text: 'text-blue-900',   short: 'CA', color: '#003087' },
  Puma:          { bg: 'bg-red-600',    text: 'text-white',      short: 'PU', color: '#CC0000' },
  Masana:        { bg: 'bg-teal-100',   text: 'text-teal-900',   short: 'MA', color: '#008080' },
  Independent:   { bg: 'bg-gray-100',   text: 'text-gray-700',   short: 'IN', color: '#6B7280' },
}

export function getBrandMeta(brand: string) {
  return BRAND_META[brand] || BRAND_META['Independent']
}
