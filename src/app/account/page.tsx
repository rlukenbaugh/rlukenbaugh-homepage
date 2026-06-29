import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BillingActionButton } from "@/components/billing-action-button";
import { getOptionalAuth, getOptionalCurrentUser } from "@/lib/auth";
import { isClerkConfigured } from "@/lib/site";
import { getViewerSubscriptionState } from "@/lib/subscription";

export const metadata: Metadata = {
  title: "Account",
  description: "Skies Ready account and billing settings.",
};

export default async function AccountPage() {
  if (!isClerkConfigured()) {
    return (
      <main className="app-shell grid min-h-screen place-items-center px-4 py-10">
        <section className="max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Clerk setup required</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            This account page will come alive as soon as the Clerk publishable and secret keys are
            configured.
          </p>
        </section>
      </main>
    );
  }

  const { userId } = await getOptionalAuth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/account");
  }

  const [user, subscription] = await Promise.all([
    getOptionalCurrentUser(),
    getViewerSubscriptionState(),
  ]);

  return (
    <main className="app-shell">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
              Account
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
              Billing and identity
            </h1>
          </div>
          <Link
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/[0.04]"
            href="/dashboard"
          >
            Dashboard
          </Link>
        </div>

        <section className="grid gap-6 md:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Identity
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              {user?.fullName || user?.primaryEmailAddress?.emailAddress || "Skies Ready user"}
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              {user?.primaryEmailAddress?.emailAddress || "Email address available after Clerk setup"}
            </p>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Subscription
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              {subscription?.isPro ? "Pro" : "Free"}
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              {subscription?.isPro
                ? `Status: ${subscription.status}. Use the billing portal to update payment methods, cancel, or resume service.`
                : "This account is on the Free plan. Start the Pro trial to test Stripe checkout and recurring billing."}
            </p>
            <div className="mt-5">
              {subscription?.isPro ? (
                <BillingActionButton
                  className="rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
                  endpoint="/api/customer-portal"
                  label="Open billing portal"
                  pendingLabel="Opening portal..."
                />
              ) : (
                <BillingActionButton
                  className="rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
                  endpoint="/api/checkout"
                  label="Start Pro trial"
                  pendingLabel="Preparing checkout..."
                />
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
