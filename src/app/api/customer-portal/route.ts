import { NextResponse } from "next/server";
import { createRouteLogger } from "@/lib/monitoring";
import { getAppUrl, isClerkConfigured } from "@/lib/site";
import { getStripe } from "@/lib/stripe";
import { getViewerSubscriptionState } from "@/lib/subscription";

export async function POST(request: Request) {
  const logger = createRouteLogger("/api/customer-portal", request);
  logger.start();

  if (!isClerkConfigured()) {
    logger.success({ configured: false });
    return NextResponse.json(
      { error: "Clerk is not configured for account registration yet" },
      { status: 503 },
    );
  }

  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();

  if (!userId) {
    logger.success({ authenticated: false });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await getViewerSubscriptionState();

  if (!subscription?.stripeCustomerId) {
    logger.success({ userId, stripeLinked: false });
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

    logger.success({ userId, stripeCustomerId: subscription.stripeCustomerId });
    return NextResponse.json({ url: session.url });
  } catch (cause) {
    await logger.failure(cause, { userId, stripeCustomerId: subscription.stripeCustomerId });
    return NextResponse.json(
      {
        error: cause instanceof Error ? cause.message : "Unable to open billing portal",
      },
      { status: 500 },
    );
  }
}
