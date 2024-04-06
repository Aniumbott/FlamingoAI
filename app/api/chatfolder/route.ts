import type { NextApiResponse } from "next";
import { dbConnect } from "@/app/lib/db";
import { NextResponse } from "next/server";
import ChatFolder from "@/app/models/ChatFolder";
import Chat from "@/app/models/Chat";
import Message from "@/app/models/Message";

export async function POST(req: any, res: NextApiResponse) {
  try {
    await dbConnect();
    const body = await req.json();
    const chatFolder = await ChatFolder.create({
      name: "New Folder",
      createdBy: body.createdBy,
      workspaceId: body.workspaceId,
      scope: body.scope,
      subFolders: body.subFolders,
      chats: body.chats,
      parentFolder: body.parentFolder,
    });
    if (body.parentFolder) {
      await ChatFolder.findByIdAndUpdate(body.parentFolder, {
        $push: { subFolders: chatFolder._id },
      });
      // console.log(
      //   "pushed ",
      //   chatFolder._id,
      //   "to parent folder ",
      //   body.parentFolder
      // );
    }
    return NextResponse.json({ chatFolder }, { status: 200 });
  } catch (error: any) {
    // console.log("error in POST at chatfolder route");
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function GET(req: any, res: NextApiResponse) {
  try {
    await dbConnect();

    const reqParam = req.nextUrl.searchParams;
    const scope = reqParam.get("scope");
    const workspaceId = reqParam.get("workspaceId");
    const createdBy = reqParam.get("createdBy");

    // find by workspaceId and socpe
    let chatFolder;
    if (scope === "public") {
      chatFolder = await ChatFolder.find({
        workspaceId: workspaceId,
        scope: scope,
        parentFolder: null,
      });
    } else if (scope === "private") {
      chatFolder = await ChatFolder.find({
        workspaceId: workspaceId,
        scope: scope,
        createdBy: createdBy,
        parentFolder: null,
      });
    }

    let populatedFolders = [];
    if (chatFolder) {
      for (let folder of chatFolder) {
        let populatedFolder = await populateSubFolders(folder);
        populatedFolders.push(populatedFolder);
      }
      chatFolder = populatedFolders;
    }

    // chatFolder = await Promise.all(chatFolder.map(populateSubFolders));

    return NextResponse.json({ chatFolder }, { status: 200 });
  } catch (error: any) {
    // console.log("error at GET in Chatfolder route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function PUT(req: any, res: NextApiResponse) {
  // console.log("hit put chatfolder");
  try {
    await dbConnect();
    const body = await req.json();
    const chatFolder = await ChatFolder.findByIdAndUpdate(body.id, body, {
      new: true,
    });
    return NextResponse.json({ chatFolder }, { status: 200 });
  } catch (error: any) {
    // console.log("error at PUT in Chatfolder route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

export async function DELETE(req: any, res: NextApiResponse) {
  // console.log("hit delete chatfolder");
  try {
    await dbConnect();
    const body = await req.json();
    // const chatFolder = await ChatFolder.findByIdAndDelete(body.id);
    await deleteFolderAndContents(body.id);
    return NextResponse.json(
      { message: "Chat Folder deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    // console.log("error at DELETE in Chatfolder route", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

async function deleteFolderAndContents(folderId: string) {
  const folder = await ChatFolder.findById(folderId);

  if (folder) {
    // Delete all chats in folder.chats
    for (const chatId of folder.chats) {
      const chat = await Chat.findById(chatId);
      if (chat) {
        // Delete all messages in chat.messages
        for (const messageId of chat.messages) {
          await Message.findByIdAndDelete(messageId);
        }
        // Delete the chat
        await Chat.findByIdAndDelete(chatId);
      }
    }

    // Recursively delete all subfolders
    for (const subFolderId of folder.subFolders) {
      await deleteFolderAndContents(subFolderId._id);
    }

    // Delete the folder
    await ChatFolder.findByIdAndDelete(folderId);
  }
}

async function populateSubFolders(folder: any) {
  if (folder.subFolders && folder.subFolders.length > 0) {
    folder = await ChatFolder.populate(folder, { path: "subFolders" });
    for (let i = 0; i < folder.subFolders.length; i++) {
      folder.subFolders[i] = await populateSubFolders(folder.subFolders[i]);
    }
  }

  if (folder.chats && folder.chats.length > 0) {
    folder = await ChatFolder.populate(folder, { path: "chats" });
  }
  return folder;
}
