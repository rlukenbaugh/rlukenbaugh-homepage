import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Radar, ShieldCheck } from "lucide-react";
import { ForecastExplorer } from "@/components/forecast-explorer";
import { PricingSection } from "@/components/pricing-section";
import { SignOutButtonPill } from "@/components/sign-out-button";
import { getOptionalAuth } from "@/lib/auth";
import { getForecastForQuery } from "@/lib/forecast";
import { seoLandingPages } from "@/lib/seo-pages";
import { getViewerSubscriptionState } from "@/lib/subscription";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Drone Weather Checker",
  description:
    "Use Skies Ready as a drone weather checker to see wind, gusts, visibility, cloud cover, rain risk, and a five-day drone flight forecast before you fly.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Skies Ready Drone Weather Checker",
    description:
      "See if it is safe to fly your drone today with wind, gust, visibility, and rain checks in one drone flight forecast.",
    url: "https://skiesready.com",
  },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { userId } = await getOptionalAuth();
  const params = searchParams ? await searchParams : {};
  const initialQuery =
    typeof params.query === "string" && params.query.trim()
      ? params.query.trim()
      : siteConfig.defaultLocationQuery;
  const [subscription, forecast] = await Promise.all([
    getViewerSubscriptionState(),
    getForecastForQuery(initialQuery),
  ]);
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Skies Ready",
    applicationCategory: "WeatherApplication",
    operatingSystem: "Web",
    url: "https://skiesready.com",
    description:
      "Drone weather checker and drone flight forecast for wind, gusts, visibility, cloud cover, and rain risk.",
    offers: {
      "@type": "Offer",
      price: "5.00",
      priceCurrency: "USD",
    },
  };

  return (
    <main className="app-shell">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
        type="application/ld+json"
      />
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
              Drone flight weather
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Know if the sky is drone-ready before you launch.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Check wind, gusts, visibility, clouds, and rain risk in one simple drone flight
              forecast before you commit to takeoff.
            </p>

            <form action="/" className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4" method="get">
              <label
                className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/80"
                htmlFor="hero-query"
              >
                Enter city, ZIP code, or launch location
              </label>
              <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto_auto]">
                <input
                  className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none placeholder:text-slate-400"
                  defaultValue={initialQuery}
                  id="hero-query"
                  name="query"
                  placeholder="Enid, Oklahoma 73701"
                  type="text"
                />
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
                  type="submit"
                >
                  Check My Flight Conditions
                  <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/[0.04]"
                  href="#pricing"
                >
                  View Pro Features
                </Link>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Weather guidance only. Always confirm FAA airspace, LAANC, TFRs, and local rules
                before you fly.
              </p>
            </form>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/[0.04]"
                href="#forecast"
              >
                Jump to forecast
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
            <FlightChecksCard />
          </div>
        </section>

        <section className="pb-14" id="forecast">
          <ForecastExplorer
            initialForecast={forecast}
            initialQuery={initialQuery}
          />
        </section>

        <section className="grid gap-4 pb-14 md:grid-cols-3">
          <FeatureCard
            copy="Live weather data, clear go or no-go ratings, and plain-English risk explanations for launch planning."
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Built for preflight checks"
          />
          <FeatureCard
            copy="Wind and gust risk, visibility, rain chance, cloud cover, and five-day outlooks in imperial units."
            icon={<Radar className="h-5 w-5" />}
            title="Drone weather you can scan quickly"
          />
          <FeatureCard
            copy="FAA reminder links, weather-only disclaimers, and planning tools that support both recreational and Part 107 prep."
            icon={<BadgeCheck className="h-5 w-5" />}
            title="Trust-first launch guidance"
          />
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 pb-8 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
                Popular drone weather guides
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                Start with the exact flight question you want answered
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-300">
              These pages target the real phrases drone pilots search for, then lead directly into
              the live Skies Ready forecast workflow.
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {seoLandingPages.map((page) => (
              <Link
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 transition hover:border-cyan-300/30 hover:bg-white/[0.05]"
                href={`/${page.slug}`}
                key={page.slug}
              >
                <h3 className="text-lg font-semibold text-white">{page.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{page.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-4 pb-14 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
              Drone weather checker
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Check drone flying conditions near you before takeoff
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-300">
              Skies Ready helps you answer common preflight questions like: Is it safe to fly my
              drone today? What is the wind forecast for my launch spot? Will gusts, visibility, or
              rain risk make this a caution or risky flight window?
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <SearchPhraseCard
                copy="See a drone wind forecast, gust risk, and visibility in one place."
                title="Drone wind forecast"
              />
              <SearchPhraseCard
                copy="Compare current launch risk with upcoming windows and five-day outlook cards."
                title="Drone launch weather"
              />
              <SearchPhraseCard
                copy="Learn what Skies Ready checks, what B4UFLY covers, and where LAANC and TFR checks still fit."
                title="Drone weather vs airspace"
              />
              <SearchPhraseCard
                copy="Read short answers to common pilot questions about wind, gusts, visibility, rain, and launch risk."
                title="Drone weather FAQ"
              />
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
              Who it helps
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Built for recreational and Part 107 preflight planning
            </h2>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
              <li className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                Check if wind and gusts are inside your comfort range before you pack up and head
                out.
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                Review a drone weather checker that turns raw conditions into good, caution, or
                risky launch guidance.
              </li>
              <li className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                Use FAA reminder links alongside weather checks so legal airspace review stays part
                of every flight decision.
              </li>
            </ul>
          </article>
        </section>

        <section className="pb-10" id="pricing">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
                Pricing
              </p>
              <h2 className="mt-2 text-4xl font-semibold tracking-tight text-white">
                Free weather checks with one clear Pro upgrade path
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-300">
              Skies Ready focuses on individual drone pilots first. Start with the free forecast
              workflow, then upgrade only if you want more saved planning power and deeper launch
              guidance.
            </p>
          </div>
          <PricingSection signedIn={Boolean(userId)} subscription={subscription} />
        </section>
      </div>
    </main>
  );
}

function SearchPhraseCard({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-300">{copy}</p>
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

function FlightChecksCard() {
  const items = [
    "Wind and gust risk",
    "Visibility",
    "Rain chance",
    "Cloud cover",
    "Temperature",
    "Saved launch spots with Pro",
    "Simple go, caution, or risky rating",
  ];

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-400/12 p-3 text-cyan-200">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
            Drone flight checks
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-white">
            Weather guidance built for drone pilots
          </h2>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div
            className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3"
            key={item}
          >
            <p className="font-semibold text-white">{item}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm leading-7 text-slate-300">
        Weather conditions can look good and still be illegal to fly. Always confirm FAA airspace,
        TFRs, LAANC authorization, and local operating rules before launch.
      </p>
    </section>
  );
}
