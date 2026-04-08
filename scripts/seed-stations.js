#!/usr/bin/env node
/**
 * FuelFinder SA — Google Places Station Seeder
 * =============================================
 * Seeds ALL ~6,200 petrol stations in SA into Supabase overnight.
 *
 * ── SETUP (run these once) ─────────────────────────────────────────────────
 *
 * 1. Get Google Places API key:
 *    → console.cloud.google.com → New project "fuelfinder-sa"
 *    → Enable "Places API" → Credentials → Create API Key
 *    → Restrict key to "Places API" only
 *    Cost: Free tier covers ~1,000 calls/month. Full SA seed ≈ 3,500 calls ≈ $17 once-off.
 *
 * 2. Create Supabase project:
 *    → supabase.com → New project → copy URL and service_role key
 *
 * 3. Run this SQL in Supabase SQL Editor first:
 *    (copy from SCHEMA section below)
 *
 * 4. Create .env file in project root:
 *    GOOGLE_PLACES_API_KEY=AIzaSy...
 *    SUPABASE_URL=https://xxxxx.supabase.co
 *    SUPABASE_SERVICE_KEY=eyJhbGc...
 *
 * 5. Install dependencies:
 *    npm install @supabase/supabase-js dotenv node-fetch
 *
 * 6. Run it:
 *    node scripts/seed-stations.js
 *    (Takes 45–90 minutes. Safe to run overnight.)
 *
 * ── SUPABASE SCHEMA (paste into SQL Editor) ────────────────────────────────
 *
 * create table if not exists stations (
 *   id              text primary key,
 *   name            text not null,
 *   brand           text default 'Independent',
 *   address         text,
 *   province        text,
 *   highway         text,
 *   lat             float not null,
 *   lng             float not null,
 *   open24          boolean default false,
 *   is_truck        boolean default false,
 *   has_loyalty     boolean default false,
 *   loyalty_name    text,
 *   amenities       text[] default '{}',
 *   phone           text,
 *   website         text,
 *   google_rating   float,
 *   google_reviews  int default 0,
 *   photo_ref       text,
 *   last_updated    timestamptz default now(),
 *   created_at      timestamptz default now()
 * );
 *
 * create table if not exists station_prices (
 *   id              serial primary key,
 *   station_id      text references stations(id) on delete cascade,
 *   fuel_type       text not null,
 *   price           float not null,
 *   source          text default 'dmre_baseline',
 *   trust_level     text default 'baseline',
 *   confidence      int default 50,
 *   reporter_id     text,
 *   reported_at     timestamptz default now(),
 *   expires_at      timestamptz default now() + interval '72 hours'
 * );
 *
 * create index if not exists idx_stations_province on stations(province);
 * create index if not exists idx_station_prices_station on station_prices(station_id);
 *
 */

require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const GOOGLE_KEY   = process.env.GOOGLE_PLACES_API_KEY
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!GOOGLE_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌  Missing env vars. Check your .env file.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// South Africa bounding box
const BOUNDS = { minLat: -34.9, maxLat: -22.1, minLng: 16.3, maxLng: 32.9 }
const STEP   = 0.4   // degrees ≈ 44km. Overlaps 35km search radius.
const RADIUS = 35000 // metres

// Brand detection from station name
const BRAND_KEYWORDS = {
  'BP':            ['bp ','bp-', ' bp', 'british petroleum'],
  'Shell':         ['shell'],
  'Engen':         ['engen'],
  'Sasol':         ['sasol'],
  'TotalEnergies': ['total'],
  'Astron':        ['astron', 'caltex'],
  'Puma':          ['puma energy'],
  'Masana':        ['masana'],
}

