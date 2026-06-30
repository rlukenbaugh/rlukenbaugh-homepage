import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { updateUserBillingMetadata } from "@/lib/subscription";

async function resolveClerkUserId(
  stripe: Stripe,
  object:
    | Stripe.Checkout.Session
    | Stripe.Subscription
    | Stripe.Customer
    | null
    | undefined,
) {
  const direct = object?.metadata?.clerkUserId;

  if (direct) {
    return direct;
  }

  if (
    object &&
    (object.object === "checkout.session" || object.object === "subscription") &&
    typeof object.customer === "string"
  ) {
    const customer = await stripe.customers.retrieve(object.customer);
    if (!customer.deleted) {
      return customer.metadata?.clerkUserId || null;
    }
  }

  if (object && "id" in object && object.object === "customer") {
    return object.metadata?.clerkUserId || null;
  }

  return null;
}

export async function POST(request: Request) {
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signingSecret) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET" },
      { status: 503 },
    );
  }

  const stripe = getStripe();
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, signingSecret);
  } catch (cause) {
    return NextResponse.json(
      {
        error: cause instanceof Error ? cause.message : "Invalid webhook signature",
      },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = await resolveClerkUserId(stripe, session);

        if (userId) {
          await updateUserBillingMetadata(userId, {
            tier: "pro",
            status: "trialing",
            cancelAtPeriodEnd: false,
            cancelAt: null,
            stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
            stripeSubscriptionId:
              typeof session.subscription === "string" ? session.subscription : null,
          });
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionRecord = subscription as Stripe.Subscription & {
          current_period_end?: number | null;
        };
        const userId = await resolveClerkUserId(stripe, subscription);

        if (userId) {
          const activeLike =
            subscription.status === "active" ||
            subscription.status === "trialing" ||
            subscription.status === "past_due";
          const scheduledCancelAt =
            subscription.cancel_at
              ? new Date(subscription.cancel_at * 1000).toISOString()
              : subscription.cancel_at_period_end
                ? new Date(
                    ((subscription.trial_end || subscriptionRecord.current_period_end) ?? 0) *
                      1000,
                  ).toISOString()
                : null;

          await updateUserBillingMetadata(userId, {
            tier: activeLike ? "pro" : "free",
            status:
              subscription.status === "trialing" ||
              subscription.status === "active" ||
              subscription.status === "past_due" ||
              subscription.status === "canceled" ||
              subscription.status === "unpaid"
                ? subscription.status
                : "inactive",
            cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
            cancelAt: scheduledCancelAt,
            stripeCustomerId:
              typeof subscription.customer === "string" ? subscription.customer : null,
            stripeSubscriptionId: subscription.id,
          });
        }
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (cause) {
    return NextResponse.json(
      {
        error: cause instanceof Error ? cause.message : "Webhook handler failed",
      },
      { status: 500 },
    );
  }
}
