import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FuelFinder SA — Find the Cheapest Fuel Near You',
  description: 'Real-time crowdsourced fuel prices across South Africa. Compare petrol and diesel prices, see trusted community reports, and save on every fill.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
