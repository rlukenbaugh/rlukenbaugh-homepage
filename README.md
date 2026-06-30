# rlukenbaugh-homepage

Production-target Next.js app for `skiesready.com`.

## What it includes

- Live forecast search with imperial units
- Clerk-based sign-up and sign-in routes
- Free plus Pro pricing only
- Stripe subscription checkout route
- Stripe customer portal route
- Stripe webhook handler for syncing billing state back into account metadata
- Protected dashboard and account pages

## Local setup

1. Copy `.env.example` to `.env.local`
2. Add Clerk keys
3. Add Stripe keys and a `STRIPE_PRICE_PRO_MONTHLY`
4. Add an `OPENWEATHER_API_KEY` for live forecast data

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

## Notes

- The app is wired for a single `Pro` plan. `Team` has been intentionally removed.
- Forecast search now uses OpenWeatherMap geocoding, current conditions, and upcoming forecast windows in imperial units.
- Subscription state is synced into Clerk private metadata so the MVP can ship without a separate database layer.
