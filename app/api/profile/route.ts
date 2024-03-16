import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import User from "../../models/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: any, res: NextApiResponse) {
  console.log("hit post", new Date().getSeconds());
  try {
    const body = await req.json();
    console.log("req", body);
    await dbConnect();
    const post = await User.create({
      name: body.name,
      email: body.email,
      clerk_user_id: body.clerk_user_id,
      photo_url: body.photo_url,  
    });
    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    return NextResponse.error();
  }
}

export async function GET(req: any, res: NextApiResponse) {
  console.log("hit get", new Date().getSeconds());
  try {
    await dbConnect();
    const Users = await User.find();
    return NextResponse.json(Users, { status: 200 });
  } catch (error) {
    console.log("error from route", error);
    return new NextResponse("Error");
  }
}
