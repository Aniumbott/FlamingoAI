import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { stripe } from "@/app/lib/stripe";
import { stat } from "fs";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { sign } from "crypto";

export async function POST(req: any, res: NextResponse) {
  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      req.headers.get("stripe-signature") || "",
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    return NextResponse.json(err.message);
  }

  // Handle the event
  switch (event.type) {
    case "customer.subscription.created":
      // workspace create -> subscription create
      // status: active, subscription: "productname"

      console.log("Subscription was created!");
      break;
    case "customer.subscription.updated":
      // status: req.status,
      console.log("Subscription was updated!");
      break;
    case "customer.subscription.deleted":
      // workspace delete -> subscription delete
      console.log("Subscription was deleted!");
      break;

    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  return NextResponse.json({ received: true, status: 200 });
}
