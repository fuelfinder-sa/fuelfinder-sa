import { OfficialPrices, Station } from './types'

export const OFFICIAL_PRICES: OfficialPrices = {
  coast: {
    '95 ULP': 22.53,
    '93 ULP': 22.10,
    'Diesel 50ppm': 25.35,
    'Diesel 500ppm': 24.98,
  },
  inland: {
    '95 ULP': 23.36,
    '93 ULP': 23.25,
    'Diesel 50ppm': 26.11,
    'Diesel 500ppm': 25.74,
  },
}

export const FUEL_TYPES = ['95 ULP', '93 ULP', 'Diesel 50ppm', 'Diesel 500ppm'] as const

export const STATIONS: Station[] = [
  {
    id: '1',
    name: 'Sasol Main Road',
    brand: 'Sasol',
    area: 'Somerset West',
    address: '45 Main Road, Somerset West',
    lat: -34.0833, lng: 18.8490,
    dist: 1.8, open24: false, isTruck: false, hasLoyalty: false,
    amenities: ['Car wash', 'Shop'],
    prices: { '95 ULP': 22.39, '93 ULP': 21.98, 'Diesel 50ppm': 25.07, 'Diesel 500ppm': 24.72 },
    trust: { level: 'confirmed', reports: 5, age: '2h ago', low: { 'Diesel 50ppm': 25.07 }, high: { 'Diesel 50ppm': 25.07 } },
  },
  {
    id: '2',
    name: 'BP Helderberg',
    brand: 'BP',
    area: 'Somerset West',
    address: 'Annandale Road, Somerset West',
    lat: -34.0820, lng: 18.8510,
    dist: 1.2, open24: false, isTruck: false, hasLoyalty: true, loyaltyName: 'BP FuelSave',
    amenities: ['Car wash', 'ATM', 'Shop'],
    prices: { '95 ULP': 22.53, '93 ULP': 22.10, 'Diesel 50ppm': 25.09, 'Diesel 500ppm': 24.74 },
    trust: { level: 'owner', reports: 1, age: '1h ago', low: { 'Diesel 50ppm': 25.09 }, high: { 'Diesel 50ppm': 25.09 } },
    phone: '+27 21 855 1234',
  },
  {
    id: '3',
    name: "Engen Sir Lowry's Pass",
    brand: 'Engen',
    area: "Sir Lowry's Pass",
    address: "Sir Lowry's Pass Road, Grabouw",
    lat: -34.1050, lng: 18.9100,
    dist: 3.4, open24: true, isTruck: true, hasLoyalty: true, loyaltyName: 'Engen 1-Card',
    amenities: ['Shop', 'ATM', 'Restaurant', 'Truck bay'],
    prices: { '95 ULP': 22.53, '93 ULP': 22.10, 'Diesel 50ppm': 25.20, 'Diesel 500ppm': 24.88 },
    trust: { level: 'single', reports: 1, age: '6h ago', low: { 'Diesel 50ppm': 25.20 }, high: { 'Diesel 50ppm': 25.20 } },
  },
  {
    id: '4',
    name: 'Shell Somerset Mall',
    brand: 'Shell',
    area: 'Somerset West',
    address: 'Somerset Mall, Somerset West',
    lat: -34.0760, lng: 18.8430,
    dist: 2.1, open24: true, isTruck: false, hasLoyalty: true, loyaltyName: 'Shell Go+',
    amenities: ['Shop', 'Restaurant', 'ATM'],
    prices: { '95 ULP': 23.90, '93 ULP': 23.40, 'Diesel 50ppm': 26.80, 'Diesel 500ppm': 26.40 },
    trust: { level: 'confirmed', reports: 3, age: '3h ago', low: { 'Diesel 50ppm': 26.50 }, high: { 'Diesel 50ppm': 26.80 } },
  },
  {
    id: '5',
    name: 'Caltex Strand',
    brand: 'Caltex',
    area: 'Strand',
    address: '12 Beach Road, Strand',
    lat: -34.1180, lng: 18.8260,
    dist: 4.2, open24: false, isTruck: false, hasLoyalty: false,
    amenities: ['Car wash', 'Shop'],
    prices: { '95 ULP': 24.50, '93 ULP': 24.10, 'Diesel 50ppm': 29.90, 'Diesel 500ppm': 29.50 },
    trust: { level: 'disputed', reports: 2, age: '5h ago', low: { 'Diesel 50ppm': 25.50 }, high: { 'Diesel 50ppm': 29.90 } },
  },
  {
    id: '6',
    name: "TotalEnergies Gordon's Bay",
    brand: 'TotalEnergies',
    area: "Gordon's Bay",
    address: "Main Road, Gordon's Bay",
    lat: -34.1560, lng: 18.8660,
    dist: 7.5, open24: false, isTruck: false, hasLoyalty: true, loyaltyName: 'Total Rewards',
    amenities: ['Shop', 'Restaurant'],
    prices: { '95 ULP': 26.50, '93 ULP': 26.10, 'Diesel 50ppm': 31.50, 'Diesel 500ppm': 31.00 },
    trust: { level: 'single', reports: 1, age: '8h ago', low: { 'Diesel 50ppm': 31.50 }, high: { 'Diesel 50ppm': 31.50 } },
  },
]

export const BRAND_COLORS: Record<string, { bg: string; text: string; short: string }> = {
  BP:            { bg: 'bg-green-100', text: 'text-green-800', short: 'BP' },
  Shell:         { bg: 'bg-amber-100', text: 'text-amber-800', short: 'SH' },
  Engen:         { bg: 'bg-red-100',   text: 'text-red-800',   short: 'EN' },
  Caltex:        { bg: 'bg-blue-100',  text: 'text-blue-800',  short: 'CA' },
  Sasol:         { bg: 'bg-purple-100',text: 'text-purple-800',short: 'SA' },
  TotalEnergies: { bg: 'bg-pink-100',  text: 'text-pink-800',  short: 'TE' },
}
