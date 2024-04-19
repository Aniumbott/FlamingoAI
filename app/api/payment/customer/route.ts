import { dbConnect } from "@/app/lib/db";
import { stripe } from "@/app/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    const customer = await stripe.customers.create({
      email: body.email,
      name: body.name,
    });
    return NextResponse.json({ customer }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const reqParam = req.nextUrl.searchParams;
    const customerId = reqParam.get("customerId");
    let customers;
    if (customerId) customers = await stripe.customers.retrieve(customerId);
    customers = await stripe.customers.list({
      limit: 3,
    });
    return NextResponse.json({ customers }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
