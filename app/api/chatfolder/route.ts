// Modules
import { dbConnect } from "@/app/lib/db";
import Chat from "@/app/models/Chat";
import ChatFolder from "@/app/models/ChatFolder";
import type { NextApiResponse } from "next";
import { NextResponse } from "next/server";

// GET request handler
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
      }).sort({ updatedAt: -1 });
    } else if (scope === "private") {
      chatFolder = await ChatFolder.find({
        workspaceId: workspaceId,
        scope: scope,
        createdBy: createdBy,
        parentFolder: null,
      }).sort({ updatedAt: -1 });
    }

    let populatedFolders = [];
    if (chatFolder) {
      for (let folder of chatFolder) {
        let populatedFolder = await populateSubFolders(folder);
        populatedFolders.push(populatedFolder);
      }
      chatFolder = populatedFolders;
    }

    return NextResponse.json({ chatFolder }, { status: 200 });
  } catch (error: any) {
    console.log("error at GET in Chatfolder route: ", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

// POST request handler
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
    }
    return NextResponse.json({ chatFolder }, { status: 200 });
  } catch (error: any) {
    console.log("error in POST at chatfolder route: ", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

// PUT request handler
export async function PUT(req: any, res: NextApiResponse) {
  try {
    await dbConnect();
    const body = await req.json();
    let chatFolder;
    const { id, targetFolderId, parentFolderId, newScope } = body;

    if (id && targetFolderId && parentFolderId) {
      // If the chat folder currently has a parent folder, remove it from the parent folder's subFolders
      if (parentFolderId !== "null") {
        await ChatFolder.findByIdAndUpdate(parentFolderId, {
          $pull: { subFolders: id },
        });
      }

      // If the target folder id is not "null", add the chat folder to the target folder's subFolders
      if (targetFolderId !== "public" && targetFolderId !== "private") {
        await ChatFolder.findByIdAndUpdate(targetFolderId, {
          $push: { subFolders: id },
        });
      }

      // Update the chat folder's parentFolder
      chatFolder = await ChatFolder.findByIdAndUpdate(
        id,
        {
          parentFolder:
            targetFolderId === "public" || targetFolderId === "private"
              ? null
              : targetFolderId,
        },
        {
          new: true,
        },
      );

      // Update the scope of all sub-folders and chats of the chat folder
      if (newScope) {
        await updateScope(id, newScope);
      }
    } else {
      chatFolder = await ChatFolder.findByIdAndUpdate(body.id, body, {
        new: true,
      });
    }
    return NextResponse.json({ chatFolder }, { status: 200 });
  } catch (error: any) {
    console.log("error at PUT in Chatfolder route: ", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

// DELETE request handler
export async function DELETE(req: any, res: NextApiResponse) {
  try {
    await dbConnect();
    const body = await req.json();
    await deleteFolder(body.id);
    return NextResponse.json(
      { message: "Chat Folder deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.log("error at DELETE in Chatfolder route: ", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

// Helper functions
async function deleteFolder(folderId: string) {
  const folder = await ChatFolder.findById(folderId);

  if (folder) {
    // Remove parents of chats in folder.chats
    for (const chatId of folder.chats) {
      const chat = await Chat.findByIdAndUpdate(chatId, {
        // set parent to null
        parentFolder: null,
      });
    }

    // Recursively for all subfolders
    for (const subFolderId of folder.subFolders) {
      await ChatFolder.findByIdAndUpdate(subFolderId._id, {
        parentFolder: null,
      });
    }
    // For the folder
    await ChatFolder.findByIdAndDelete(folderId);
  }
}

async function populateSubFolders(folder: any) {
  if (folder.subFolders && folder.subFolders.length > 0) {
    folder = await ChatFolder.populate(folder, {
      path: "subFolders",
      options: { sort: { updatedAt: -1 } },
    });
    for (let i = 0; i < folder.subFolders.length; i++) {
      folder.subFolders[i] = await populateSubFolders(folder.subFolders[i]);
    }
  }

  if (folder.chats && folder.chats.length > 0) {
    folder = await ChatFolder.populate(folder, {
      path: "chats",
      options: { sort: { updatedAt: -1 } },
    });
  }
  return folder;
}

async function updateScope(folderId: any, newScope: any) {
  // Fetch the folder from the database
  const folder = await ChatFolder.findById(folderId);

  // Update the scope of the folder
  await ChatFolder.findByIdAndUpdate(folderId, { scope: newScope });

  // Update the scope of each chat in the folder
  if (folder?.chats && folder.chats.length > 0) {
    for (let chatId of folder.chats) {
      await Chat.findByIdAndUpdate(chatId, { scope: newScope });
    }
  }

  // Recursively update the scope of each subfolder
  if (folder?.subFolders && folder.subFolders.length > 0) {
    for (let subfolderId of folder.subFolders) {
      await updateScope(subfolderId, newScope);
    }
  }
}
