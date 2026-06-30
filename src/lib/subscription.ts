import { isClerkConfigured } from "@/lib/site";

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

export async function getViewerSubscriptionState() {
  if (!isClerkConfigured()) {
    return null;
  }

  const { currentUser } = await import("@clerk/nextjs/server");
  const user = await currentUser();

  if (!user) {
    return null;
  }

  return normalizeBillingMetadata((user.privateMetadata as Record<string, unknown>)?.billing);
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
