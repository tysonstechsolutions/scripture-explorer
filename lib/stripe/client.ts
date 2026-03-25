import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripeServer(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-02-25.clover",
    });
  }
  return stripeClient;
}

export const DONATION_AMOUNTS = [
  { value: 500, label: "$5" },
  { value: 1000, label: "$10" },
  { value: 2500, label: "$25" },
  { value: 5000, label: "$50" },
  { value: 10000, label: "$100" },
];
