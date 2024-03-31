import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Chat from "@/app/models/Chat";
import ChatFolder from "@/app/models/ChatFolder";

export async function POST(req: any, res: NextApiResponse) {
  try {
    const body = await req.json();
    await dbConnect();
    // console.log("body", body);
    const chat = await Chat.create({
      name: "New Chat",
      createdBy: body.createdBy,
      scope: body.scope,
      parentFolder: body.parentFolder,
      workspaceId: body.workspaceId,
      participants: [body.createdBy],
    });

    // If parentFolder was provided, add the new chat ID to the parent folder's chats array
    if (body.parentFolder) {
      await ChatFolder.findByIdAndUpdate(body.parentFolder, {
        $push: { chats: chat._id },
      });
      // console.log("pushed ", chat._id, "to parent folder ", body.parentFolder);
    }

    return NextResponse.json({ chat }, { status: 200 });
  } catch (error: any) {
    // console.log("error at POST in Chat route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function GET(req: NextRequest, res: NextApiResponse) {
  try {
    // export const GET = async (request, { params }) => {
    //   try{
    //        Path Params are received from {params} variable

    await dbConnect();
    const reqParam = req.nextUrl.searchParams;
    const scope = reqParam.get("scope");
    const workspaceId = reqParam.get("workspaceId");
    const createdBy = reqParam.get("createdBy");
    const id = reqParam.get("id");
    const independent = reqParam.get("independent");
    // console.log(scope, workspaceId, createdBy, id, independent);
    // find by workspaceId and socpe
    let chats;

    // get independent chats based on scope
    if (independent) {
      if (scope === "public") {
        chats = await Chat.find({
          workspaceId: workspaceId,
          scope: scope,
          parentFolder: null,
        });
      } else if (scope === "private") {
        chats = await Chat.find({
          workspaceId: workspaceId,
          scope: scope,
          createdBy: createdBy,
          parentFolder: null,
        });
      }
    }
    //get all chats relevant to workspace and user
    else if (id === "all") {
      chats = await Chat.find({
        workspaceId: workspaceId,
        $or: [{ scope: "public" }, { scope: "private", createdBy: createdBy }],
      });
    }
    // get specific chat by id
    else if (id) {
      chats = await Chat.find({
        workspaceId: workspaceId,
        _id: id,
      }).populate("messages");
      // console.log("chats", chats);
    }
    return NextResponse.json({ chats }, { status: 200 });
  } catch (error: any) {
    console.log("error at GET in Chat route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(req: any, res: NextApiResponse) {
  // console.log("hit put chat");
  try {
    await dbConnect();
    const body = await req.json();
    const chat = await Chat.findByIdAndUpdate(body.id, body, {
      new: true,
    }).populate("messages");
    return NextResponse.json({ chat }, { status: 200 });
  } catch (error: any) {
    console.log("error at PUT in Chat route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function DELETE(req: any, res: NextApiResponse) {
  // console.log("hit delete chat");
  try {
    await dbConnect();
    const body = await req.json();
    const chat = await Chat.findByIdAndDelete(body.id);
    return NextResponse.json(
      { message: "Chat deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    // console.log("error at DELETE in Chat route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
