import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: "Skies Ready terms of use.",
};

export default function TermsPage() {
  return (
    <main className="app-shell">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
            Terms
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
            Terms of use
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            These terms govern use of {siteConfig.name}, including account registration, paid Pro
            subscriptions, and weather-based launch planning tools.
          </p>
        </div>

        <section className="space-y-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 text-sm leading-7 text-slate-300">
          <Block title="Service use">
            {siteConfig.name} is intended to support flight planning decisions, not replace pilot
            judgment, FAA requirements, manufacturer guidance, or local operating rules.
          </Block>
          <Block title="Forecast information">
            Weather data is provided from third-party sources and may be delayed, incomplete, or
            inaccurate. Forecasts, alerts, and risk labels are decision-support tools only and are
            not guarantees of safe conditions.
          </Block>
          <Block title="Accounts and billing">
            Paid subscriptions are billed through Stripe. You are responsible for maintaining
            accurate billing information and for canceling before renewal if you do not want
            continued service.
          </Block>
          <Block title="Acceptable use">
            You agree not to misuse the site, interfere with service operation, reverse engineer
            restricted areas, or use the product in violation of law or platform rules.
          </Block>
          <Block title="Support and contact">
            Support requests can be sent to {siteConfig.supportEmail}. For billing changes, use the
            self-service billing portal available inside your account.
          </Block>
          <p className="text-xs text-slate-400">
            These launch terms should be reviewed and finalized with your own legal counsel before
            wider commercial rollout.
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
