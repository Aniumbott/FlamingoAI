import Stripe from "stripe";
import { stripe } from "@/app/lib/stripe";
import { NextResponse } from "next/server";

import Workspace, { IWorkspaceDocument } from "@/app/models/Workspace";
import { clerkClient } from "@clerk/nextjs";

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

  let workspace: IWorkspaceDocument | null;
  let response: any;

  // Handle the event
  switch (event.type) {
    case "customer.subscription.created":
      workspace = await Workspace.findOneAndUpdate(
        {
          customerId: event.data.object.customer,
        },
        {
          subscription: getSubscriptionDataFromEvent(event),
        }
      );
      // console.log(workspace);

      response = await clerkClient.organizations.updateOrganization(
        workspace?._id || "",
        {
          maxAllowedMemberships: workspace?.subscription?.quantity || 2,
        }
      );

      // console.log(response);

      console.log("Subscription was created!");
      break;
    case "customer.subscription.updated":
      workspace = await Workspace.findOneAndUpdate(
        {
          customerId: event.data.object.customer,
        },
        {
          subscription: getSubscriptionDataFromEvent(event),
        }
      );

      response = await clerkClient.organizations.updateOrganization(
        workspace?._id || "",
        {
          maxAllowedMemberships: workspace?.subscription?.quantity || 2,
        }
      );

      // console.log(response);

      console.log("Subscription was updated!");
      break;
    case "customer.subscription.deleted":
      workspace = await Workspace.findOneAndUpdate(
        {
          customerId: event.data.object.customer,
        },
        {
          subscription: null,
        }
      );

      // console.log(workspace);

      response = await clerkClient.organizations.updateOrganization(
        workspace?._id || "",
        {
          maxAllowedMemberships: 2,
        }
      );

      // console.log(response);

      console.log("Subscription was deleted!");
      break;

    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return NextResponse.json({ received: true, status: 200 });
}

function getSubscriptionDataFromEvent(event: any) {
  return {
    id: event.data.object.id,
    product_id: event.data.object.items.data[0].price.product,
    status: event.data.object.status,
    current_period_start: event.data.object.current_period_start,
    current_period_ends: event.data.object.current_period_end,
    quantity: event.data.object.items.data[0].quantity,
  };
}

// const subscription = {
//   id: "", //data.object.id null as default
//   customer_id: "", //data.object.customer null as default
//   product_id: "", // data.object.items.data[0].price.product null as default
//   status: "", // data.object.status null as default
//   product_name: "free" || "pro" || "null",
//   current_period_start: "", //data.object.current_period_start
//   current_period_ends: "", //data.object.current_period_ends
//   quantity: "", //data.object.items.data[0].quantity 2 as default
// };
