import { dbConnect } from "@/app/lib/db";
import { stripe } from "@/app/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    console.log("url", req.url);
    console.log("protocol", req.headers.get("x-forwarded-proto"));
    console.log("host", req.headers.get("host"));

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      // redirect_on_completion: "if_required",
      return_url: `${
        req.headers.get("x-forwarded-proto") || "http"
      }://${req.headers.get("host")}/workspace/${
        body.slug
      }/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      // return_url:
      // `http://${req.headers.get()}/workspace/{}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      customer: body.customerId,
      line_items: [
        {
          price: body.priceId,
          quantity: body.quantity,
        },
      ],
      mode: "subscription",
      consent_collection: {
        terms_of_service: "required",
      },
      custom_text: {
        terms_of_service_acceptance: {
          message:
            "I agree to the [Terms of Service](https://example.com/terms)",
        },
      },
    });
    return NextResponse.json({ session }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const reqParam = req.nextUrl.searchParams;
    const sessionId = reqParam.get("sessionId");
    const session = await stripe.checkout.sessions.listLineItems(
      sessionId as string
    );
    return NextResponse.json({ session }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
