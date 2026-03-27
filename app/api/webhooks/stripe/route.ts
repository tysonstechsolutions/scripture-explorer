import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeServer } from "@/lib/stripe/client";

function getWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }
  return secret;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  const stripe = getStripeServer();

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      getWebhookSecret()
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "Webhook verification failed" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      // Payment successful - add post-payment logic here (e.g., send thank you email)
      break;
    }
    case "payment_intent.succeeded": {
      // Payment intent succeeded
      break;
    }
    default:
      // Unhandled event type - silently ignore
      break;
  }

  return NextResponse.json({ received: true });
}
