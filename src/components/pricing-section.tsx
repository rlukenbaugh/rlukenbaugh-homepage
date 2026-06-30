import Link from "next/link";
import { BillingActionButton } from "@/components/billing-action-button";
import { FREE_PLAN, PRO_PLAN } from "@/lib/plans";
import type { SubscriptionState } from "@/lib/subscription";

export function PricingSection({
  subscription,
  signedIn,
}: {
  subscription: SubscriptionState | null;
  signedIn: boolean;
}) {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <PlanCard
        signedIn={signedIn}
        subscription={subscription}
        plan={{
          ...FREE_PLAN,
          highlight: "Check conditions before you launch",
        }}
      />
      <PlanCard
        signedIn={signedIn}
        subscription={subscription}
        plan={{
          ...PRO_PLAN,
          highlight: "More planning power for repeat drone flights",
        }}
      />
    </section>
  );
}

function PlanCard({
  plan,
  subscription,
  signedIn,
}: {
  plan: {
    key: "free" | "pro";
    name: string;
    price: string;
    billingCopy: string;
    highlight: string;
    features: string[];
  };
  subscription: SubscriptionState | null;
  signedIn: boolean;
}) {
  const isCurrentPlan =
    plan.key === "free" ? !subscription?.isPro : Boolean(subscription?.isPro);

  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
            {plan.highlight}
          </p>
          <h3 className="mt-2 text-3xl font-semibold text-white">{plan.name}</h3>
        </div>
        {isCurrentPlan ? (
          <span className="rounded-full border border-emerald-300/30 bg-emerald-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">
            Current
          </span>
        ) : null}
      </div>
      <div className="mt-6 flex items-end gap-2">
        <span className="text-5xl font-semibold tracking-tight text-white">{plan.price}</span>
        <span className="pb-2 text-sm text-slate-300">{plan.billingCopy}</span>
      </div>
      <ul className="mt-6 space-y-3 text-sm text-slate-200">
        {plan.features.map((feature) => (
          <li className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3" key={feature}>
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        {plan.key === "free" ? (
          signedIn ? (
            <Link
              className="inline-flex rounded-2xl border border-white/15 px-4 py-3 font-semibold text-white transition hover:bg-white/[0.04]"
              href="/dashboard"
            >
              Open dashboard
            </Link>
          ) : (
            <Link
              className="inline-flex rounded-2xl border border-white/15 px-4 py-3 font-semibold text-white transition hover:bg-white/[0.04]"
              href="/sign-up"
            >
              Create account
            </Link>
          )
        ) : subscription?.isPro ? (
          <BillingActionButton
            className="inline-flex rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            endpoint="/api/customer-portal"
            label="Manage Pro plan"
            pendingLabel="Opening billing..."
          />
        ) : signedIn ? (
          <BillingActionButton
            className="inline-flex rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            endpoint="/api/checkout"
            label="Start Pro trial"
            pendingLabel="Preparing checkout..."
          />
        ) : (
          <Link
            className="inline-flex rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            href="/sign-up"
          >
            Create account to upgrade
          </Link>
        )}
      </div>
    </article>
  );
}
