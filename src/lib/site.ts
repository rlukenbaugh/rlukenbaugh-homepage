export const siteConfig = {
  name: "Skies Ready",
  domain: "https://skiesready.com",
  appName: "Skies Ready Pro",
  supportEmail: "contact@rlukenbaugh.org",
  defaultLocationQuery: "Enid, Oklahoma 73701",
  providerName: "Open-Meteo",
};

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export function getLaunchReadiness() {
  return {
    clerkConfigured: Boolean(
      process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    ),
    stripeConfigured: Boolean(
      process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_PRO_MONTHLY,
    ),
    stripeWebhookConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    commercialWeatherConfigured: Boolean(process.env.OPEN_METEO_API_KEY),
  };
}

export function isClerkConfigured() {
  return getLaunchReadiness().clerkConfigured;
}
