import type { Metadata } from "next";
import Link from "next/link";
import { PricingSection } from "@/components/pricing-section";
import { getOptionalAuth } from "@/lib/auth";
import { getViewerSubscriptionState } from "@/lib/subscription";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Compare free and Pro pricing for the Skies Ready drone weather checker, saved launch locations, five-day outlooks, and repeat preflight planning.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Skies Ready Pricing",
    description:
      "Compare free and Pro features for drone flight forecast planning, saved launch spots, and deeper launch guidance.",
    url: "https://skiesready.com/pricing",
  },
};

export default async function PricingPage() {
  const { userId } = await getOptionalAuth();
  const subscription = await getViewerSubscriptionState();

  return (
    <main className="app-shell">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link className="text-sm font-semibold text-cyan-200 hover:text-cyan-100" href="/">
            {"<- Back to forecast"}
          </Link>
          <div className="flex gap-3">
            <Link
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/[0.04]"
              href={userId ? "/dashboard" : "/sign-in"}
            >
              {userId ? "Dashboard" : "Sign in"}
            </Link>
          </div>
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
            Pricing
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Free weather checks with one clear Pro upgrade path
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            Compare the free drone weather checker with Pro planning tools like saved launch
            locations, recent forecast history, and deeper flight-condition guidance.
          </p>
        </section>

        <div className="mt-8">
          <PricingSection signedIn={Boolean(userId)} subscription={subscription} />
        </div>
      </div>
    </main>
  );
}
