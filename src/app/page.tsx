import Link from "next/link";
import { ArrowRight, BadgeCheck, CloudRain, Radar, ShieldCheck } from "lucide-react";
import { ForecastExplorer } from "@/components/forecast-explorer";
import { PricingSection } from "@/components/pricing-section";
import { SignOutButtonPill } from "@/components/sign-out-button";
import { getOptionalAuth } from "@/lib/auth";
import { getForecastForQuery } from "@/lib/forecast";
import { getViewerSubscriptionState } from "@/lib/subscription";
import { getLaunchReadiness, siteConfig } from "@/lib/site";

export default async function HomePage() {
  const readiness = getLaunchReadiness();
  const { userId } = await getOptionalAuth();
  const [subscription, forecast] = await Promise.all([
    getViewerSubscriptionState(),
    getForecastForQuery(siteConfig.defaultLocationQuery),
  ]);

  return (
    <main className="app-shell">
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-5 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Link className="inline-flex items-center gap-3" href="/">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400 text-lg font-bold text-slate-950 shadow-[0_18px_32px_rgba(53,183,255,0.25)]">
                SR
              </span>
              <span>
                <span className="block text-lg font-semibold tracking-tight text-white">
                  Skies Ready
                </span>
                <span className="block text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Drone flight forecast
                </span>
              </span>
            </Link>
            <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
              <Link className="rounded-full px-4 py-2 hover:bg-white/[0.05]" href="#forecast">
                Forecast
              </Link>
              <Link className="rounded-full px-4 py-2 hover:bg-white/[0.05]" href="#pricing">
                Pricing
              </Link>
              {userId ? (
                <>
                  <Link className="rounded-full px-4 py-2 hover:bg-white/[0.05]" href="/dashboard">
                    Dashboard
                  </Link>
                  <SignOutButtonPill className="rounded-full px-4 py-2 hover:bg-white/[0.05]" />
                </>
              ) : (
                <Link className="rounded-full px-4 py-2 hover:bg-white/[0.05]" href="/sign-in">
                  Sign in
                </Link>
              )}
              <Link
                className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300"
                href={userId ? "/pricing" : "/sign-up"}
              >
                {userId ? "Upgrade to Pro" : "Start free trial"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </nav>
          </div>
        </header>

        <section className="grid gap-8 pb-14 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
              Real paid launch target
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Turn drone launch decisions into a subscription product pilots can trust.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Skies Ready combines live forecast search, protected user accounts, and Stripe-backed
              Pro billing so `skiesready.com` can evolve from demo shell to a real launch-ready
              product.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <FeatureStat label="Forecast source" value="Live API" />
              <FeatureStat label="Billing model" value="Free + Pro" />
              <FeatureStat label="Launch state" value="Account-ready" />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
                href="#pricing"
              >
                View Pro pricing
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/[0.04]"
                href={userId ? "/dashboard" : "/sign-up"}
              >
                {userId ? "Open dashboard" : "Create account"}
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <ReadinessCard
              commercialWeatherConfigured={readiness.commercialWeatherConfigured}
              clerkConfigured={readiness.clerkConfigured}
              stripeConfigured={readiness.stripeConfigured}
              stripeWebhookConfigured={readiness.stripeWebhookConfigured}
            />
          </div>
        </section>

        <section className="pb-14" id="forecast">
          <ForecastExplorer
            initialForecast={forecast}
            initialQuery={siteConfig.defaultLocationQuery}
          />
        </section>

        <section className="grid gap-4 pb-14 md:grid-cols-3">
          <FeatureCard
            copy="Auth-ready entry points, protected dashboard routes, and billing-aware account state."
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Real user accounts"
          />
          <FeatureCard
            copy="Live wind, gust, humidity, visibility, and precipitation checks in imperial units."
            icon={<Radar className="h-5 w-5" />}
            title="Operational forecast logic"
          />
          <FeatureCard
            copy="Stripe subscription checkout, webhook sync, and customer portal support for Pro."
            icon={<BadgeCheck className="h-5 w-5" />}
            title="Paid plan infrastructure"
          />
        </section>

        <section className="pb-10" id="pricing">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
                Pricing
              </p>
              <h2 className="mt-2 text-4xl font-semibold tracking-tight text-white">
                Free forecast access with one clear Pro upgrade path
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-300">
              Team pricing is intentionally removed for the first launch. The product now focuses on
              an individual operator flow with one recurring Pro plan that is easy to test and easy
              to sell.
            </p>
          </div>
          <PricingSection signedIn={Boolean(userId)} subscription={subscription} />
        </section>
      </div>
    </main>
  );
}

function FeatureStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  copy,
}: {
  icon: React.ReactNode;
  title: string;
  copy: string;
}) {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
      <div className="inline-flex rounded-2xl bg-cyan-400/12 p-3 text-cyan-200">{icon}</div>
      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{copy}</p>
    </article>
  );
}

function ReadinessCard({
  clerkConfigured,
  stripeConfigured,
  stripeWebhookConfigured,
  commercialWeatherConfigured,
}: ReturnType<typeof getLaunchReadiness>) {
  const items = [
    {
      label: "Clerk auth",
      ready: clerkConfigured,
      detail: clerkConfigured ? "Configured for sign up and sign in" : "Add Clerk publishable and secret keys",
    },
    {
      label: "Stripe checkout",
      ready: stripeConfigured,
      detail: stripeConfigured ? "Pro subscription checkout can be created" : "Add Stripe secret key and Pro price ID",
    },
    {
      label: "Stripe webhooks",
      ready: stripeWebhookConfigured,
      detail: stripeWebhookConfigured ? "Billing state can sync back into accounts" : "Add webhook secret for subscription sync",
    },
    {
      label: "Weather API",
      ready: commercialWeatherConfigured,
      detail: commercialWeatherConfigured
        ? "OpenWeatherMap forecast data is configured"
        : "Add an OpenWeatherMap API key for live forecast data",
    },
  ];

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-400/12 p-3 text-cyan-200">
          <CloudRain className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
            Launch readiness
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-white">What still gates a live paid launch</h2>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div
            className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3"
            key={item.label}
          >
            <div>
              <p className="font-semibold text-white">{item.label}</p>
              <p className="mt-1 text-sm text-slate-300">{item.detail}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                item.ready
                  ? "bg-emerald-400/15 text-emerald-100"
                  : "bg-amber-400/15 text-amber-100"
              }`}
            >
              {item.ready ? "Ready" : "Needs setup"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
