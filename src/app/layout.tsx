import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  title: 'FuelFinder SA — Cheapest Fuel Near You',
  description: 'Real-time crowdsourced petrol and diesel prices across all 9 provinces of South Africa.',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className="bg-gray-50 text-gray-900">{children}</body></html>)
}
