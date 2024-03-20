import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextResponse } from "next/server";
import Chat from "@/app/models/Chat";

export async function POST(req: any, res: NextApiResponse) {
  try {
    const body = await req.json();
    await dbConnect();
    const post = await Chat.create({
      name: "New Chat",
      createdBy: body.createdBy,
      scope: body.scope,
      parentFolder: body.parentFolder || "",
      workspaceId: body.workspaceId,
      participants: [body.createdBy],
    });
    return NextResponse.json({ post }, { status: 200 });
  } catch (error: any) {
    console.log("error from route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function GET(req: any, res: NextApiResponse) {
  try {
    await dbConnect();
    const body = await req.json();
    // find by workspaceId and socpe
    let chats;
    if (body.scope === "public") {
      chats = await Chat.find({
        workspaceId: body.workspaceId,
        scope: body.scope,
      });
    } else if (body.scope === "private") {
      chats = await Chat.find({
        workspaceId: body.workspaceId,
        scope: body.scope,
        createdBy: body.createdBy,
      });
    }
    return NextResponse.json({ chats }, { status: 200 });
  } catch (error: any) {
    console.log("error from route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(req: any, res: NextApiResponse) {
  console.log("hit put chat");
  try {
    await dbConnect();
    const body = await req.json();
    const chat = await Chat.findByIdAndUpdate(body.id, body, { new: true });
    return NextResponse.json({ chat }, { status: 200 });
  } catch (error: any) {
    console.log("error from route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function DELETE(req: any, res: NextApiResponse) {
  console.log("hit delete chat");
  try {
    await dbConnect();
    const body = await req.json();
    const chat = await Chat.findByIdAndDelete(body.id);
    return NextResponse.json(
      { message: "Chat deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("error from route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
