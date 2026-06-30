# Launch Checklist

Use this when turning `skiesready.com` into the live Skies Ready paid app.

## 1. Vercel Project

- Connect the GitHub repo `rlukenbaugh/rlukenbaugh-homepage` to Vercel.
- Confirm the production domain is:
  - `skiesready.com`
  - `www.skiesready.com`

## 2. Environment Variables

Add these in Vercel for the Production environment:

- `NEXT_PUBLIC_APP_URL=https://skiesready.com`
- `CLERK_SECRET_KEY=...`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- `STRIPE_SECRET_KEY=...`
- `STRIPE_PRICE_PRO_MONTHLY=price_...`
- `STRIPE_WEBHOOK_SECRET=...`
- `OPENWEATHER_API_KEY=...`
- `OPENWEATHER_FORECAST_BASE_URL=...` only if you need a non-default endpoint
- `OPENWEATHER_GEOCODING_BASE_URL=...` only if you need a non-default endpoint

## 3. Clerk Setup

- Create or open the Clerk app for `skiesready.com`.
- Set allowed redirect/base URLs to `https://skiesready.com`.
- Verify:
  - sign-up route is `/sign-up`
  - sign-in route is `/sign-in`
- Enable the auth methods you want to support at launch.

## 4. Stripe Setup

- Create the monthly `Pro` product and price in Stripe.
- Copy the Stripe price ID into `STRIPE_PRICE_PRO_MONTHLY`.
- Create a webhook endpoint pointing to:
  - `https://skiesready.com/api/webhooks/stripe`
- Subscribe the webhook to at least:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

## 5. Weather Provider

- Forecast search uses OpenWeatherMap geocoding, current weather, and upcoming forecast windows.
- Re-test forecast lookup after adding or changing the production weather credentials.

## 6. Production Smoke Test

Run these in production after deploy:

1. Open `https://skiesready.com`
2. Search a location and confirm live forecast data loads
3. Open `/pricing`
4. Create an account with Clerk
5. Start the `Pro` trial
6. Complete Stripe Checkout
7. Confirm webhook sync updates the account/dashboard state
8. Open the Stripe customer portal from the app
9. Cancel or manage the subscription and confirm state changes flow back

## 7. Go-Live Callouts

- The app currently supports `Free` and `Pro` only.
- `Team` pricing has been intentionally removed.
- If Clerk or Stripe secrets are missing, the app shows setup fallbacks instead of a full live auth flow.
