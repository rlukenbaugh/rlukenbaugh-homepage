import { NextResponse } from "next/server";
import { PRO_PLAN } from "@/lib/plans";
import { getAppUrl, isClerkConfigured } from "@/lib/site";
import { getStripe, getProPriceId } from "@/lib/stripe";
import { getViewerSubscriptionState, updateUserBillingMetadata } from "@/lib/subscription";

export async function POST() {
  if (!isClerkConfigured()) {
    return NextResponse.json(
      { error: "Clerk is not configured for account registration yet" },
      { status: 503 },
    );
  }

  const { auth, currentUser } = await import("@clerk/nextjs/server");
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const priceId = getProPriceId();

  if (!priceId) {
    return NextResponse.json(
      { error: "Missing STRIPE_PRICE_PRO_MONTHLY environment variable" },
      { status: 503 },
    );
  }

  try {
    const stripe = getStripe();
    const [user, subscription] = await Promise.all([currentUser(), getViewerSubscriptionState()]);

    if (!user) {
      return NextResponse.json({ error: "User profile unavailable" }, { status: 404 });
    }

    let customerId = subscription?.stripeCustomerId || null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.primaryEmailAddress?.emailAddress || undefined,
        name: user.fullName || undefined,
        metadata: {
          clerkUserId: userId,
        },
      });

      customerId = customer.id;
      await updateUserBillingMetadata(userId, { stripeCustomerId: customerId });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      client_reference_id: userId,
      success_url: `${getAppUrl()}/dashboard?checkout=success`,
      cancel_url: `${getAppUrl()}/pricing?checkout=cancelled`,
      metadata: {
        clerkUserId: userId,
        tier: "pro",
      },
      subscription_data: {
        metadata: {
          clerkUserId: userId,
          tier: "pro",
        },
        trial_period_days: PRO_PLAN.trialDays,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (cause) {
    return NextResponse.json(
      {
        error: cause instanceof Error ? cause.message : "Unable to start Pro checkout",
      },
      { status: 500 },
    );
  }
}
