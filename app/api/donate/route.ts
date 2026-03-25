import { NextRequest, NextResponse } from "next/server";
import { getStripeServer, DONATION_AMOUNTS } from "@/lib/stripe/client";

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();

    if (!amount || typeof amount !== "number") {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    // Validate amount is one of our preset amounts
    const validAmount = DONATION_AMOUNTS.find((a) => a.value === amount);
    if (!validAmount) {
      return NextResponse.json(
        { error: "Invalid donation amount" },
        { status: 400 }
      );
    }

    const stripe = getStripeServer();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Donation to Scripture Explorer",
              description: "Thank you for supporting Scripture Explorer!",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/donate`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
