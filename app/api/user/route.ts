import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import User from "../../models/User";
import { NextResponse } from "next/server";

// POST request handler
export async function POST(req: any, res: NextApiResponse) {
  try {
    const body = await req.json();
    await dbConnect();
    const post = await User.create({
      name: body.name,
      email: body.email,
      clerk_user_id: body.clerk_user_id,
      photo_url: body.photo_url,
    });
    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    console.log("error at POST in User route", error);
    return NextResponse.error();
  }
}

// GET request handler
export async function GET(req: any, res: NextApiResponse) {
  try {
    await dbConnect();
    const Users = await User.find();
    return NextResponse.json(Users, { status: 200 });
  } catch (error) {
    console.log("error in GET in User route", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
