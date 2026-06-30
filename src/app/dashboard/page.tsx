import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BillingActionButton } from "@/components/billing-action-button";
import { ForecastExplorer } from "@/components/forecast-explorer";
import { SignOutButtonPill } from "@/components/sign-out-button";
import { getOptionalAuth, getOptionalCurrentUser } from "@/lib/auth";
import { getForecastForQuery } from "@/lib/forecast";
import { getViewerSubscriptionState } from "@/lib/subscription";
import { isClerkConfigured, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Protected Skies Ready user dashboard.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!isClerkConfigured()) {
    return <AuthSetupRequired />;
  }

  const { userId } = await getOptionalAuth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/dashboard");
  }

  const [user, subscription, forecast] = await Promise.all([
    getOptionalCurrentUser(),
    getViewerSubscriptionState(),
    getForecastForQuery(siteConfig.defaultLocationQuery),
  ]);

  return (
    <main className="app-shell">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
              Dashboard
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
              Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Your account is ready for testing registration, live forecast flow, and the Pro
              billing path.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/[0.04]"
              href="/account"
            >
              Account
            </Link>
            <SignOutButtonPill className="rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/[0.04]" />
            {subscription?.isPro ? (
              <BillingActionButton
                className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
                endpoint="/api/customer-portal"
                label="Manage Pro billing"
                pendingLabel="Opening billing..."
              />
            ) : (
              <BillingActionButton
                className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
                endpoint="/api/checkout"
                label="Start Pro trial"
                pendingLabel="Preparing checkout..."
              />
            )}
          </div>
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <DashboardCard
            label="Current plan"
            value={subscription?.isPro ? "Pro" : "Free"}
            detail={getPlanDetail(subscription)}
          />
          <DashboardCard
            label="Saved location"
            value={siteConfig.defaultLocationQuery}
            detail="Default launch area for dashboard QA"
          />
          <DashboardCard
            label="Billing state"
            value={subscription?.stripeCustomerId ? "Connected" : "Not linked"}
            detail={getBillingDetail(subscription)}
          />
        </section>

        <ForecastExplorer
          initialForecast={forecast}
          initialQuery={siteConfig.defaultLocationQuery}
        />
      </div>
    </main>
  );
}

function formatCancelDetail(cancelAt: string | null) {
  if (!cancelAt) {
    return "at the end of the current billing period";
  }

  return `on ${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(cancelAt))}`;
}

function getPlanDetail(subscription: Awaited<ReturnType<typeof getViewerSubscriptionState>>) {
  if (!subscription?.isPro) {
    return "Upgrade to Pro to test recurring billing";
  }

  if (subscription.cancelAtPeriodEnd) {
    return `Status: ${subscription.status}. Cancellation is scheduled ${formatCancelDetail(
      subscription.cancelAt,
    )}.`;
  }

  return `Status: ${subscription.status}`;
}

function getBillingDetail(subscription: Awaited<ReturnType<typeof getViewerSubscriptionState>>) {
  if (!subscription?.stripeCustomerId) {
    return "Created automatically on first checkout";
  }

  if (subscription.cancelAtPeriodEnd) {
    return `Stripe customer record detected. Cancellation is scheduled ${formatCancelDetail(
      subscription.cancelAt,
    )}.`;
  }

  return "Stripe customer record detected";
}

function AuthSetupRequired() {
  return (
    <main className="app-shell grid min-h-screen place-items-center px-4 py-10">
      <section className="max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center">
        <h1 className="text-3xl font-semibold text-white">Clerk setup required</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Add the Clerk environment variables from `.env.example` before testing protected
          dashboard flows such as registration, sign in, and saved account state.
        </p>
      </section>
    </main>
  );
}

function DashboardCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm leading-7 text-slate-300">{detail}</p>
    </article>
  );
}
