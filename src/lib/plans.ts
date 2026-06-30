export type PlanKey = "free" | "pro";

export const FREE_PLAN = {
  key: "free" as const,
  name: "Free",
  price: "$0",
  billingCopy: "Basic forecast lookup",
  cta: "Create account",
  features: [
    "Live forecast lookup",
    "Hourly go or no-go windows",
    "Visibility, gust, and precip checks",
    "Imperial units by default",
  ],
};

export const PRO_PLAN = {
  key: "pro" as const,
  name: "Pro",
  price: "$5.00",
  billingCopy: "per month after a 7-day trial",
  cta: "Start free trial",
  trialDays: 7,
  envKey: "STRIPE_PRICE_PRO_MONTHLY",
  features: [
    "Saved launch locations",
    "Best flight window guidance",
    "Longer forecast range",
    "Custom wind and gust limits coming next",
    "More detailed launch weather data",
  ],
};

export const plans = [FREE_PLAN, PRO_PLAN];
