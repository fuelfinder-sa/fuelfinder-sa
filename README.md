# FuelFinder SA — POC

Real-time, crowd-verified fuel price comparison for South Africa.
Built with Next.js 14 + Tailwind CSS.

## Deploy to Vercel (3 steps, free)

1. Go to github.com → create new repo called `fuelfinder-sa` → upload all these files
2. Go to vercel.com → sign up free → "Add New Project" → import `fuelfinder-sa`
3. Click Deploy — your live URL appears in ~60 seconds

## Run locally
npm install
npm run dev
Open http://localhost:3000

## Features in this POC
- Real April 2026 DMRE prices (coastal + inland)
- 6 stations: Somerset West area, price spread R25.07 → R31.50
- Trust badge system (owner, confirmed, disputed)
- Trip cost calculator with vehicle profile
- Full filter panel + price reporting
- Mobile responsive, amber fuel branding

## Next steps
- Connect fuelsa.co.za API for live regulated prices
- Add Supabase for real station data + user submissions
- Google Maps for real locations + "near me"
- Expo mobile app (iOS + Android)
