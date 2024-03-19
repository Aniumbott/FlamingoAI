import type { NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextResponse } from "next/server";
import Message from "@/app/models/Message";
import io from "socket.io-client";

export async function POST(req: any, res: NextApiResponse) {
  try {
    const body = await req.json();
    await dbConnect();
    const message = await Message.create({
      user_id: body.user_id,
      content: body.content,
      participant: body.participant,
      chat: body.chat,
    });
    return NextResponse.json({ message }, { status: 200 });
  } catch (error: any) {
    console.log("error from route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function GET(req: any, res: NextApiResponse) {
  console.log("hit get chat");
  try {
    await dbConnect();
    const messages = await Message.find();
    return NextResponse.json({ messages }, { status: 200 });
  } catch (error: any) {
    console.log("error from route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(req: any, res: NextApiResponse) {
  console.log("hit put message");
  try {
    await dbConnect();
    const body = await req.json();
    const message = await Message.findByIdAndUpdate(body.id, body, {
      new: true,
    });
    return NextResponse.json({ message }, { status: 200 });
  } catch (error: any) {
    console.log("error from route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function DELETE(req: any, res: NextApiResponse) {
  console.log("hit delete message");
  try {
    await dbConnect();
    const body = await req.json();
    const message = await Message.findByIdAndDelete(body.id);
    return NextResponse.json(
      { message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("error from route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
