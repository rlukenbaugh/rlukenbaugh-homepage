export const siteConfig = {
  name: "Skies Ready",
  domain: "https://skiesready.com",
  appName: "Skies Ready Pro",
  supportEmail: "contact@rlukenbaugh.org",
  defaultLocationQuery: "Enid, Oklahoma 73701",
  providerName: "OpenWeatherMap",
};

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

function hasValidClerkPublishableKey() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() || "";
  return key.startsWith("pk_live_") || key.startsWith("pk_test_");
}

function hasValidClerkSecretKey() {
  const key = process.env.CLERK_SECRET_KEY?.trim() || "";
  return key.startsWith("sk_live_") || key.startsWith("sk_test_");
}

export function getLaunchReadiness() {
  return {
    clerkConfigured: hasValidClerkSecretKey() && hasValidClerkPublishableKey(),
    stripeConfigured: Boolean(
      process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_PRO_MONTHLY,
    ),
    stripeWebhookConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    commercialWeatherConfigured: Boolean(
      process.env.OPENWEATHER_API_KEY || process.env.OPEN_METEO_API_KEY,
    ),
  };
}

export function isClerkConfigured() {
  return getLaunchReadiness().clerkConfigured;
}
