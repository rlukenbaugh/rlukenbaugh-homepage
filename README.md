# rlukenbaugh-homepage

Production-target Next.js app for `rlukenbaugh.org`.

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
4. For a paid public launch, use a commercial weather endpoint or API key instead of the public Open-Meteo endpoint

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

## Notes

- The app is wired for a single `Pro` plan. `Team` has been intentionally removed.
- The public Open-Meteo endpoint is acceptable for development and UI testing, but paid commercial use should switch to a licensed commercial endpoint before launch.
- Subscription state is synced into Clerk private metadata so the MVP can ship without a separate database layer.
