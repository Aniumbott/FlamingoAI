import type { NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextResponse } from "next/server";
import Message, { IMessageDocument } from "@/app/models/Message";
import Chat from "@/app/models/Chat";

export async function POST(req: any, res: NextApiResponse) {
  try {
    const body = await req.json();
    await dbConnect();
    const message = await Message.create({
      createdBy: body.createdBy,
      content: body.content,
      type: body.type,
      chatId: body.chatId,
      updatedAt: new Date(),
    });
    return NextResponse.json({ message }, { status: 200 });
  } catch (error: any) {
    // console.log("error from route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function GET(req: any, res: NextApiResponse) {
  // console.log("hit get chat");
  try {
    await dbConnect();
    const messages = await Message.find();
    return NextResponse.json({ messages }, { status: 200 });
  } catch (error: any) {
    // console.log("error from route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(req: any, res: NextApiResponse) {
  // console.log("hit put message");
  try {
    await dbConnect();
    const body = await req.json();

    console.log("body", body);
    const chatObj = await Chat.findById(body.chatId);
    console.log("chatObj", chatObj?.populate("messages"));

    const toBeDeleted = chatObj?.messages.filter((msg: any) => {
      msg.createdAt > body.createdAt;
    });
    console.log("toBeDeleted", toBeDeleted);
    await Chat.findByIdAndUpdate(
      body.chatId,
      {
        ...chatObj,
        messages: chatObj?.messages.filter((msg: any) => {
          return msg.createdAt < body.createdAt;
        }),
      },
      {
        new: true,
      }
    ).then((res) => {
      console.log("res", res);
    });

    toBeDeleted?.forEach(async (e: any) => {
      await Message.findByIdAndDelete(e._id);
    });
    console.log("All done");

    const data = await Message.findByIdAndUpdate(body._id, body);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    // console.log("error from route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function DELETE(req: any, res: NextApiResponse) {
  // console.log("hit delete message");
  try {
    await dbConnect();
    const body = await req.json();
    const message = await Message.findByIdAndDelete(body.id);
    return NextResponse.json(
      { message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    // console.log("error from route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
