import { FuelType, OfficialPrices, Station, Zone } from '@/data/types'

export function getStationPrice(station: Station, fuel: FuelType): number {
  return station.prices[fuel]
}

export function getOfficialPrice(prices: OfficialPrices, fuel: FuelType, zone: Zone): number {
  return prices[zone][fuel]
}

export function calcTripCost(station: Station, fuel: FuelType, distKm: number, consumptionL100: number): number {
  const price = getStationPrice(station, fuel)
  const fuelUsed = (distKm * 2 / 100) * consumptionL100
  return fuelUsed * price
}

export function calcTankSavings(
  station: Station,
  fuel: FuelType,
  officialPrice: number,
  tankSizeL: number
): number {
  const price = getStationPrice(station, fuel)
  return (officialPrice - price) * tankSizeL
}

export function calcNetBenefit(
  station: Station,
  fuel: FuelType,
  officialPrice: number,
  tankSizeL: number,
  consumptionL100: number
): number {
  const trip = calcTripCost(station, fuel, station.dist, consumptionL100)
  const savings = calcTankSavings(station, fuel, officialPrice, tankSizeL)
  return savings - trip
}

export function getPriceDiff(stationPrice: number, officialPrice: number) {
  const diff = stationPrice - officialPrice
  if (diff < -0.01) return { label: `R${Math.abs(diff).toFixed(2)} below max`, type: 'below' as const }
  if (diff > 0.01)  return { label: `R${diff.toFixed(2)} above max`, type: 'above' as const }
  return { label: 'At official max', type: 'at' as const }
}

export function sortStations(
  stations: Station[],
  by: 'price' | 'dist' | 'net' | 'trust',
  fuel: FuelType,
  officialPrice: number,
  tankSize: number,
  consumption: number
): Station[] {
  const trustOrder = { owner: 4, confirmed: 3, single: 1, disputed: 0, stale: 0 }
  return [...stations].sort((a, b) => {
    if (by === 'price') return a.prices[fuel] - b.prices[fuel]
    if (by === 'dist')  return a.dist - b.dist
    if (by === 'net')   return calcNetBenefit(b, fuel, officialPrice, tankSize, consumption) - calcNetBenefit(a, fuel, officialPrice, tankSize, consumption)
    if (by === 'trust') return (trustOrder[b.trust.level] || 0) - (trustOrder[a.trust.level] || 0)
    return 0
  })
}
