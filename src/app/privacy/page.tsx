import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Read the Skies Ready privacy policy for account data, billing, saved locations, and drone forecast usage information.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="app-shell">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
            Privacy
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
            Privacy policy
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            This page describes what information {siteConfig.name} collects, how it is used, and
            which third-party services help deliver the product.
          </p>
        </div>

        <section className="space-y-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 text-sm leading-7 text-slate-300">
          <Block title="Information you provide">
            Account registration information is handled through Clerk. Subscription billing details
            are handled through Stripe. Forecast searches and saved locations may be stored to
            improve your product experience.
          </Block>
          <Block title="How information is used">
            We use account, billing, and forecast activity data to operate the site, process
            subscriptions, support saved Pro features, troubleshoot failures, and improve product
            reliability.
          </Block>
          <Block title="Third-party services">
            The site relies on Clerk for authentication, Stripe for billing, OpenWeatherMap for
            forecast data, and Vercel tooling for hosting, analytics, and performance monitoring.
          </Block>
          <Block title="Operational logs and analytics">
            We may collect runtime logs, route errors, page analytics, and performance metrics so
            signup, billing, and forecast issues can be diagnosed quickly.
          </Block>
          <Block title="Contact">
            Questions about privacy can be sent to {siteConfig.supportEmail}.
          </Block>
          <p className="text-xs text-slate-400">
            Review this policy against your final business practices and legal requirements before a
            broader public launch.
          </p>
          <Link className="inline-flex text-cyan-200 hover:text-white" href="/">
            Return to homepage
          </Link>
        </section>
      </div>
    </main>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2">{children}</p>
    </div>
  );
}
