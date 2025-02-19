import { dbConnect } from "@/app/lib/db";
import { stripe } from "@/app/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const subscription = await stripe.subscriptions.create({
      customer: body.customerId,
      items: [
        {
          price: body.priceId,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

    return NextResponse.json(
      {
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent
          ?.client_secret,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const reqParam = req.nextUrl.searchParams;
    const subscriptionId = reqParam.get("subscriptionId");
    let subscriptions;
    if (subscriptionId)
      subscriptions = await stripe.subscriptions.retrieve(subscriptionId);
    subscriptions = await stripe.subscriptions.list({
      limit: 3,
    });
    return NextResponse.json({ subscriptions }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

const event = {
  id: "evt_1MqqbKLt4dXK03v5qaIbiNCC",
  object: "event",
  api_version: "2024-04-10",
  created: 1680064028,
  type: "customer.subscription.updated",
  data: {
    object: {
      id: "sub_1Mqqb6Lt4dXK03v50OA219Ya",
      object: "subscription",
      application: null,
      application_fee_percent: null,
      automatic_tax: {
        enabled: false,
      },
      billing_cycle_anchor: 1680668814,
      billing_thresholds: null,
      cancel_at: null,
      cancel_at_period_end: false,
      canceled_at: null,
      cancellation_details: {
        comment: null,
        feedback: null,
        reason: null,
      },
      collection_method: "charge_automatically",
      created: 1680064014,
      currency: "usd",
      current_period_end: 1683260814, // use
      current_period_start: 1680668814, // use
      customer: "cus_Nc4kL4EPtG5SKe", // use
      days_until_due: null,
      default_payment_method: null,
      default_source: null,
      default_tax_rates: [],
      description: "A test subscription",
      discount: null,
      ended_at: null,
      invoice_customer_balance_settings: {
        consume_applied_balance_on_void: true,
      },
      items: {
        object: "list",
        data: [
          {
            id: "si_Nc4kEcMHd3vRTS",
            object: "subscription_item",
            billing_thresholds: null,
            created: 1680064014,
            metadata: {},
            plan: {
              id: "price_1Mqqb5Lt4dXK03v5cK9prani",
              object: "plan",
              active: true,
              aggregate_usage: null,
              amount: 4242,
              amount_decimal: "4242",
              billing_scheme: "per_unit",
              created: 1680064015,
              currency: "usd",
              interval: "month",
              interval_count: 1,
              livemode: false,
              metadata: {},
              nickname: null,
              product: "prod_Nc4kjj2XYpywZV",
              tiers: null,
              tiers_mode: null,
              transform_usage: null,
              trial_period_days: null,
              usage_type: "licensed",
            },
            price: {
              id: "price_1Mqqb5Lt4dXK03v5cK9prani",
              object: "price",
              active: true,
              billing_scheme: "per_unit",
              created: 1680064015,
              currency: "usd",
              custom_unit_amount: null,
              livemode: false,
              lookup_key: null,
              metadata: {},
              migrate_to: null,
              nickname: null,
              product: "prod_Nc4kjj2XYpywZV",
              recurring: {
                aggregate_usage: null,
                interval: "month",
                interval_count: 1,
                trial_period_days: null,
                usage_type: "licensed",
              },
              tax_behavior: "unspecified",
              tiers_mode: null,
              transform_quantity: null,
              type: "recurring",
              unit_amount: 4242,
              unit_amount_decimal: "4242",
            },
            quantity: 1,
            subscription: "sub_1Mqqb6Lt4dXK03v50OA219Ya",
            tax_rates: [],
          },
        ],
        has_more: false,
        total_count: 1,
        url: "/v1/subscription_items?subscription=sub_1Mqqb6Lt4dXK03v50OA219Ya",
      },
      latest_invoice: "in_1MqqbILt4dXK03v5cbbciqFZ",
      livemode: false,
      metadata: {},
      next_pending_invoice_item_invoice: null,
      on_behalf_of: null,
      pause_collection: null,
      payment_settings: {
        payment_method_options: null,
        payment_method_types: null,
        save_default_payment_method: "off",
      },
      pending_invoice_item_interval: null,
      pending_setup_intent: null,
      pending_update: null,
      plan: {
        id: "price_1Mqqb5Lt4dXK03v5cK9prani",
        object: "plan",
        active: true,
        aggregate_usage: null,
        amount: 4242,
        amount_decimal: "4242",
        billing_scheme: "per_unit",
        created: 1680064015,
        currency: "usd",
        interval: "month",
        interval_count: 1,
        livemode: false,
        metadata: {},
        nickname: null,
        product: "prod_Nc4kjj2XYpywZV",
        tiers: null,
        tiers_mode: null,
        transform_usage: null,
        trial_period_days: null,
        usage_type: "licensed",
      },
      quantity: 1,
      schedule: null,
      start_date: 1680064014,
      status: "active", // use
      tax_percent: null,
      test_clock: "clock_1Mqqb4Lt4dXK03v5NOFiPg4R",
      transfer_data: null,
      trial_end: 1680668814,
      trial_settings: {
        end_behavior: {
          missing_payment_method: "create_invoice",
        },
      },
      trial_start: 1680064014,
    },
    previous_attributes: {
      current_period_end: 1680668814,
      current_period_start: 1680064014,
      latest_invoice: "in_1Mqqb6Lt4dXK03v5Xn79tY8i",
      status: "trialing",
    },
  },
  livemode: false,
  pending_webhooks: 1,
  request: {
    id: null,
    idempotency_key: null,
  },
};

// workspace creation :

const subscription = {
  id: "", //data.object.id null as default
  customer_id: "", //data.object.customer.id null as default
  product_id: "", // data.object.items.data[0].price.product null as default
  status: "", // data.object.status null as default
  product_name: "free" || "pro" || "null",
  current_period_start: "", //data.object.current_period_start
  current_period_ends: "", //data.object.current_period_ends
  quantity: "", //data.object.items.data[0].quantity 2 as default
};
