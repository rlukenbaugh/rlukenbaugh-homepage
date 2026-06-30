import Stripe from "stripe";
import { isClerkConfigured } from "@/lib/site";
import { getStripe } from "@/lib/stripe";

export type SubscriptionTier = "free" | "pro";
export type BillingStatus =
  | "inactive"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid";

export type SubscriptionState = {
  tier: SubscriptionTier;
  status: BillingStatus;
  isPro: boolean;
  cancelAtPeriodEnd: boolean;
  cancelAt: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
};

type BillingMetadata = Partial<{
  tier: SubscriptionTier;
  status: BillingStatus;
  cancelAtPeriodEnd: boolean;
  cancelAt: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
}>;

function normalizeBillingMetadata(raw: unknown): SubscriptionState {
  const billing = typeof raw === "object" && raw ? (raw as BillingMetadata) : {};
  const tier = billing.tier === "pro" ? "pro" : "free";
  const status = billing.status || "inactive";

  return {
    tier,
    status,
    isPro: tier === "pro" && (status === "active" || status === "trialing"),
    cancelAtPeriodEnd: Boolean(billing.cancelAtPeriodEnd),
    cancelAt: billing.cancelAt || null,
    stripeCustomerId: billing.stripeCustomerId || null,
    stripeSubscriptionId: billing.stripeSubscriptionId || null,
  };
}

function normalizeStripeStatus(status: Stripe.Subscription.Status): BillingStatus {
  return status === "trialing" ||
    status === "active" ||
    status === "past_due" ||
    status === "canceled" ||
    status === "unpaid"
    ? status
    : "inactive";
}

function deriveStateFromStripeSubscription(
  current: SubscriptionState,
  subscription: Stripe.Subscription,
): SubscriptionState {
  const activeLike =
    subscription.status === "active" ||
    subscription.status === "trialing" ||
    subscription.status === "past_due";
  const cancelAt =
    subscription.cancel_at
      ? new Date(subscription.cancel_at * 1000).toISOString()
      : subscription.cancel_at_period_end
        ? new Date(((subscription.trial_end as number | null) ?? 0) * 1000).toISOString()
        : null;

  return {
    tier: activeLike ? "pro" : "free",
    status: normalizeStripeStatus(subscription.status),
    isPro: activeLike,
    cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
    cancelAt,
    stripeCustomerId:
      typeof subscription.customer === "string"
        ? subscription.customer
        : current.stripeCustomerId,
    stripeSubscriptionId: subscription.id,
  };
}

export async function getViewerSubscriptionState() {
  if (!isClerkConfigured()) {
    return null;
  }

  const { currentUser } = await import("@clerk/nextjs/server");
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const current = normalizeBillingMetadata((user.privateMetadata as Record<string, unknown>)?.billing);

  if (!current.stripeSubscriptionId || !process.env.STRIPE_SECRET_KEY) {
    return current;
  }

  try {
    const stripe = getStripe();
    const stripeSubscription = await stripe.subscriptions.retrieve(current.stripeSubscriptionId);
    const reconciled = deriveStateFromStripeSubscription(current, stripeSubscription);

    if (
      reconciled.tier !== current.tier ||
      reconciled.status !== current.status ||
      reconciled.cancelAtPeriodEnd !== current.cancelAtPeriodEnd ||
      reconciled.cancelAt !== current.cancelAt
    ) {
      await updateUserBillingMetadata(user.id, reconciled);
    }

    return reconciled;
  } catch {
    return current;
  }
}

export async function updateUserBillingMetadata(
  userId: string,
  partial: Partial<SubscriptionState>,
) {
  if (!isClerkConfigured()) {
    throw new Error("Clerk is not configured");
  }

  const { clerkClient } = await import("@clerk/nextjs/server");
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const current = normalizeBillingMetadata(
    (user.privateMetadata as Record<string, unknown>)?.billing,
  );

  const billing = {
    tier: partial.tier ?? current.tier,
    status: partial.status ?? current.status,
    cancelAtPeriodEnd: partial.cancelAtPeriodEnd ?? current.cancelAtPeriodEnd,
    cancelAt: partial.cancelAt ?? current.cancelAt ?? undefined,
    stripeCustomerId: partial.stripeCustomerId ?? current.stripeCustomerId ?? undefined,
    stripeSubscriptionId:
      partial.stripeSubscriptionId ?? current.stripeSubscriptionId ?? undefined,
  };

  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      ...(user.privateMetadata as Record<string, unknown>),
      billing,
    },
  });
}
