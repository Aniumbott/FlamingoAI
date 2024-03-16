import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import User from "../../models/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  console.log("hit get post", new Date().getSeconds());
  try {
    const body = await req.json();

    console.log("req", req);

    await dbConnect();

    const post = await User.create({
      name: body.name,
      primary_email: body.primary_email,
    });
    return new NextResponse("Added User");
  } catch (error) {
    console.log("error from route", error);
    return new NextResponse("Error");
  }
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  console.log("hit get", new Date().getSeconds());
  try {
    await dbConnect();
    const Users = await User.find();
    return new NextResponse(Users.join(), { status: 200 });
  } catch (error) {
    console.log("error from route", error);
    return new NextResponse("Error");
  }
}
