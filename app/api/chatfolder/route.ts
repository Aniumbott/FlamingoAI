import type { NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextResponse } from "next/server";
import ChatFolder from "@/app/models/ChatFolder";

export async function POST(req: any, res: NextApiResponse) {
  try {
    const body = await req.json();
    await dbConnect();
    const chatFolder = await ChatFolder.create({
      name: body.name,
      user_id: body.user_id,
      scope: body.scope,
      sub_folders: body.sub_folders,
      chats: body.chats,
    });
    return NextResponse.json({ chatFolder }, { status: 200 });
  } catch (error: any) {
    console.log("error in post chatfolder");
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function GET(req: any, res: NextApiResponse) {
  try {
    await dbConnect();
    const chatFolder = await ChatFolder.find();
    return NextResponse.json({ chatFolder }, { status: 200 });
  } catch (error: any) {
    console.log("error from route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(req: any, res: NextApiResponse) {
  console.log("hit put chatfolder");
  try {
    await dbConnect();
    const body = await req.json();
    const chatFolder = await ChatFolder.findByIdAndUpdate(body.id, body, { new: true });
    return NextResponse.json({ chatFolder }, { status: 200 });
  } catch (error: any) {
    console.log("error from route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function DELETE(req: any, res: NextApiResponse) {
  console.log("hit delete chatfolder");
  try {
    await dbConnect();
    const body = await req.json();
    const chatFolder = await ChatFolder.findByIdAndDelete(body.id);
    return NextResponse.json(
      { message: "Chat Folder deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("error from route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

