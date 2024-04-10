import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Chat from "@/app/models/Chat";
import ChatFolder from "@/app/models/ChatFolder";
import Message from "@/app/models/Message";
import Comment from "@/app/models/Comment";

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

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect();
    const reqParam = req.nextUrl.searchParams;
    const scope = reqParam.get("scope");
    const workspaceId = reqParam.get("workspaceId") || "";
    const createdBy = reqParam.get("createdBy") || "";
    const id = reqParam.get("id");
    const independent = reqParam.get("independent");
    let chats;

    // get independent chats based on scope
    if (independent && workspaceId && createdBy) {
      if (scope === "public") {
        chats = await Chat.find({
          workspaceId: workspaceId,
          scope: scope,
          parentFolder: null,
          archived: false,
        }).sort({ updatedAt: -1 });
      } else if (scope === "private") {
        chats = await Chat.find({
          workspaceId: workspaceId,
          scope: scope,
          createdBy: createdBy,
          parentFolder: null,
          archived: false,
        }).sort({ updatedAt: -1 });
      }
    }
    //get all chats relevant to workspace and user
    else if (id === "all" && workspaceId && createdBy) {
      chats = await Chat.find({
        workspaceId: workspaceId,
        $or: [{ scope: "public" }, { scope: "private", createdBy: createdBy }],
        archived: false,
      }).sort({ updatedAt: -1 });
    }
    // get archived chats
    else if (id === "archived" && workspaceId && createdBy) {
      chats = await Chat.find({
        workspaceId: workspaceId,
        $or: [{ scope: "public" }, { scope: "private", createdBy: createdBy }],
        archived: true,
      }).sort({ updatedAt: -1 });
    }
    // get specific chat by id
    else if (id && workspaceId) {
      chats = await Chat.find({
        workspaceId: workspaceId,
        _id: id,
      }).populate({
        path: "messages",
        populate: {
          path: "comments",
          populate: {
            path: "replies",
          },
        },
      });
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
    let chat;
    const { id, targetFolderId, parentFolderId, newScope } = body;

    if (id && targetFolderId && parentFolderId) {
      // If the chat currently has a parent folder, remove it from the parent folder's chats
      if (parentFolderId !== "null") {
        await ChatFolder.findByIdAndUpdate(parentFolderId, {
          $pull: { chats: id },
        });
      }

      // If the target folder id is not "null", add the chat to the target folder's chats
      if (targetFolderId !== "public" && targetFolderId !== "private") {
        await ChatFolder.findByIdAndUpdate(targetFolderId, {
          $push: { chats: id },
        });
      }

      // Update the chat's parentFolder
      chat = await Chat.findByIdAndUpdate(
        id,
        {
          parentFolder:
            targetFolderId === "public" || targetFolderId === "private"
              ? null
              : targetFolderId,
        },
        {
          new: true,
        }
      );

      if (newScope) {
        // If newScope is not null, update the scope of all messages in the chat
        await Chat.findByIdAndUpdate(id, { scope: newScope });
        await Message.updateMany({ chat: id }, { scope: newScope });
      }

      chat = await chat?.populate({
        path: "messages",
        populate: {
          path: "comments",
          populate: {
            path: "replies",
          },
        },
      });
      
    } else {
      chat = await Chat.findByIdAndUpdate(body.id, body, {
        new: true,
      }).populate({
        path: "messages",
        populate: {
          path: "comments",
          populate: {
            path: "replies",
          },
        },
      });
    }

    return NextResponse.json({ chat }, { status: 200 });
  } catch (error: any) {
    console.log("error at PUT in Chat route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function DELETE(req: any, res: NextApiResponse) {
  console.log("hit delete chat");
  try {
    await dbConnect();
    const body = await req.json();
    const chat = await Chat.findById(body.id).populate({
      path: "messages",
      populate: {
        path: "comments",
        populate: {
          path: "replies",
        },
      },
    });

    chat?.messages.forEach(async (message: any) => {
      message.comments.forEach(async (comment: any) => {
        comment.replies.forEach(async (reply: any) => {
          await Comment.findByIdAndDelete(reply._id);
        });
        await Comment.findByIdAndDelete(comment._id);
      });
      await Message.findByIdAndDelete(message._id);
    });

    await Chat.findByIdAndDelete(body.id);

    return NextResponse.json(
      { message: "Chat deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
