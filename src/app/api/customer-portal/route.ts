import { NextResponse } from "next/server";
import { getAppUrl, isClerkConfigured } from "@/lib/site";
import { getStripe } from "@/lib/stripe";
import { getViewerSubscriptionState } from "@/lib/subscription";

export async function POST() {
  if (!isClerkConfigured()) {
    return NextResponse.json(
      { error: "Clerk is not configured for account registration yet" },
      { status: 503 },
    );
  }

  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await getViewerSubscriptionState();

  if (!subscription?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No Stripe customer found for this account yet" },
      { status: 400 },
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${getAppUrl()}/account`,
    });

    return NextResponse.json({ url: session.url });
  } catch (cause) {
    return NextResponse.json(
      {
        error: cause instanceof Error ? cause.message : "Unable to open billing portal",
      },
      { status: 500 },
    );
  }
}
