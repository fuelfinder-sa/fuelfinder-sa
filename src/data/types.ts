export type FuelType = '95 ULP' | '93 ULP' | 'Diesel 50ppm' | 'Diesel 500ppm'
export type TrustLevel = 'owner' | 'confirmed' | 'single' | 'disputed' | 'stale'
export type Zone = 'coast' | 'inland'

export interface OfficialPrices {
  coast: Record<FuelType, number>
  inland: Record<FuelType, number>
}

export interface Station {
  id: string
  name: string
  brand: string
  area: string
  address: string
  province: string
  highway: string | null
  lat: number
  lng: number
  dist: number
  open24: boolean
  isTruck: boolean
  hasLoyalty: boolean
  loyaltyName?: string
  amenities: string[]
  prices: Record<FuelType, number>
  trust: {
    level: TrustLevel
    reports: number
    age: string
    low: Partial<Record<FuelType, number>>
    high: Partial<Record<FuelType, number>>
  }
}

export interface VehicleProfile {
  consumption: number
  tankSize: number
  fuelType: FuelType
}
