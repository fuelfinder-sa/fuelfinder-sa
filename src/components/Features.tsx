'use client'
import { useState } from 'react'
import { FuelType, FillupLog } from '@/data/types'

// ── CO2 factors (kg per litre) ────────────────────────────────────────────────
const CO2: Record<FuelType, number> = {
  '95 ULP': 2.31, '93 ULP': 2.31, 'Diesel 50ppm': 2.68, 'Diesel 500ppm': 2.68,
}
const OFFSET_PER_TONNE = 180 // ZAR, Wildlife Works REDD+

export function CarbonTracker({ fuelType }: { fuelType: FuelType }) {
  const [litres, setLitres] = useState(180)
  const [offsetOn, setOffsetOn] = useState(false)
  const factor = CO2[fuelType]
  const monthKg = litres * factor
  const yearTonnes = monthKg * 12 / 1000
  const offsetMonthly = yearTonnes * OFFSET_PER_TONNE / 12

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="bg-green-50 border-b border-green-200 px-4 py-3 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-green-900">Carbon footprint</h3>
          <p className="text-xs text-green-700">{fuelType} · {factor} kg CO₂/L</p>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <div className="flex justify-between mb-1"><span className="text-xs text-gray-500">Monthly consumption</span><span className="text-xs font-semibold">{litres} L/month</span></div>
          <input type="range" min="20" max="600" step="10" value={litres} onChange={e => setLitres(+e.target.value)} className="w-full accent-green-600"/>
        </div>
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {[
            { label: 'CO₂ this month', val: `${monthKg.toFixed(0)} kg`, cls: 'bg-orange-50' },
            { label: 'CO₂ per year', val: `${yearTonnes.toFixed(2)} t`, cls: 'bg-red-50' },
            { label: 'Trees to offset', val: `${Math.round(yearTonnes*1000/21)}`, cls: 'bg-green-50' },
            { label: 'CPT↔JHB flights', val: `${(yearTonnes*1000/255).toFixed(1)}×`, cls: 'bg-blue-50' },
          ].map(({ label, val, cls }) => (
            <div key={label} className={`${cls} rounded-xl p-3 text-center`}>
              <div className="text-base font-bold text-gray-800">{val}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
        <div className={`rounded-xl border p-3 transition-all ${offsetOn ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-800">Offset my emissions</span>
            <button onClick={() => setOffsetOn(!offsetOn)} className={`w-9 h-5 rounded-full relative transition-colors ${offsetOn ? 'bg-green-600' : 'bg-gray-300'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${offsetOn ? 'translate-x-4' : 'translate-x-0.5'}`}/>
            </button>
          </div>
          {offsetOn ? (
            <div className="mt-3 animate-slide-up space-y-2">
              <div className="flex justify-between text-xs"><span className="text-gray-600">Monthly cost</span><span className="font-bold text-green-700">R{offsetMonthly.toFixed(2)}/mo</span></div>
              <p className="text-xs text-gray-500">Partner: Wildlife Works · REDD+ certified · SA-based</p>
              <button className="w-full py-2 bg-green-600 text-white text-xs font-medium rounded-xl hover:bg-green-700">
                Start offsetting for R{offsetMonthly.toFixed(2)}/month →
              </button>
            </div>
          ) : (
            <p className="text-xs text-gray-500 mt-1">Fully offset for ~R{offsetMonthly.toFixed(2)}/month via Wildlife Works</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Employer Benefit ──────────────────────────────────────────────────────────
const DRIVERS = [
  { id:'1', name:'Jan Hofmeyr', vehicle:'Land Cruiser', litres:420, spend:10538, avg:25.09, station:'BP Helderberg', trips:14 },
  { id:'2', name:'Pieter van der Berg', vehicle:'Ford Ranger', litres:280, spend:7147, avg:25.52, station:'Engen N2', trips:9 },
  { id:'3', name:'Maria Santos', vehicle:'VW Amarok', litres:350, spend:8855, avg:25.30, station:'Sasol Main Rd', trips:11 },
]

export function EmployerBenefit() {
  const [view, setView] = useState<'dashboard'|'expense'|'settings'>('dashboard')
  const [allowance, setAllowance] = useState(2500)
  const total = DRIVERS.reduce((s,d) => s+d.spend, 0)
  const litres = DRIVERS.reduce((s,d) => s+d.litres, 0)
  const bestPossible = litres * 25.07
  const overspend = total - bestPossible

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="bg-blue-700 px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white">Employer fuel benefit</h3>
          <span className="ml-auto text-xs bg-blue-600 text-blue-100 px-2 py-0.5 rounded-full">Pro plan</span>
        </div>
        <p className="text-xs text-blue-300 mt-0.5">Team tracking · expense export · budget alerts</p>
      </div>
      <div className="flex border-b border-gray-100">
        {(['dashboard','expense','settings'] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`flex-1 py-2.5 text-xs font-medium capitalize transition-all ${view===v?'text-blue-700 border-b-2 border-blue-700':'text-gray-500'}`}>
            {v==='dashboard'?'Team':v==='expense'?'Expense report':'Settings'}
          </button>
        ))}
      </div>
      <div className="p-4">
        {view === 'dashboard' && (
          <>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-gray-50 rounded-xl p-2.5 text-center"><div className="text-base font-bold">R{(total/1000).toFixed(1)}K</div><div className="text-xs text-gray-500">Team spend</div></div>
              <div className="bg-gray-50 rounded-xl p-2.5 text-center"><div className="text-base font-bold">{litres}L</div><div className="text-xs text-gray-500">Total litres</div></div>
              <div className={`rounded-xl p-2.5 text-center ${overspend>0?'bg-red-50':'bg-green-50'}`}>
                <div className={`text-base font-bold ${overspend>0?'text-red-600':'text-green-600'}`}>R{Math.abs(overspend).toFixed(0)}</div>
                <div className={`text-xs ${overspend>0?'text-red-500':'text-green-500'}`}>{overspend>0?'above cheapest':'saved'}</div>
              </div>
            </div>
            <div className="space-y-2">
              {DRIVERS.map(d => (
                <div key={d.id} className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-xl">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-800">
                    {d.name.split(' ').map((n:string) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{d.name}</div>
                    <div className="text-xs text-gray-500">{d.vehicle} · {d.trips} trips · R{d.avg}/L avg</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">R{d.spend.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">{d.litres}L</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 bg-amber-50 rounded-xl p-2.5 text-xs text-amber-800">
              <span className="font-medium">Saving opportunity:</span> R{overspend.toFixed(0)}/month if all drivers used the cheapest nearby station.
            </div>
          </>
        )}
        {view === 'expense' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-700">Monthly allowance per driver</span>
              <span className="text-xs font-bold">R{allowance.toLocaleString()}</span>
            </div>
            <input type="range" min="500" max="10000" step="100" value={allowance} onChange={e => setAllowance(+e.target.value)} className="w-full accent-blue-700"/>
            <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
              {DRIVERS.map(d => {
                const over = d.spend > allowance
                return (
                  <div key={d.id} className="flex items-center gap-2 py-1.5 border-b border-gray-100 last:border-0">
                    <span className="text-xs flex-1">{d.name}</span>
                    <span className="text-xs font-medium">R{d.spend.toLocaleString()}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${over?'bg-red-100 text-red-700':'bg-green-100 text-green-700'}`}>
                      {over?`+R${(d.spend-allowance).toFixed(0)}`:'under'}
                    </span>
                  </div>
                )
              })}
            </div>
            <button className="w-full py-2.5 bg-blue-700 text-white text-xs font-medium rounded-xl hover:bg-blue-800 flex items-center justify-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Export CSV (PaySpace / Sage compatible)
            </button>
          </div>
        )}
        {view === 'settings' && (
          <div className="space-y-2">
            {[
              ['Alert when driver exceeds allowance', true],
              ['Require GPS-verified fill-ups', true],
              ['Monthly HR email report', false],
              ['Carbon offset reporting', false],
            ].map(([label, def]) => {
              const [on, setOn] = useState(def as boolean)
              return (
                <div key={label as string} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-xs text-gray-700">{label as string}</span>
                  <button onClick={() => setOn(!on)} className={`w-9 h-5 rounded-full relative transition-colors ${on?'bg-blue-700':'bg-gray-200'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${on?'translate-x-4':'translate-x-0.5'}`}/>
                  </button>
                </div>
              )
            })}
            <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-800 mt-2">
              <span className="font-medium">Pro plan:</span> Unlimited drivers · CSV export · HR system integration · R299/month
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Fill-up Tracker ───────────────────────────────────────────────────────────
const SAMPLE_LOGS: FillupLog[] = [
  { id:'1', stationId:'wc01', stationName:'BP Helderberg', stationBrand:'BP', date:'2026-04-07', litres:55, pricePerLitre:25.09, totalCost:1379.95, fuelType:'Diesel 50ppm', odometerKm:142350, co2Kg:147.5 },
  { id:'2', stationId:'wc02', stationName:'Sasol Main Road', stationBrand:'Sasol', date:'2026-03-12', litres:60, pricePerLitre:17.58, totalCost:1054.80, fuelType:'Diesel 50ppm', odometerKm:141200, co2Kg:160.8 },
  { id:'3', stationId:'wc11', stationName:'Shell Brackenfell N1', stationBrand:'Shell', date:'2026-02-05', litres:50, pricePerLitre:19.25, totalCost:962.50, fuelType:'Diesel 50ppm', odometerKm:140050, co2Kg:134 },
]

export function FillupTracker() {
  const [logs] = useState<FillupLog[]>(SAMPLE_LOGS)
  const [adding, setAdding] = useState(false)
  const totalSpend = logs.reduce((s,l) => s+l.totalCost, 0)
  const totalLitres = logs.reduce((s,l) => s+l.litres, 0)
  const totalCO2 = logs.reduce((s,l) => s+(l.co2Kg||0), 0)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Fill-up tracker</h3>
          <button onClick={() => setAdding(!adding)} className="text-xs px-3 py-1.5 bg-amber-700 text-white rounded-lg font-medium">+ Log fill-up</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-50 rounded-xl p-2.5 text-center"><div className="text-base font-bold">R{(totalSpend/1000).toFixed(1)}K</div><div className="text-xs text-gray-500">Total spent</div></div>
          <div className="bg-gray-50 rounded-xl p-2.5 text-center"><div className="text-base font-bold">{totalLitres}L</div><div className="text-xs text-gray-500">Filled up</div></div>
          <div className="bg-green-50 rounded-xl p-2.5 text-center"><div className="text-base font-bold text-green-700">{totalCO2.toFixed(0)}kg</div><div className="text-xs text-green-600">CO₂ total</div></div>
        </div>
      </div>
      {adding && (
        <div className="p-4 bg-amber-50 border-b border-amber-200 animate-slide-up">
          <p className="text-xs text-amber-800 font-medium mb-2">Log a fill-up (GPS verifies your station)</p>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input type="number" placeholder="Litres" className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400"/>
            <input type="number" placeholder="Odometer km" className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400"/>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-2 bg-green-700 text-white text-xs font-medium rounded-lg">Save fill-up</button>
            <button onClick={() => setAdding(false)} className="px-4 py-2 border border-gray-200 text-xs text-gray-600 rounded-lg">Cancel</button>
          </div>
        </div>
      )}
      <div className="divide-y divide-gray-50">
        {logs.map(l => (
          <div key={l.id} className="px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{l.stationName}</div>
              <div className="text-xs text-gray-400">{l.date} · {l.litres}L @ R{l.pricePerLitre.toFixed(2)}/L · {l.co2Kg?.toFixed(0)}kg CO₂</div>
            </div>
            <div className="text-sm font-bold">R{l.totalCost.toFixed(0)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Price History ─────────────────────────────────────────────────────────────
const HIST: Record<string, { m: string; coast: number; inland: number }[]> = {
  'Diesel 50ppm': [
    {m:'May 25',coast:17.84,inland:18.57},{m:'Jun 25',coast:17.83,inland:18.59},
    {m:'Jul 25',coast:18.10,inland:18.87},{m:'Aug 25',coast:18.25,inland:19.03},
    {m:'Sep 25',coast:18.50,inland:19.28},{m:'Oct 25',coast:18.90,inland:19.69},
    {m:'Nov 25',coast:19.20,inland:19.99},{m:'Dec 25',coast:19.80,inland:20.60},
    {m:'Jan 26',coast:18.10,inland:18.87},{m:'Feb 26',coast:17.84,inland:18.60},
    {m:'Mar 26',coast:17.84,inland:18.60},{m:'Apr 26',coast:25.35,inland:26.11},
  ],
  '95 ULP': [
    {m:'May 25',coast:20.53,inland:21.36},{m:'Jun 25',coast:20.46,inland:21.25},
    {m:'Jul 25',coast:20.80,inland:21.60},{m:'Aug 25',coast:20.60,inland:21.40},
    {m:'Sep 25',coast:20.90,inland:21.70},{m:'Oct 25',coast:21.10,inland:21.90},
    {m:'Nov 25',coast:21.30,inland:22.10},{m:'Dec 25',coast:21.50,inland:22.30},
    {m:'Jan 26',coast:19.47,inland:20.30},{m:'Feb 26',coast:19.47,inland:20.30},
    {m:'Mar 26',coast:19.47,inland:20.30},{m:'Apr 26',coast:22.53,inland:23.36},
  ],
}

export function PriceHistory({ fuel, zone = 'coast' }: { fuel: FuelType; zone?: 'coast'|'inland' }) {
  const data = HIST[fuel] || HIST['Diesel 50ppm']
  const prices = data.map(d => zone === 'coast' ? d.coast : d.inland)
  const min = Math.min(...prices), max = Math.max(...prices)
  const W = 540, H = 72, P = 8
  const pts = prices.map((p,i) => ({ x: P+(i/(prices.length-1))*(W-P*2), y: H-P-((p-min)/(max-min||1))*(H-P*2), p }))
  const d = pts.map((p,i) => `${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ')
  const last = pts[pts.length-1]

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Price history · 12 months</h3>
          <p className="text-xs text-gray-500">{fuel} · {zone}</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Current</div>
          <div className="text-base font-bold text-gray-900">R{last.p.toFixed(2)}</div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H+20}`} width="100%" style={{minWidth:260}}>
          {[0,0.5,1].map(t => <line key={t} x1={P} y1={P+(1-t)*(H-P*2)} x2={W-P} y2={P+(1-t)*(H-P*2)} stroke="#f3f4f6" strokeWidth="1"/>)}
          <path d={`${d} L ${last.x} ${H-P} L ${pts[0].x} ${H-P} Z`} fill="#FAEEDA" opacity=".5"/>
          <path d={d} fill="none" stroke="#854F0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx={last.x} cy={last.y} r="4" fill="#854F0B"/>
          {[0,5,11].map(i => <text key={i} x={pts[i].x} y={H+16} textAnchor="middle" fontSize="9" fill="#9ca3af">{data[i].m}</text>)}
          <text x={P} y={P+8} fontSize="9" fill="#6b7280">R{max.toFixed(2)}</text>
          <text x={P} y={H-P+2} fontSize="9" fill="#6b7280">R{min.toFixed(2)}</text>
        </svg>
      </div>
      <div className="mt-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"/>
        <p className="text-xs text-red-800"><span className="font-semibold">May 2026 warning:</span> CEF shows R17.57/L diesel under-recovery on day 1. Prices could rise again on 7 May. Fill up before then.</p>
      </div>
    </div>
  )
}

// ── WhatsApp share ────────────────────────────────────────────────────────────
export function WhatsAppShare({ stationName, price, fuel, savings, area }: {
  stationName: string; price: number; fuel: string; savings: number; area: string
}) {
  const msg = `⛽ *FuelFinder SA* — Deal alert!\n\n*${stationName}* (${area})\n${fuel}: *R${price.toFixed(2)}/L*\nSaves ~R${savings.toFixed(0)} on a full tank\n\nFind cheap fuel near you:\nhttps://fuelfinder-kappa.vercel.app`
  return (
    <a href={`https://wa.me/?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-medium transition-colors"
      onClick={e => e.stopPropagation()}>
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      Share
    </a>
  )
}

// ── Reporter Leaderboard ──────────────────────────────────────────────────────
const LEADERS = [
  { rank:1, handle:'TruckDriver_ZA', tier:'diamond', reports:847, city:'Gauteng' },
  { rank:2, handle:'CapeTownMom', tier:'verified', reports:523, city:'Cape Metro' },
  { rank:3, handle:'DurbanFleet', tier:'verified', reports:412, city:'Durban' },
  { rank:4, handle:'N1Trucker', tier:'reporter', reports:298, city:'N1 Highway' },
  { rank:5, handle:'SAsavings', tier:'reporter', reports:201, city:'Joburg' },
]
const TIER_CLR: Record<string,string> = { diamond:'bg-purple-100 text-purple-800', verified:'bg-green-100 text-green-800', reporter:'bg-blue-100 text-blue-800' }

export function ReporterLeaderboard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-900">Top reporters · April 2026</h3>
      </div>
      <div className="space-y-2 mb-3">
        {LEADERS.map(l => (
          <div key={l.rank} className={`flex items-center gap-2.5 p-2.5 rounded-xl ${l.rank===1?'bg-amber-50 border border-amber-200':'bg-gray-50'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${l.rank===1?'bg-amber-400 text-white':'bg-gray-200 text-gray-600'}`}>{l.rank}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5"><span className="text-xs font-medium">{l.handle}</span><span className={`text-xs px-1.5 rounded ${TIER_CLR[l.tier]}`}>{l.tier}</span></div>
              <div className="text-xs text-gray-400">{l.city}</div>
            </div>
            <div className="text-right"><div className="text-xs font-bold">{l.reports}</div><div className="text-xs text-gray-400">reports</div></div>
          </div>
        ))}
      </div>
      <div className="bg-green-50 rounded-xl p-2.5 text-center">
        <p className="text-xs text-green-800 font-medium">Top 3 reporters win R200 fuel voucher monthly</p>
        <button className="mt-1 text-xs text-green-700 underline">Join the leaderboard →</button>
      </div>
    </div>
  )
}
