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
- `RESEND_API_KEY=...` for custom Skies Ready lifecycle emails
- `RESEND_FROM_EMAIL=...` such as `hello@skiesready.com`
- `ERROR_WEBHOOK_URL=...` if you want route failures forwarded to an external incident inbox or webhook
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
- In Stripe customer email settings, enable launch emails for:
  - successful payments
  - failed payments
  - refunds
  - upcoming renewals or trial endings if you want Stripe to send those directly

## 5. Weather Provider

- Forecast search uses OpenWeatherMap geocoding, current weather, and upcoming forecast windows.
- The UI now also surfaces five-day outlook cards, sunrise/sunset, condition icons, and derived operational alert banners.
- Re-test forecast lookup after adding or changing the production weather credentials.

## 6. Public-Facing Pages

- Review `/terms`
- Review `/privacy`
- Review `/support`
- Confirm support email, billing language, and policy wording are ready for public traffic

## 7. Production Smoke Test

Run these in production after deploy:

1. Open `https://skiesready.com`
2. Search a location and confirm live forecast data loads
3. Open `/pricing`
4. Create an account with Clerk
5. Start the `Pro` trial
6. Complete Stripe Checkout
7. Confirm webhook sync updates the account/dashboard state
8. Open the Stripe customer portal from the app
9. Save at least one Pro launch location and verify search history updates
10. Cancel or manage the subscription and confirm state changes flow back

## 8. Go-Live Callouts

- The app currently supports `Free` and `Pro` only.
- `Team` pricing has been intentionally removed.
- If Clerk or Stripe secrets are missing, the app shows setup fallbacks instead of a full live auth flow.
- If Resend secrets are missing, billing still works, but custom Skies Ready Pro emails will not send.
- Vercel Analytics and Speed Insights are wired into the app layout, and server routes now emit structured logs for forecast, billing, and webhook failures.
