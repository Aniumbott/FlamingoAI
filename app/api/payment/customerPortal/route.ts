import { dbConnect } from "@/app/lib/db";
import { stripe } from "@/app/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: body.customerId,
    });
    return NextResponse.json({ portalSession }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
