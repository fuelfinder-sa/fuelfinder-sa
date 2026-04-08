import { FuelType, OfficialPrices, Station, Zone } from '@/data/types'

export function getOfficialPrice(prices: OfficialPrices, fuel: FuelType, zone: Zone): number {
  return prices[zone][fuel]
}

export function calcTripCost(station: Station, fuel: FuelType, distKm: number, consumptionL100: number): number {
  return (distKm * 2 / 100) * consumptionL100 * station.prices[fuel]
}

export function calcTankSavings(station: Station, fuel: FuelType, officialPrice: number, tankSizeL: number): number {
  return Math.max(0, (officialPrice - station.prices[fuel]) * tankSizeL)
}

export function calcNetBenefit(station: Station, fuel: FuelType, officialPrice: number, tankSizeL: number, consumption: number): number {
  return calcTankSavings(station, fuel, officialPrice, tankSizeL) - calcTripCost(station, fuel, station.dist || 5, consumption)
}

export function getPriceDiff(price: number, official: number) {
  const diff = price - official
  if (diff < -0.01) return { label: `R${Math.abs(diff).toFixed(2)} below max`, type: 'below' as const }
  if (diff >  0.01) return { label: `R${diff.toFixed(2)} above max`, type: 'above' as const }
  return { label: 'At official max', type: 'at' as const }
}

export function sortStations(stations: Station[], by: 'price'|'dist'|'net'|'trust', fuel: FuelType, official: number, tank: number, cons: number) {
  const trust = { owner:4, confirmed:3, single:1, disputed:0, stale:0 }
  return [...stations].sort((a,b) => {
    if (by === 'price') return a.prices[fuel] - b.prices[fuel]
    if (by === 'dist')  return a.dist - b.dist
    if (by === 'net')   return calcNetBenefit(b,fuel,official,tank,cons) - calcNetBenefit(a,fuel,official,tank,cons)
    return (trust[b.trust.level]||0) - (trust[a.trust.level]||0)
  })
}

export function haversine(la1: number, ln1: number, la2: number, ln2: number): number {
  const R = 6371, dL = (la2-la1)*Math.PI/180, dN = (ln2-ln1)*Math.PI/180
  const a = Math.sin(dL/2)**2 + Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dN/2)**2
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))
}
