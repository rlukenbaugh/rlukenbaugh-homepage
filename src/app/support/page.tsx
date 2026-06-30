import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get Skies Ready support for drone flight forecast questions, account access, and Pro billing help.",
  alternates: {
    canonical: "/support",
  },
};

export default function SupportPage() {
  return (
    <main className="app-shell">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
            Support
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
            Billing, forecast, and account help
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Reach out if you need help with account access, forecast questions, or Stripe billing.
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          <Card
            title="Email support"
            copy={`Primary support contact: ${siteConfig.supportEmail}. Include the account email used on Skies Ready and a short description of the issue.`}
          />
          <Card
            title="Billing changes"
            copy="For subscription management, payment method updates, or cancellation, use the billing portal from your dashboard or account page first."
          />
          <Card
            title="Forecast questions"
            copy="If a forecast looks incorrect, include the searched location, the time you checked it, and a screenshot if possible."
          />
          <Card
            title="Response expectation"
            copy="Launch-stage support is best-effort. Plan on follow-up by email for account or billing issues that need manual review."
          />
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
            href="/account"
          >
            Open account
          </Link>
          <Link
            className="rounded-2xl border border-white/10 px-4 py-3 font-semibold text-white hover:bg-white/[0.04]"
            href="/"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}

function Card({ title, copy }: { title: string; copy: string }) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-300">{copy}</p>
    </article>
  );
}