function detectBrand(name) {
  const lower = name.toLowerCase()
  for (const [brand, keywords] of Object.entries(BRAND_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return brand
  }
  return 'Independent'
}

function detectProvince(lat, lng) {
  if (lat < -31.5 && lng < 23.5)                           return 'Western Cape'
  if (lat < -30.5 && lng > 23.5 && lng < 27.5)            return 'Northern Cape'
  if (lat < -30.0 && lng > 27.5 && lng < 30.5)            return 'Eastern Cape'
  if (lat > -30.0 && lat < -26.5 && lng > 24.5 && lng < 29.5) return 'Free State'
  if (lat > -26.5 && lat < -24.5 && lng > 26.0 && lng < 29.5) return 'Gauteng'
  if (lat < -26.5 && lng > 29.5 && lng < 32.5)            return 'KwaZulu-Natal'
  if (lat > -24.5 && lat < -22.5 && lng > 26.0)           return 'Limpopo'
  if (lat > -27.0 && lat < -24.5 && lng > 29.0 && lng < 32.5) return 'Mpumalanga'
  if (lat > -27.5 && lat < -24.5 && lng > 24.0 && lng < 28.0) return 'North West'
  return 'Unknown'
}

function detectHighway(name, address) {
  const text = `${name} ${address}`.toLowerCase()
  const highways = ['n1','n2','n3','n4','n7','n9','n10','n12','n14']
  for (const h of highways) {
    if (new RegExp(`\\b${h}\\b`).test(text)) return h.toUpperCase()
  }
  return null
}

function detectLoyalty(brand) {
  const map = { BP: 'BP FuelSave', Shell: 'Shell Go+', Engen: 'Engen 1-Card', TotalEnergies: 'Total Rewards' }
  return map[brand] || null
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function fetchPlaces(lat, lng, pageToken) {
  const params = new URLSearchParams({
    location: `${lat},${lng}`,
    radius: String(RADIUS),
    type: 'gas_station',
    key: GOOGLE_KEY,
    ...(pageToken ? { pagetoken: pageToken } : {}),
  })
  const res = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params}`)
  return res.json()
}

async function run() {
  // Build grid
  const grid = []
  for (let lat = BOUNDS.minLat; lat <= BOUNDS.maxLat; lat += STEP)
    for (let lng = BOUNDS.minLng; lng <= BOUNDS.maxLng; lng += STEP)
      grid.push({ lat: +lat.toFixed(3), lng: +lng.toFixed(3) })

  console.log(`🗺  Sweeping ${grid.length} grid points across South Africa`)
  console.log(`🔍 Each point searches ${RADIUS/1000}km radius for gas stations\n`)

  const seen = new Set()
  let found = 0, upserted = 0, apiCalls = 0

  for (let i = 0; i < grid.length; i++) {
    const { lat, lng } = grid[i]
    process.stdout.write(`\r📍 ${i+1}/${grid.length} — Found: ${found} stations`)

    let pageToken = undefined
    let pages = 0

    do {
      if (pageToken) await sleep(2200) // Required delay for page tokens
      const data = await fetchPlaces(lat, lng, pageToken)
      apiCalls++

      if (data.status === 'REQUEST_DENIED') {
        console.error(`\n❌ API error: ${data.error_message}`)
        process.exit(1)
      }

      for (const place of (data.results || [])) {
        if (seen.has(place.place_id)) continue
        seen.add(place.place_id)

        const pLat = place.geometry.location.lat
        const pLng = place.geometry.location.lng
        const brand = detectBrand(place.name)
        const loyalty = detectLoyalty(brand)

        const station = {
          id:             place.place_id,
          name:           place.name,
          brand,
          address:        place.vicinity || '',
          province:       detectProvince(pLat, pLng),
          highway:        detectHighway(place.name, place.vicinity || ''),
          lat:            pLat,
          lng:            pLng,
          open24:         false,
          is_truck:       place.name.toLowerCase().includes('truck') || place.name.toLowerCase().includes('highway'),
          has_loyalty:    !!loyalty,
          loyalty_name:   loyalty,
          amenities:      [],
          google_rating:  place.rating || null,
          google_reviews: place.user_ratings_total || 0,
          photo_ref:      place.photos?.[0]?.photo_reference || null,
          last_updated:   new Date().toISOString(),
        }

        const { error } = await supabase.from('stations').upsert(station, { onConflict: 'id' })
        if (!error) upserted++
        found++
      }

      pageToken = data.next_page_token
      pages++
      if (pages >= 3) break
      if (pageToken) await sleep(300)
    } while (pageToken)

    await sleep(120) // Gentle rate limiting
  }

  console.log(`\n\n✅ Done!`)
  console.log(`   Unique stations found:    ${found}`)
  console.log(`   Upserted to Supabase:     ${upserted}`)
  console.log(`   Google API calls:         ${apiCalls}`)
  console.log(`\n📋 Next steps:`)
  console.log(`   1. node scripts/enrich-hours.js    — fetch opening hours`)
  console.log(`   2. node scripts/seed-baseline-prices.js — set DMRE prices for all stations`)
  console.log(`   3. Deploy to Vercel with SUPABASE_URL + SUPABASE_ANON_KEY env vars`)
}

run().catch(err => { console.error('\n❌ Error:', err); process.exit(1) })
