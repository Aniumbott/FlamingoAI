// Modules
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/db";
import Prompt from "@/app/models/Prompt";
import PromptFolder from "@/app/models/PromptFolder";

// GET request handler
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect();
    const reqParam = req.nextUrl.searchParams;
    const scope = reqParam.get("scope");
    const workspaceId = reqParam.get("workspaceId");
    const createdBy = reqParam.get("createdBy");
    let promptFolders;

    if (scope === "public" && workspaceId) {
      promptFolders = await PromptFolder.find({
        workspaceId: workspaceId,
        scope: scope,
        parentFolder: null,
      }).sort({ updatedAt: -1 });
    } else if (scope === "private" && workspaceId && createdBy) {
      promptFolders = await PromptFolder.find({
        workspaceId: workspaceId,
        scope: scope,
        createdBy: createdBy,
        parentFolder: null,
      }).sort({ updatedAt: -1 });
    } else if (scope === "system") {
      promptFolders = await PromptFolder.find({
        scope: scope,
        parentFolder: null,
      }).sort({ updatedAt: -1 });
    }

    let populatedFolders = [];
    if (promptFolders) {
      for (let folder of promptFolders) {
        let populatedFolder = await populateSubFolders(folder);
        populatedFolders.push(populatedFolder);
      }
      promptFolders = populatedFolders;
    }

    return NextResponse.json({ promptFolders }, { status: 200 });
  } catch (error: any) {
    console.log("error at POST in Chat route: ", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

// POST request handler
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    await dbConnect();
    const promptFolder = await PromptFolder.create({
      name: "New Folder",
      createdBy: body.createdBy,
      scope: body.scope,
      parentFolder: body.parentFolder,
      workspaceId: body.workspaceId,
    });

    // If parentFolder was provided, add the new chat ID to the parent folder's chats array
    if (body.parentFolder) {
      await PromptFolder.findByIdAndUpdate(body.parentFolder, {
        $push: { subFolders: promptFolder._id },
      });
    }

    return NextResponse.json({ promptFolder }, { status: 200 });
  } catch (error: any) {
    console.log("error at POST in Chat route: ", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

// PUT request handler
export async function PUT(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect();
    const body = await req.json();
    let promptFolder;
    const { id, targetFolderId, parentFolderId, newScope } = body;

    if (id && targetFolderId && parentFolderId) {
      // If the prompt folder currently has a parent folder, remove it from the parent folder's subFolders

      if (parentFolderId !== "null") {
        await PromptFolder.findByIdAndUpdate(parentFolderId, {
          $pull: { subFolders: id },
        });
      }

      // If the target folder id is not "null", add the prompt folder to the target folder's subFolders
      if (targetFolderId !== "public" && targetFolderId !== "private") {
        await PromptFolder.findByIdAndUpdate(targetFolderId, {
          $push: { subFolders: id },
        });
      }

      // Update the prompt folder's parentFolder
      promptFolder = await PromptFolder.findByIdAndUpdate(
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
        await updateScope(id, newScope);
      }
    } else {
      promptFolder = await PromptFolder.findByIdAndUpdate(body.id, body, {
        new: true,
      });
    }

    return NextResponse.json({ promptFolder }, { status: 200 });
  } catch (error: any) {
    console.log("error at PUT in Chatfolder route: ", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

// DELETE request handler+
export async function DELETE(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect();
    const body = await req.json();
    // const chatFolder = await ChatFolder.findByIdAndDelete(body.id);
    await deleteFolder(body.id);
    return NextResponse.json(
      { message: "Prompt Folder deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("error at DELETE in Chatfolder route: ", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}

// Helper functions
async function populateSubFolders(folder: any) {
  if (folder.subFolders && folder.subFolders.length > 0) {
    folder = await PromptFolder.populate(folder, {
      path: "subFolders",
      options: { sort: { updatedAt: -1 } },
    });
    for (let i = 0; i < folder.subFolders.length; i++) {
      folder.subFolders[i] = await populateSubFolders(folder.subFolders[i]);
    }
  }

  if (folder.prompts && folder.prompts.length > 0) {
    folder = await PromptFolder.populate(folder, {
      path: "prompts",
      options: { sort: { updatedAt: -1 } },
    });
  }
  return folder;
}

async function updateScope(folderId: any, newScope: any) {
  // Fetch the folder from the database
  const folder = await PromptFolder.findById(folderId);

  // Update the scope of the folder
  await PromptFolder.findByIdAndUpdate(folderId, { scope: newScope });

  // Update the scope of each chat in the folder
  if (folder?.prompts && folder.prompts.length > 0) {
    for (let promptId of folder.prompts) {
      await Prompt.findByIdAndUpdate(promptId, { scope: newScope });
    }
  }

  // Recursively update the scope of each subfolder
  if (folder?.subFolders && folder.subFolders.length > 0) {
    for (let subfolderId of folder.subFolders) {
      await updateScope(subfolderId, newScope);
    }
  }
}

async function deleteFolder(folderId: string) {
  const folder = await PromptFolder.findById(folderId);

  if (folder) {
    // Delete all prompts in folder.prompts
    for (const promptId of folder.prompts) {
      await Prompt.findByIdAndUpdate(promptId, {
        parentFolder: null,
      });
    }
    // Recursively delete all subfolders
    for (const subFolderId of folder.subFolders) {
      await PromptFolder.findByIdAndUpdate(subFolderId._id, {
        parentFolder: null,
      });
    }
    // Delete the folder
    await PromptFolder.findByIdAndDelete(folderId);
  }
}
